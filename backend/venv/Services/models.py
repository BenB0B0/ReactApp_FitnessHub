import uuid
from . import db
from sqlalchemy.sql import func

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(10000))
    time_length = db.Column(db.Float)
    distance = db.Column(db.Float)
    url = db.Column(db.String(10000))
    date = db.Column(db.Date, default=func.current_date())
    note = db.Column(db.String(10000))
    intensity = db.Column(db.String(100))
    user_id = db.Column(db.String, db.ForeignKey('user.id'))
    routine_id = db.Column(db.Integer, db.ForeignKey('workout_routine.id'), nullable=True)
    routine = db.relationship('WorkoutRoutine', back_populates='workouts')

class WorkoutRoutine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    category = db.Column(db.String(100))
    note = db.Column(db.Text)
    steps = db.relationship('RoutineStep', backref='routine', cascade='all, delete-orphan')
    equipment = db.relationship('Equipment', backref='equipment', cascade='all, delete-orphan')
    workouts = db.relationship('Workout', back_populates='routine')
    user_id = db.Column(db.String, db.ForeignKey('user.id'))

class RoutineStep(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    routine_id = db.Column(db.Integer, db.ForeignKey('workout_routine.id'))
    exercise = db.Column(db.String(100))
    reps = db.Column(db.Integer)
    sets = db.Column(db.Integer)
    weight = db.Column(db.String(50))
    order = db.Column(db.Integer)

class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    equipment_id = db.Column(db.Integer, db.ForeignKey('workout_routine.id'))
    name = db.Column(db.String(100))

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)