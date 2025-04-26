from flask import jsonify, request, Blueprint
from Services.models import Workout, WorkoutRoutine, RoutineStep, Equipment
from datetime import datetime
from . import db

workouts_bp = Blueprint('workouts', __name__)

# ---------------------------------- DELETE WORKOUT ------------------------------------#
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

# ---------------------------------- CREATE WORKOUT ------------------------------------#
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
                intensity=data['intensity'],
                routine_id=data.get('routine_id')
            )
    db.session.add(new_workout)
    db.session.commit()

    data['id'] = new_workout.id
    print("Workout Added: ", data)
    return jsonify(data), 201

# ---------------------------------- UPDATE WORKOUT ------------------------------------#
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
    workout.routine_id = data.get('routine_id', workout.routine_id)

    db.session.commit()

    return jsonify(data), 201


# ---------------------------------- GET WORKOUTS ------------------------------------#
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
            'date': workout.date.isoformat() if workout.date else None,  
            'note': workout.note,
            'intensity': workout.intensity,
            'routine_id': workout.routine_id,  
            'routine': {
                'id': workout.routine.id,
                'name': workout.routine.name,
                'category': workout.routine.category
            } if workout.routine else None
        } for workout in workouts
    ]

    return jsonify(workout_list)


# ---------------------------------- GET ROUTINES ------------------------------------#
@workouts_bp.route('/api/routines', methods=['GET'])
def get_routines():
    user_id = request.args.get('userId')
    routines = WorkoutRoutine.query.filter_by(user_id=user_id).all()

    routines_data = []
    for routine in routines:
        routine_data = {
            'id': routine.id,
            'name': routine.name,
            'note': routine.note,
            'category': routine.category,
            'equipment': [
                {
                    'name': equipment.name
                } for equipment in routine.equipment
            ],
            'steps': [
                {
                    'id': step.id,
                    'exercise': step.exercise,
                    'reps': step.reps,
                    'sets': step.sets,
                    'weight': step.weight,
                    'order': step.order
                } for step in sorted(routine.steps, key=lambda s: s.order)
            ]
        }
        routines_data.append(routine_data)

    return jsonify(routines_data)

# ---------------------------------- CREATE ROUTINES ------------------------------------#
@workouts_bp.route('/api/routines', methods=['POST'])
def create_routine():
    data = request.json
    routine = WorkoutRoutine(
        name=data.get('name'),
        note=data.get('note'),
        category=data.get('category'),
        user_id=data.get('user_id')
    )

    for eq_data in data.get('equipment', []):
        eq = Equipment(
            name=eq_data['name']
        )
        routine.equipment.append(eq)

    for step_data in data.get('steps', []):
        step = RoutineStep(
            exercise=step_data['exercise'],
            reps=step_data['reps'],
            sets=step_data['sets'],
            weight=step_data['weight'],
            order=step_data['order']
        )
        routine.steps.append(step)

    db.session.add(routine)
    db.session.commit()

    return jsonify(data), 201


# ---------------------------------- UPDATE ROUTINES ------------------------------------#
@workouts_bp.route('/api/routines/<int:routine_id>', methods=['PUT'])
def update_routine(routine_id):
    data = request.json
    routine = WorkoutRoutine.query.get_or_404(routine_id)

    routine.name = data.get('name', routine.name)
    routine.note = data.get('note', routine.note)
    routine.category = data.get('category', routine.category)

     # Clear old equipment
    Equipment.query.filter_by(equipment_id=routine.id).delete()

    # Add updated equipment
    for eq_data in data.get('equipment', []):
        eq = Equipment(
            equipment_id=routine.id,
            name=eq_data['name']
        )
        db.session.add(eq)

    # Clear old steps
    RoutineStep.query.filter_by(routine_id=routine.id).delete()

    # Add updated steps
    for step_data in data.get('steps', []):
        step = RoutineStep(
            routine_id=routine.id,
            exercise=step_data['exercise'],
            reps=step_data['reps'],
            sets=step_data['sets'],
            weight=step_data['weight'],
            order=step_data['order']
        )
        db.session.add(step)

    db.session.commit()
    return jsonify(data)


# ---------------------------------- DELETE ROUTINES ------------------------------------#
@workouts_bp.route('/api/routines/<int:routine_id>', methods=['DELETE'])
def delete_routine(routine_id):
    routine = WorkoutRoutine.query.get_or_404(routine_id)
    db.session.delete(routine)
    db.session.commit()
    return jsonify({'message': 'Routine deleted'})