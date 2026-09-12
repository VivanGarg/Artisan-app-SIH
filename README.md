# KalaSetu (कला सेतु)

**SIH 2026 · Problem Statement 26090** — *AI-Driven Market Linkage and Smart
Cataloging Mobile Application for Marginalized Artisans*
Ministry of Social Justice & Empowerment (MoSJE)

A mobile-first marketplace that lets artisans list handloom and handicraft
products by **speaking**, prices their work against a **fair-price model**, and
pushes the listing toward ONDC / government e-marketplaces — without requiring
digital literacy, English, or photography skills.

---

## Architecture

Three services. They are separate processes and can be developed independently.

```
  Phone browser / Android WebView
            |
            |  (same origin - see "Mobile networking" below)
            v
  frontend/         React 19 + Vite + Capacitor        :5173
            |
            |  /api/*   proxied by Vite in dev
            v
  backend/          Node + Express + Mongoose          :5000
            |
            |  POST /recommend-price
            v
  artisan_pricing/  Python + FastAPI + XGBoost         :8000
                    (quantile price-band model)
```

| Directory | What it is |
|---|---|
| `frontend/` | React app. Buyer feed + Karigar (artisan) Studio. Wrapped with Capacitor for Android. |
| `backend/` | Express API. Products, artisans, orders/escrow, JWT auth. Proxies pricing to the ML service. |
| `artisan_pricing/` | All three ML features: fair-price model, multilingual auto-cataloger, and image enhancer. Named for the pricing model it started as. |
| `stitch_karigarsetu_artisan_marketplace/` | Original Stitch design exports (reference only, not built). |

---

## Prerequisites

- **Node.js 20+** and npm
- **Python 3.11+**
- MongoDB is **optional** — the backend falls back to in-memory storage if it
  can't connect (see "MongoDB is optional" below)

---

## Quick start

Run each in its own terminal, in this order.

### 1. ML pricing service (port 8000)

```bash
cd artisan_pricing
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt   # Windows
# source .venv/bin/activate && pip install -r requirements.txt  # macOS/Linux

cd src
../.venv/Scripts/python.exe -m uvicorn app:app --host 0.0.0.0 --port 8000
```

Verify: `curl http://localhost:8000/health` → `{"status":"ok"}`

> **xgboost is required, not optional.** The committed
> `artisan_pricing/models/quantile_models.joblib` is an XGBoost pickle, so
> loading it without xgboost installed fails with `ModuleNotFoundError`.

### 2. Backend API (port 5000)

```bash
cd backend
npm install
cp .env.example .env      # then edit if needed
node server.js
```

Verify: `curl http://localhost:5000/api/health`

### 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open `http://localhost:5173`, or from a phone on the same Wi-Fi use the
`Network:` URL that Vite prints.

---

## Mobile networking — read this before touching `api.js`

This is the part that is easy to get wrong, and it has already broken once.

`frontend/src/api.js` resolves its base URL like this:

```js
const API_BASE = import.meta.env.VITE_API_BASE || '/api';
```

**In the browser (dev server), leave `VITE_API_BASE` unset.** The app then calls
a *relative* `/api`, which the Vite dev server proxies to `localhost:5000`
(`vite.config.js`). Because the request is same-origin, there is no CORS
preflight, no mixed-content blocking, and nothing for a client or captive
portal to reject. **This is the correct setup for a laptop + phone demo over
Wi-Fi.**

**In the packaged Android APK there is no dev server and no proxy.** The
WebView's origin is `https://localhost`, so a relative `/api` resolves to the
*phone itself* and every call fails while the UI still renders — which looks
like "only the frontend works". For an APK build you must set an absolute URL
in `frontend/.env`:

```
VITE_API_BASE=http://<your-laptop-LAN-IP>:5000/api
```

…and rebuild with `npm run cap:build`. Because the WebView origin is HTTPS and
that URL is plain HTTP, the APK also needs cleartext enabled — already
configured in `capacitor.config.json` (`server.cleartext`,
`android.allowMixedContent`) and `AndroidManifest.xml`
(`android:usesCleartextTraffic`).

`frontend/.env` is gitignored, so it does **not** travel with a clone. Each
person builds their own from `frontend/.env.example`.

---

## Environment variables

`backend/.env` (copy from `.env.example`):

| Variable | Purpose |
|---|---|
| `PORT` | API port, default `5000` |
| `MONGO_URI` | MongoDB connection string. Omit or leave unreachable to use the in-memory fallback. |
| `JWT_SECRET` | Signing secret for auth tokens. **Required** for login/register. |
| `ML_SERVICE_URL` | Where the pricing service lives, default `http://localhost:8000` |

`frontend/.env` — only `VITE_API_BASE`, and only for APK builds (see above).

> Never commit `.env`, `*.pem`, or `*.key`. They are gitignored; keep it that way.

---

## API reference

