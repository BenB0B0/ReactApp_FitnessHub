const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/workouts';
const DELETE_URL = import.meta.env.VITE_BACKEND_URL + '/api/delete-workout';

// Fetch workouts
export const fetchWorkouts = async (user_id:string): Promise<any> => {
    try {
        const response = await fetch(BASE_URL+`?userId=${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch workouts: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Error fetching workouts: ' + error);
    }
};

// Add a workout
export const addWorkout = async (newWorkout: any): Promise<any> => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWorkout),
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to add workout: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Error adding workout: ' + error);
    }
};

// Delete a workout
export const deleteWorkout = async (workoutId: string): Promise<void> => {
    try {
        const response = await fetch(`${DELETE_URL}/${workoutId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete workout: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Error deleting workout: ' + error);
    }
};
