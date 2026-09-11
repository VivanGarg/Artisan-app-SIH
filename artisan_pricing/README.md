# Artisan Fair-Price Recommendation Engine
### SIH 2026 · Problem Statement SIH26090 · "AI-Driven Market Linkage and Smart Cataloging Mobile Application for Marginalized Artisans" (Ministry of Social Justice & Empowerment)

This is the **price-recommendation module** of the PS26090 pipeline:

```
photo → AI enhance → voice description → multilingual catalog
      → PRICE RECOMMENDATION (this project) → quality check
      → buyer matching → marketplace-ready listing
```

## What it does

Given a new listing's **category** and **description** (from the artisan's
voice input, translated to text), it returns a **price band**:

```json
{"low": 296.09, "suggested": 576.50, "high": 1346.13, "category_used": "Sarees"}
```

A band — not a single number — because:
1. Artisans need room to negotiate, not a "take it or leave it" figure.
2. The comparable-price data is inherently noisy; a single point estimate
   overstates precision.
3. The band itself is a **fairness signal**: if an artisan's own asking price
   falls well below `low`, the app can flag "you may be underpricing this."

## Why this approach, not literal "dynamic/surge pricing"

Surge pricing (Uber/airlines-style, adjusting live prices to demand) doesn't
fit this use case — an artisan doesn't re-price a handwoven saree by the
hour. What the problem statement actually needs is a **market-benchmark /
comparable-pricing model**: "what do similar products sell for, so this
artisan doesn't get lowballed by a middleman." That's what's built here.

## Data used (and its limitation)

No public artisan-transaction dataset exists, so this prototype uses two
general Indian e-commerce datasets as a **market-comparables corpus**:

| Dataset | Rows used | Gives us |
|---|---|---|
| `Fashion_Data.csv` (Ajio scrape) | ~179K | category, price, MRP, brand, product description |
| `flipkart_com-ecommerce_sample.csv` | ~20K | category tree, price, description, brand, rating |

Unified into ~199K rows across 152 categories after collapsing the long tail
(`src/data_prep.py`).

**This is a stand-in, not the real signal.** For the actual hackathon
submission, replace/augment with:
- ONDC network product + order data (if accessible via the Seller Network
  Participant APIs)
- State handicraft emporium (e.g. Tantuja, Khadi Gramodyog, Dilli Haat)
  price lists
- GI-tag registry data, to add a legitimate heritage-premium feature
- Manually collected artisan cost data (material + labor hours) — this is
  the single highest-value addition, since it lets the model reason about
  *cost-plus* pricing, not just *market comparable* pricing

Swap the source in `src/data_prep.py` — the `load_fashion()` /
`load_flipkart()` functions are just examples of the loader pattern; add a
`load_artisan()` following the same shape (`category, brand, description,
rating, price`) and include it in `build_unified_dataset()`.

## Model

Gradient-boosted **quantile regression** — three independent models
predicting the 10th / 50th / 90th percentile of `log1p(price)`:

- **Backend**: sklearn `HistGradientBoostingRegressor(loss="quantile")` by
  default. If `xgboost` is installed, `src/train_model.py` auto-switches to
  `XGBRegressor(objective="reg:quantileerror")` — same interface, just
  faster/more accurate on categorical splits. (This sandbox had no network
  access to install xgboost, so results below are the sklearn backend;
  install xgboost and rerun for a likely improvement.)
- **Features** (all available *before* a sale happens — this matters, since
  a brand-new listing has no sales history):
  - TF-IDF over the description (1-2 grams) → compressed to 100 dims via
    TruncatedSVD (keeps the model fast and memory-safe on ~200K rows)
  - Category, one-hot encoded (rare categories bucketed into "infrequent")
  - `is_branded` flag, and rating (defaults to a neutral prior for new listings)
- **Target**: `log1p(price)` — prices are heavy-tailed; log-space keeps
  errors proportional across the ₹100 vs ₹10,000 range.

## Results (on held-out 15% test split, sklearn backend)

| Quantile | MAE | Pinball loss |
|---|---|---|
| 0.10 (low) | ₹471 | 0.0700 |
| 0.50 (suggested) | ₹293 | 0.1672 |
| 0.90 (high) | ₹509 | 0.0844 |

- **79.1%** of actual prices fall inside the predicted [low, high] band
  (target for a 10th–90th percentile band is ~80% — well calibrated).
- **22.6%** median absolute percentage error on the suggested price — expected,
  given the model only sees category + text, no cost/labor data. This number
  should drop substantially once real artisan cost data is added.

## Project structure

```
artisan_pricing/
├── data/
│   └── unified_dataset.csv        # cleaned, merged training table
├── models/                        # saved model + encoders (joblib)
├── src/
│   ├── data_prep.py                # raw CSVs -> unified_dataset.csv
│   ├── train_model.py              # feature engineering + quantile training
│   ├── predict.py                  # PriceRecommender class (load + infer)
│   └── app.py                      # FastAPI serving endpoint
├── requirements.txt
└── README.md
```

## Running it

```bash
pip install -r requirements.txt

# 1. rebuild the training table from raw CSVs
python src/data_prep.py

# 2. train the 3 quantile models
python src/train_model.py

# 3. try it from Python
python src/predict.py

# 4. or serve it as an API
cd src && uvicorn app:app --reload --port 8000
curl -X POST localhost:8000/recommend-price \
  -H "Content-Type: application/json" \
  -d '{"category": "Sarees", "description": "handwoven pure silk saree with zari border"}'
```

## Next steps for the full SIH26090 submission

1. **Add real artisan cost inputs** (material cost, labor hours) as a second
   model — a cost-plus floor — and take `max(cost_plus_floor, market_low)` as
   the actual `low` bound, so the app never recommends a price below the
   artisan's break-even.
2. **Explainability** — add SHAP so the app can show *why* a price was
   suggested (which keywords/category drove it) — judges will ask this, and
   it builds artisan trust in the number.
3. **Feedback loop** — once real sales happen through the app, retrain
   periodically on actual artisan transaction data instead of the general
   e-commerce proxy corpus used here.
4. **Multilingual description handling** — the voice-to-text pipeline
   upstream should normalize to a single language before this model sees it,
   or the TF-IDF vectorizer needs per-language fitting.