| Method | Route | Notes |
|---|---|---|
| GET | `/api/health` | Liveness probe |
| POST | `/api/auth/register` | → JWT |
| POST | `/api/auth/login` | → JWT |
| GET | `/api/auth/profile` | Requires `Authorization: Bearer <token>` |
| GET | `/api/products` | Filters: `category`, `giOnly`, `search`, `minPrice`, `maxPrice`, `sort` |
| GET | `/api/products/:id` | |
| POST | `/api/products/:id/review` | |
| GET | `/api/artisans` · `/api/artisans/:id` | |
| POST | `/api/orders` · GET `/api/orders/:id` | Order + escrow tracking |
| POST | `/api/pricing/recommend` | Fair-price band |
| POST | `/api/ml/catalog` | Spoken transcript → title, description, keywords, category |
| POST | `/api/ml/enhance-image` | Phone photo → listing-grade image |
| POST | `/api/ml/listing/draft` | All three chained: voice + photo → complete draft listing |

Everything under `/api/ml` and `/api/pricing` is proxied to the Python service;
the frontend never talks to port 8000 directly, because on a phone that port is
not routable.

Pricing request / response:

```jsonc
// POST /api/pricing/recommend
{ "category": "Sarees", "description": "handwoven banarasi silk saree" }

// -> a price BAND, not a single number
{ "success": true,
  "data": { "low": 225.5, "suggested": 485.93, "high": 1344.91,
            "category_used": "Sarees" } }
```

A band rather than a point estimate because the artisan needs negotiating room,
the comparables data is noisy, and the lower bound doubles as an
**underpricing warning**.

---

## MongoDB is optional

`backend/src/config/db.js` attempts a connection with a 2-second timeout. If
MongoDB is absent it logs a warning and serves seeded in-memory data instead.

That is fine for demos, but **state resets whenever the backend restarts** — so
do not restart it mid-presentation.

---

## The three AI features

All three the problem statement asks for are implemented and served from the
Python service.

### 1. Image enhancer — `image_enhance.py`

Phone photo → subject isolated on white, colour cast and exposure corrected,
framed square at 1200×1200. Classical CV (GrabCut + CLAHE + damped gray-world),
chosen over a segmentation network so it needs no model download and runs
offline in ~2s on a laptop CPU.

Two decisions worth knowing before changing it:

* **Segmentation runs at 512px**, not full resolution. GrabCut is linear in
  pixel count, so full-res took 13s on a 0.6 MP image and would have taken a
  minute on a real phone photo. Low-res also happens to *improve* results, as
  downscaling averages away small background clutter before GrabCut sees it.
* **White balance is damped to 55%.** Full gray-world assumes the scene
  averages to neutral, which is false when one saturated textile fills the
  frame — it turned a maroon saree purple.

It degrades honestly: if it can't find a confident subject it keeps the
original background and says so in `report.warnings`.

### 2. Multilingual auto-cataloger — `cataloger.py`

Spoken transcript (Hindi, romanised Hindi, English, or a mix) → English title,
description, bullets and SEO keywords.

Translation is a **craft-domain glossary**, not a neural translator — roughly
200 terms covering weaves, fibres, techniques, GI clusters and colours. A
general NMT model mangles exactly this vocabulary ("dokra", "bandhani") while
costing hundreds of megabytes. Words outside the glossary pass through
untouched and are reported in `unrecognised_terms`, so the lexicon can be grown
from real usage.

### 3. Category detection — `train_category.py`

So the artisan never picks from a list of 84 English categories. Resolution
order is **artisan's own choice → craft lexicon → classifier**, and the
classifier only counts above a confidence floor.

The lexicon is primary for a measured reason. Trained on full-length
descriptions the classifier scored 0.992 held-out and then predicted
"Jewellery" at confidence 1.0 for a Chanderi saree — a perfect score on a
distribution it never sees in production. Retraining on truncated,
speech-length text fixed the overconfidence, but a weaver who says "saree" has
already told us the category, so the model now only runs when the lexicon finds
no product. Anything it decides is flagged `needs_confirmation: true`.

## Known gaps

- Speech-to-text is the browser's Web Speech API, which needs connectivity and
  Chrome. On-device Indic ASR is the obvious next step.
- The pricing corpus is general Indian e-commerce, not artisan transactions —
  see `artisan_pricing/README.md` for what to replace it with.
- No cost-plus floor yet: the band is market-comparable only, so it cannot
  currently guarantee a price above the artisan's own material + labour cost.

---

## Troubleshooting

**Only the frontend works; all data is empty.** The API base is wrong — see
"Mobile networking" above.

**ML service exits with `ModuleNotFoundError: No module named 'xgboost'`.**
Install it: `pip install xgboost`.

**Phone can't reach the laptop.** Both must be on the same Wi-Fi, the dev
server must be started with `--host 0.0.0.0`, and the laptop firewall must
allow inbound Node connections on the active network profile.

**Gradle fails with `Unable to establish loopback connection`.** This is a
Windows machine-level fault, not a project problem — Java cannot open NIO
selectors. Verify with a 3-line `Selector.open()` test. Fix: run
`netsh winsock reset` as Administrator and reboot.
