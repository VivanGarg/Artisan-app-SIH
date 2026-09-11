"""
Train the Artisan Fair-Price Recommendation model (SIH26090).

Predicts a PRICE BAND (low / suggested / high), not a single number, because:
  - artisans need negotiation room, not a rigid "take it or leave it" figure
  - the underlying market data is noisy, so a single point estimate overstates
    precision

Approach: gradient-boosted quantile regression, one model per quantile
(0.1, 0.5, 0.9). Uses sklearn's HistGradientBoostingRegressor(loss="quantile")
by default. If xgboost is installed, it is used instead for speed/accuracy
(same interface, swap is transparent) -- see USE_XGBOOST below.

Features used (all available at LISTING TIME, i.e. before a sale has
happened -- this is the key constraint for a real pricing tool):
  - category            (what kind of product)
  - brand tier          (branded vs unbranded -- artisans are ~always
                         "unbranded" in this corpus, but the feature still
                         lets the model learn the branded-price premium and
                         net it out)
  - description text    (TF-IDF -- captures material/technique keywords like
                         "handmade", "cotton", "brass", "wood carving" etc.)
  - rating               (only used as a weak prior; defaults to median when
                         unknown, which is always true for a brand-new listing)

Target: log1p(price) -- prices are heavy-tailed, log-space stabilizes
training and makes percentage errors comparable across price ranges.
"""
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_pinball_loss

try:
    import xgboost as xgb
    USE_XGBOOST = True
except ImportError:
    USE_XGBOOST = False

import os as _os
_BASE = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..")
DATA_PATH = _os.path.join(_BASE, "data", "unified_dataset.csv")
MODEL_DIR = _os.path.join(_BASE, "models")
QUANTILES = {"low": 0.1, "suggested": 0.5, "high": 0.9}
TFIDF_MAX_FEATURES = 3000
SVD_COMPONENTS = 100  # compress TF-IDF -> dense, keeps HistGBR fast + memory-safe


def load_data():
    return pd.read_csv(DATA_PATH)


def build_features(df, vectorizer=None, svd=None, ohe=None, fit=True):
    """Returns a dense feature matrix X (numpy array). Fits encoders if fit=True, else reuses them."""
    if fit:
        vectorizer = TfidfVectorizer(max_features=TFIDF_MAX_FEATURES, ngram_range=(1, 2), min_df=5)
        text_sparse = vectorizer.fit_transform(df["description_clean"])
        svd = TruncatedSVD(n_components=SVD_COMPONENTS, random_state=42)
        text_feats = svd.fit_transform(text_sparse)  # dense (n, SVD_COMPONENTS)
    else:
        text_sparse = vectorizer.transform(df["description_clean"])
        text_feats = svd.transform(text_sparse)

    df = df.copy()
    df["is_branded"] = (df["brand"].str.lower() != "unbranded").astype(int)
    cat_cols = df[["category"]]
    if fit:
        ohe = OneHotEncoder(handle_unknown="ignore", min_frequency=20, sparse_output=False)
        cat_feats = ohe.fit_transform(cat_cols)
    else:
        cat_feats = ohe.transform(cat_cols)

    numeric_feats = df[["rating", "is_branded"]].to_numpy(dtype=float)
    X = np.hstack([text_feats, cat_feats, numeric_feats])
    return X, vectorizer, svd, ohe


def train():
    df = load_data()
    y = np.log1p(df["price"].to_numpy())

    train_df, test_df, y_train, y_test = train_test_split(
        df, y, test_size=0.15, random_state=42
    )

    X_train, vectorizer, svd, ohe = build_features(train_df, fit=True)
    X_test, _, _, _ = build_features(test_df, vectorizer=vectorizer, svd=svd, ohe=ohe, fit=False)

    print(f"Backend: {'xgboost' if USE_XGBOOST else 'sklearn HistGradientBoostingRegressor'}")
    print(f"Train rows: {X_train.shape[0]:,} | Features: {X_train.shape[1]:,}")

    models = {}
    metrics = {}
    for name, q in QUANTILES.items():
        print(f"\nTraining quantile={q} ({name}) ...")
        if USE_XGBOOST:
            model = xgb.XGBRegressor(
                objective="reg:quantileerror", quantile_alpha=q,
                n_estimators=300, max_depth=6, learning_rate=0.08,
                subsample=0.8, colsample_bytree=0.8, random_state=42, n_jobs=-1,
            )
            model.fit(X_train, y_train)
        else:
            model = HistGradientBoostingRegressor(
                loss="quantile", quantile=q,
                max_iter=300, learning_rate=0.08, max_depth=8, random_state=42,
            )
            model.fit(X_train, y_train)

        pred_log = model.predict(X_test)
        pred = np.expm1(pred_log)
        actual = np.expm1(y_test)

        mae = mean_absolute_error(actual, pred)
        pinball = mean_pinball_loss(y_test, pred_log, alpha=q)
        metrics[name] = {"quantile": q, "MAE_rupees": round(mae, 2), "pinball_loss": round(pinball, 4)}
        print(f"  MAE: Rs.{mae:,.0f} | pinball loss: {pinball:.4f}")

        models[name] = model

    # sanity check: bands should be ordered low <= suggested <= high for most rows
    low_pred = np.expm1(models["low"].predict(X_test))
    high_pred = np.expm1(models["high"].predict(X_test))
    valid_band_pct = (low_pred <= high_pred).mean() * 100
    print(f"\nBand consistency (low <= high): {valid_band_pct:.1f}% of test rows")
    metrics["band_consistency_pct"] = round(valid_band_pct, 1)

    joblib.dump(models, f"{MODEL_DIR}/quantile_models.joblib")
    joblib.dump(vectorizer, f"{MODEL_DIR}/tfidf_vectorizer.joblib")
    joblib.dump(svd, f"{MODEL_DIR}/svd.joblib")
    joblib.dump(ohe, f"{MODEL_DIR}/category_encoder.joblib")
    with open(f"{MODEL_DIR}/metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nSaved models + encoders to {MODEL_DIR}/")
    return metrics


if __name__ == "__main__":
    train()
