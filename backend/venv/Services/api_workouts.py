from flask import jsonify, request, Blueprint
import json
from Services.models import Workout
from datetime import datetime
from . import db

workouts_bp = Blueprint('workouts', __name__)

@workouts_bp.route('/api/delete-workout/<int:id>', methods=['DELETE'])
def delete_workout(id):
    print("ID Deleted: ",id)
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
    # Convert the date string to a datetime.date object (backend)
    try:
        workout_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Expected format: YYYY-MM-DD"}), 400

    new_workout = Workout(
                user_id=data['user_id'],
                name=data['name'],
                time_length=data['time_length'],
                distance=data['distance'],
                url=data['url'],
                date=workout_date,
                note=data['note'],
                intensity=data['intensity']
            )
    db.session.add(new_workout)
    db.session.commit()

    data['id'] = new_workout.id
    print("Workout Added: ", data)
    return jsonify(data), 201


@workouts_bp.route('/api/workouts/<int:workout_id>', methods=['PUT'])
def update_workout(workout_id):
    data = request.json

    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"error": "Workout not found"}), 404

    # Validate and update fields
    try:
        workout.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Expected format: YYYY-MM-DD"}), 400

    workout.name = data.get('name', workout.name)
    workout.time_length = data.get('time_length', workout.time_length)
    workout.distance = data.get('distance', workout.distance)
    workout.url = data.get('url', workout.url)
    workout.user_id = data.get('user_id', workout.user_id)
    workout.note = data.get('note', workout.note)
    workout.intensity = data.get('intensity', workout.intensity)

    db.session.commit()

    return jsonify(data), 201



@workouts_bp.route('/api/workouts', methods=['GET'])
def get_workouts():
    workouts = Workout.query.filter_by(user_id = request.args.get('userId'))

    # Convert the workouts to a list of dictionaries to send in the response
    workout_list = [
        {
            'id': workout.id,
            'name': workout.name,
            'time_length': workout.time_length,
            'distance': workout.distance,
            'url': workout.url,
            'date': workout.date,
            'note': workout.note,
            'intensity': workout.intensity
        } for workout in workouts
    ]
    return jsonify(workout_list)