"""
Data preparation for the Artisan Fair-Price Recommendation model (SIH26090).

Unifies two general e-commerce datasets (Ajio/Fashion scrape + Flipkart sample)
into one clean table of {category, brand, description, rating, price}.

This unified table stands in for "market benchmark" data: given an artisan's
product category + description, we want to know what similar products sell
for in the broader market, so we can recommend a fair price band instead of
a single guessed number.

NOTE: These are general retail/fashion datasets, not artisan-specific data.
They are used here as a stand-in market-comparables corpus. When real artisan
transaction data is available (e.g. from ONDC, GeM, or state emporiums), swap
it in via `load_fashion()` / `load_flipkart()` style loaders below, or add a
new `load_artisan()` loader and include it in `build_unified_dataset()`.
"""
import re
import json
import pandas as pd
import numpy as np

FASHION_PATH = "/mnt/user-data/uploads/Fashion_Data.csv"
FLIPKART_PATH = "/mnt/user-data/uploads/flipkart_com-ecommerce_sample.csv"

MIN_PRICE, MAX_PRICE = 20, 50000  # sane bounds; drop obvious junk/outlier rows


def load_fashion(path: str = FASHION_PATH) -> pd.DataFrame:
    df = pd.read_csv(path, on_bad_lines="skip")
    df = df.rename(columns={"selling_price": "price", "star_rating": "rating"})
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
    df["description"] = (
        df["title"].fillna("") + " " + df["product_detials"].fillna("")
    ).str.strip()
    df["brand"] = df["brand"].fillna("Unbranded")
    df["source"] = "fashion_ajio"
    return df[["category", "brand", "description", "rating", "price", "source"]]


def _extract_leaf_category(tree_str: str) -> str:
    """product_category_tree is like '["A >> B >> C >> Product Name"]'; take top-level A."""
    try:
        items = json.loads(tree_str.replace("'", '"')) if tree_str.startswith("[") else [tree_str]
        path = items[0] if items else ""
    except Exception:
        path = tree_str or ""
    parts = [p.strip() for p in path.split(">>")]
    return parts[0] if parts and parts[0] else "Unknown"


def load_flipkart(path: str = FLIPKART_PATH) -> pd.DataFrame:
    df = pd.read_csv(path, on_bad_lines="skip")
    df = df.rename(columns={"discounted_price": "price"})
    df["category"] = df["product_category_tree"].fillna("Unknown").apply(_extract_leaf_category)
    df["description"] = (
        df["product_name"].fillna("") + " " + df["description"].fillna("")
    ).str.strip()
    df["brand"] = df["brand"].fillna("Unbranded")
    # overall_rating is text like "No rating available" or a number-as-string
    df["rating"] = pd.to_numeric(df["overall_rating"], errors="coerce")
    df["source"] = "flipkart"
    return df[["category", "brand", "description", "rating", "price", "source"]]


def clean_text(s: str) -> str:
    s = str(s).lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_unified_dataset() -> pd.DataFrame:
    fashion = load_fashion()
    flipkart = load_flipkart()
    df = pd.concat([fashion, flipkart], ignore_index=True)

    # basic cleaning
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["price", "category", "description"])
    df = df[(df["price"] >= MIN_PRICE) & (df["price"] <= MAX_PRICE)]
    df["description_clean"] = df["description"].apply(clean_text)
    df = df[df["description_clean"].str.len() > 3]

    # collapse rare categories (long tail) into "Other" to keep encoding sane
    cat_counts = df["category"].value_counts()
    rare_cats = cat_counts[cat_counts < 20].index
    df["category"] = df["category"].where(~df["category"].isin(rare_cats), "Other")

    df["rating"] = df["rating"].fillna(df["rating"].median())
    df = df.reset_index(drop=True)
    return df[["category", "brand", "description_clean", "rating", "price", "source"]]


if __name__ == "__main__":
    df = build_unified_dataset()
    out_path = "/home/claude/artisan_pricing/data/unified_dataset.csv"
    df.to_csv(out_path, index=False)
    print(f"Saved {len(df):,} rows -> {out_path}")
    print(df["source"].value_counts())
    print(df["category"].nunique(), "categories after collapsing rare ones")
    print(df["price"].describe())
