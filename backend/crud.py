from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional
from datetime import datetime

def get_shipment(db: Session, shipment_id: str):
    return db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()

def get_shipments(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None, search: Optional[str] = None):
    query = db.query(models.Shipment)
    
    if status:
        query = query.filter(models.Shipment.status == status)
    
    if search:
        query = query.filter(
            models.Shipment.id.contains(search) |
            models.Shipment.origin.contains(search) |
            models.Shipment.destination.contains(search) |
            models.Shipment.carrier.contains(search)
        )
    
    return query.offset(skip).limit(limit).all()

def create_shipment(db: Session, shipment: schemas.ShipmentCreate, shipment_id: str):
    db_shipment = models.Shipment(
        id=shipment_id,
        origin=shipment.origin,
        destination=shipment.destination,
        status=shipment.status,
        carrier=shipment.carrier,
        estimated_delivery=shipment.estimated_delivery,
        current_location=shipment.current_location,
        origin_lat=shipment.origin_lat,
        origin_lng=shipment.origin_lng,
        dest_lat=shipment.dest_lat,
        dest_lng=shipment.dest_lng
    )
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

def update_shipment(db: Session, shipment_id: str, shipment_update: schemas.ShipmentUpdate):
    db_shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if db_shipment:
        update_data = shipment_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_shipment, field, value)
        db_shipment.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_shipment)
    return db_shipment
