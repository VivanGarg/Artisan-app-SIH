"""
Trains a category classifier for the KalaSetu auto-cataloger (SIH26090).

Why this exists: the pricing model needs a `category`, but an artisan speaking
into the app should not have to pick one from a list of 152 - especially not in
English. This model infers the category from the spoken description, so the
voice flow becomes:

    speech -> text -> [this model] -> category -> price band

Run:
    python src/train_category.py
"""
import json
import os

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, top_k_accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data", "unified_dataset.csv")
MODEL_DIR = os.path.join(HERE, "..", "models")

# Categories rarer than this are dropped: too few examples to learn, and they
# drag down precision on the categories that actually matter.
MIN_SAMPLES = 150


def main():
    df = pd.read_csv(DATA)
    df = df.dropna(subset=["description_clean", "category"])
    df = df[df["description_clean"].str.len() > 10]

    # Drop malformed category labels left over from the raw scrapes.
    df = df[~df["category"].str.contains(r'^[\["\']', regex=True, na=False)]

    counts = df["category"].value_counts()
    keep = counts[counts >= MIN_SAMPLES].index
    df = df[df["category"].isin(keep)]

    print(f"training rows: {len(df):,}  categories: {df['category'].nunique()}")

    X_train, X_test, y_train, y_test = train_test_split(
        df["description_clean"], df["category"],
        test_size=0.15, random_state=42, stratify=df["category"],
    )

    # SGD with modified_huber loss: linear-SVM-like margins on sparse text but
    # with a native predict_proba, in a single pass. The UI needs those
    # probabilities to decide whether to trust the auto-detected category or
    # fall back to asking the artisan, and calibrating a LinearSVC across 152
    # classes costs minutes we do not need to spend.
    pipe = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2), min_df=3, max_features=120_000,
            sublinear_tf=True, strip_accents="unicode",
        )),
        ("clf", SGDClassifier(
            loss="modified_huber", alpha=1e-5, max_iter=15,
            tol=1e-3, random_state=42, n_jobs=-1,
        )),
    ])

    print("fitting...")
    pipe.fit(X_train, y_train)

    proba = pipe.predict_proba(X_test)
    pred = pipe.classes_[proba.argmax(axis=1)]
    top1 = accuracy_score(y_test, pred)
    top3 = top_k_accuracy_score(y_test, proba, k=3, labels=pipe.classes_)

    print(f"top-1 accuracy: {top1:.3f}")
    print(f"top-3 accuracy: {top3:.3f}")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipe, os.path.join(MODEL_DIR, "category_classifier.joblib"))
    with open(os.path.join(MODEL_DIR, "category_metrics.json"), "w") as f:
        json.dump({
            "top1_accuracy": round(float(top1), 4),
            "top3_accuracy": round(float(top3), 4),
            "n_categories": int(df["category"].nunique()),
            "n_train": int(len(X_train)),
            "min_samples_per_category": MIN_SAMPLES,
        }, f, indent=2)
    print("saved -> models/category_classifier.joblib")


if __name__ == "__main__":
    main()
