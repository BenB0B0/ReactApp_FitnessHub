import { Routine } from '../types/routine';

const ROUTINE_BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/routines';

// Fetch all routines for a user
export const fetchRoutines = async (user_id: string): Promise<Routine[]> => {
    try {
        const response = await fetch(`${ROUTINE_BASE_URL}?userId=${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch routines: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Error fetching routines: ' + error);
    }
};

// Add a new routine
export const addRoutine = async (newRoutine: Routine): Promise<Routine> => {
    try {
        const response = await fetch(ROUTINE_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRoutine),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to add routine: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Error adding routine: ' + error);
    }
};

// Edit an existing routine
export const editRoutine = async (routine: Routine): Promise<Routine> => {
    try {
        const response = await fetch(`${ROUTINE_BASE_URL}/${routine.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routine),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to edit routine: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Error editing routine: ' + error);
    }
};

// Delete a routine
export const deleteRoutine = async (routineId: string): Promise<void> => {
    try {
        const response = await fetch(`${ROUTINE_BASE_URL}/${routineId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete routine: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Error deleting routine: ' + error);
    }
};