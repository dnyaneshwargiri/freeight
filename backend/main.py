from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime, timedelta

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shipment Tracker API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Shipment Tracker API", "version": "1.0.0"}

@app.get("/api/shipments", response_model=List[schemas.ShipmentResponse])
def get_shipments(
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search in ID, origin, destination, carrier"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    shipments = crud.get_shipments(db, skip=skip, limit=limit, status=status, search=search)
    return shipments

@app.get("/api/shipments/{shipment_id}", response_model=schemas.ShipmentResponse)
def get_shipment(shipment_id: str, db: Session = Depends(get_db)):
    shipment = crud.get_shipment(db, shipment_id=shipment_id)
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@app.post("/api/shipments", response_model=schemas.ShipmentResponse)
def create_shipment(shipment: schemas.ShipmentCreate, db: Session = Depends(get_db)):
    shipment_id = f"SHP{str(uuid.uuid4())[:8].upper()}"
    return crud.create_shipment(db=db, shipment=shipment, shipment_id=shipment_id)

@app.patch("/api/shipments/{shipment_id}", response_model=schemas.ShipmentResponse)
def update_shipment(
    shipment_id: str, 
    shipment_update: schemas.ShipmentUpdate, 
    db: Session = Depends(get_db)
):
    shipment = crud.update_shipment(db, shipment_id=shipment_id, shipment_update=shipment_update)
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

# Seed data endpoint for development
@app.post("/api/seed")
def seed_database(db: Session = Depends(get_db)):
    """Seed the database with sample shipment data"""
    sample_shipments = [
        {
            "origin": "Los Angeles, CA",
            "destination": "New York, NY",
            "status": "in_transit",
            "carrier": "Swift Logistics",
            "estimated_delivery": datetime.utcnow() + timedelta(days=3),
            "current_location": "Denver, CO",
            "origin_lat": 34.0522,
            "origin_lng": -118.2437,
            "dest_lat": 40.7128,
            "dest_lng": -74.0060
        },
        {
            "origin": "Chicago, IL",
            "destination": "Miami, FL",
            "status": "delivered",
            "carrier": "Freight Masters",
            "estimated_delivery": datetime.utcnow() - timedelta(days=1),
            "current_location": "Miami, FL",
            "origin_lat": 41.8781,
            "origin_lng": -87.6298,
            "dest_lat": 25.7617,
            "dest_lng": -80.1918
        },
        {
            "origin": "Seattle, WA",
            "destination": "Portland, OR",
            "status": "pending",
            "carrier": "Pacific Transport",
            "estimated_delivery": datetime.utcnow() + timedelta(days=1),
            "current_location": "Seattle, WA",
            "origin_lat": 47.6062,
            "origin_lng": -122.3321,
            "dest_lat": 45.5152,
            "dest_lng": -122.6784
        },
        {
            "origin": "Houston, TX",
            "destination": "Dallas, TX",
            "status": "in_transit",
            "carrier": "Texas Freight",
            "estimated_delivery": datetime.utcnow() + timedelta(days=2),
            "current_location": "Austin, TX",
            "origin_lat": 29.7604,
            "origin_lng": -95.3698,
            "dest_lat": 32.7767,
            "dest_lng": -96.7970
        },
        {
            "origin": "Phoenix, AZ",
            "destination": "Las Vegas, NV",
            "status": "delivered",
            "carrier": "Desert Logistics",
            "estimated_delivery": datetime.utcnow() - timedelta(hours=6),
            "current_location": "Las Vegas, NV",
            "origin_lat": 33.4484,
            "origin_lng": -112.0740,
            "dest_lat": 36.1699,
            "dest_lng": -115.1398
        },
        {
            "origin": "Boston, MA",
            "destination": "Philadelphia, PA",
            "status": "in_transit",
            "carrier": "Northeast Transport",
            "estimated_delivery": datetime.utcnow() + timedelta(days=1),
            "current_location": "Hartford, CT",
            "origin_lat": 42.3601,
            "origin_lng": -71.0589,
            "dest_lat": 39.9526,
            "dest_lng": -75.1652
        },
        {
            "origin": "Atlanta, GA",
            "destination": "Nashville, TN",
            "status": "pending",
            "carrier": "Southern Express",
            "estimated_delivery": datetime.utcnow() + timedelta(days=2),
            "current_location": "Atlanta, GA",
            "origin_lat": 33.7490,
            "origin_lng": -84.3880,
            "dest_lat": 36.1627,
            "dest_lng": -86.7816
        },
        {
            "origin": "San Francisco, CA",
            "destination": "Los Angeles, CA",
            "status": "delivered",
            "carrier": "California Freight",
            "estimated_delivery": datetime.utcnow() - timedelta(days=2),
            "current_location": "Los Angeles, CA",
            "origin_lat": 37.7749,
            "origin_lng": -122.4194,
            "dest_lat": 34.0522,
            "dest_lng": -118.2437
        }
    ]
    
    created_shipments = []
    for shipment_data in sample_shipments:
        shipment_id = f"SHP{str(uuid.uuid4())[:8].upper()}"
        shipment = schemas.ShipmentCreate(**shipment_data)
        created_shipment = crud.create_shipment(db=db, shipment=shipment, shipment_id=shipment_id)
        created_shipments.append(created_shipment)
    
    return {"message": f"Created {len(created_shipments)} sample shipments", "shipments": created_shipments}
