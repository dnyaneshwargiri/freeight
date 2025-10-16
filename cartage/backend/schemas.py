from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ShipmentBase(BaseModel):
    origin: str
    destination: str
    status: str = "pending"
    carrier: str
    estimated_delivery: datetime
    current_location: Optional[str] = None
    origin_lat: float
    origin_lng: float
    dest_lat: float
    dest_lng: float

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentUpdate(BaseModel):
    status: Optional[str] = None
    current_location: Optional[str] = None

class ShipmentResponse(ShipmentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
