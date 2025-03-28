from flask import jsonify, request, Blueprint
import json
from Services.models import Workout
from datetime import datetime
from . import db

workouts_bp = Blueprint('workouts', __name__)

@workouts_bp.route('/api/delete-workout/<int:id>', methods=['DELETE'])
def delete_workout(id):
    workout = Workout.query.get(id)
    if workout:
        db.session.delete(workout) 
        db.session.commit()  
        return jsonify({'message': 'Workout deleted successfully!'}), 200
    else:
        return jsonify({'message': 'Workout not found!'}), 404


@workouts_bp.route('/api/workouts', methods=['POST'])
def create_workout():
    data = request.json  
    print(data)
    # Convert the date string to a datetime.date object (backend)
    try:
        workout_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Expected format: YYYY-MM-DD"}), 400

    new_workout = Workout(
                user_id=data['user_id'],
                name=data['name'],
                length=data['length'],
                url=data['url'],
                is_miles=data['is_miles'],
                date=workout_date
            )
    
    db.session.add(new_workout)
    db.session.commit()
    return jsonify(data), 201


@workouts_bp.route('/api/workouts', methods=['GET'])
def get_workouts():
   
    workouts = Workout.query.filter_by(user_id= request.args.get('userId'))

    # Convert the workouts to a list of dictionaries to send in the response
    workout_list = [
        {
            'id': workout.id,
            'name': workout.name,
            'length': workout.length,
            'is_miles': workout.is_miles,
            'url': workout.url,
            'date': workout.date
        } for workout in workouts
    ]
    return jsonify(workout_list)