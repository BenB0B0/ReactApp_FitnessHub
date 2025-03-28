import uuid
from . import db
from sqlalchemy.sql import func

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(10000))
    length = db.Column(db.Float)
    is_miles = db.Column(db.Boolean, default=True)
    url = db.Column(db.String(10000))
    date = db.Column(db.Date, default=func.current_date())
    user_id = db.Column(db.String, db.ForeignKey('user.id'))

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)