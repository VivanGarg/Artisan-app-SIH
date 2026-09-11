"""
FastAPI service for the Artisan Fair-Price Recommendation model (SIH26090).

Run:
    uvicorn app:app --reload --port 8000

Then:
    POST /recommend-price
    {
      "category": "Sarees",
      "description": "handwoven pure silk saree with zari border, Banarasi weave",
      "rating": null,
      "brand": null
    }

    -> {"low": 296.09, "suggested": 576.5, "high": 1346.13, "category_used": "Sarees"}
"""
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict import PriceRecommender

app = FastAPI(title="Artisan Fair-Price Recommendation API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
recommender = PriceRecommender()


class ProductInput(BaseModel):
    category: str
    description: str
    rating: Optional[float] = None
    brand: Optional[str] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recommend-price")
def recommend_price(product: ProductInput):
    return recommender.recommend(
        category=product.category,
        description=product.description,
        rating=product.rating,
        brand=product.brand,
    )
