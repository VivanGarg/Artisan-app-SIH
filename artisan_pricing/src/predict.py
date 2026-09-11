"""
Inference for the Artisan Fair-Price Recommendation model (SIH26090).

Given a new listing's category + free-text description (+ optional rating/
brand), returns a price band: {low, suggested, high}.

Usage:
    from predict import PriceRecommender
    rec = PriceRecommender()
    rec.recommend(category="Sarees", description="handwoven pure silk saree with zari border")
    # -> {'low': 812.0, 'suggested': 1450.0, 'high': 2630.0, 'category_matched': 'Sarees'}
"""
import re
import joblib
import numpy as np
import pandas as pd

import os as _os
MODEL_DIR = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "models")


def clean_text(s: str) -> str:
    s = str(s).lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


class PriceRecommender:
    def __init__(self, model_dir: str = MODEL_DIR):
        self.models = joblib.load(f"{model_dir}/quantile_models.joblib")
        self.vectorizer = joblib.load(f"{model_dir}/tfidf_vectorizer.joblib")
        self.svd = joblib.load(f"{model_dir}/svd.joblib")
        self.ohe = joblib.load(f"{model_dir}/category_encoder.joblib")
        # median rating fallback (a brand-new listing has no rating yet)
        self.default_rating = 4.0

    def _featurize(self, category: str, description: str, rating: float | None, brand: str | None) -> np.ndarray:
        desc_clean = clean_text(description)
        text_sparse = self.vectorizer.transform([desc_clean])
        text_feats = self.svd.transform(text_sparse)

        cat_df = pd.DataFrame({"category": [category]})
        cat_feats = self.ohe.transform(cat_df)

        is_branded = int(bool(brand) and brand.strip().lower() not in ("", "unbranded"))
        rating_val = rating if rating is not None else self.default_rating
        numeric_feats = np.array([[rating_val, is_branded]], dtype=float)

        return np.hstack([text_feats, cat_feats, numeric_feats])

    def recommend(self, category: str, description: str, rating: float | None = None,
                  brand: str | None = None) -> dict:
        X = self._featurize(category, description, rating, brand)
        result = {}
        for name, model in self.models.items():
            pred_log = model.predict(X)[0]
            result[name] = round(float(np.expm1(pred_log)), 2)

        # enforce monotonic band even in the rare case a quantile crossing occurs
        low, mid, high = result["low"], result["suggested"], result["high"]
        low, mid, high = sorted([low, mid, high])
        result = {"low": low, "suggested": mid, "high": high}
        result["category_used"] = category
        return result


if __name__ == "__main__":
    rec = PriceRecommender()

    examples = [
        dict(category="Sarees", description="handwoven pure silk saree with zari border, Banarasi weave"),
        dict(category="Footwear", description="handmade leather juttis, traditional Punjabi jutti embroidered"),
        dict(category="Dress Material", description="block printed cotton fabric, natural dye, Bagru print"),
    ]
    for ex in examples:
        print(ex, "->", rec.recommend(**ex))
