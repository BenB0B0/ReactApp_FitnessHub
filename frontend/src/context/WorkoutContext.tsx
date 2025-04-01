import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Workout, WorkoutOption, workoutOptions } from "../types/workout";
import * as workoutService from "../services/workoutService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";


// Define the context type
interface WorkoutContextType {
    isTableView: boolean;
    setIsTableView: React.Dispatch<React.SetStateAction<boolean>>;
    workouts: Workout[];
    setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
    getWorkouts: () => Promise<void>;
    addWorkout: (newWorkout: Workout) => void;
    editWorkout: (newWorkout: Workout) => void;
    deleteWorkout: (workoutId: string) => void;
    workoutOptions: WorkoutOption[];
    isFormVisible: boolean;
    setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
    workoutsLoading: boolean;
    setWorkoutsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default undefined value
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Provider component
export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userId, isLoading } = useAuth(); // Get userId from AuthContext
    const storedTableView = localStorage.getItem('isTableView') === 'true';
    const [isTableView, setIsTableView] = useState<boolean>(storedTableView || false);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [workoutsLoading, setWorkoutsLoading] = useState<boolean>(true);
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const sortWorkoutsByDate = (workouts: Workout[]) => {
        return workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Fetch workouts from backend
    const getWorkouts = async () => {
        if (!userId) {
            console.error("User ID is not available.");
            return;
        }

        try {
            setWorkoutsLoading(true);
            const data = await workoutService.fetchWorkouts(userId); 
            setWorkouts(sortWorkoutsByDate(data));
            setWorkoutsLoading(false);
        } catch (error) {
            console.error(error);
            setWorkoutsLoading(false);
        }
    };

    // Add new workout
    const addWorkout = async (newWorkout: Workout) => {
        try {
            const addedWorkout = await workoutService.addWorkout(newWorkout); 

            setWorkouts((prevWorkouts) => {
                const updatedWorkouts = [addedWorkout, ...prevWorkouts]; 
                return sortWorkoutsByDate(updatedWorkouts); 
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Edit existing workout
    const editWorkout = async (newWorkout: Workout) => {
        try {
            const addedWorkout = await workoutService.editWorkout(newWorkout); 

            setWorkouts((prevWorkouts) => {
                const updatedWorkouts = prevWorkouts.map((w) =>
                  w.id === addedWorkout.id ? addedWorkout : w
                );
                return sortWorkoutsByDate(updatedWorkouts);
              });
        } catch (error) {
            console.error(error);
        }
    };

    // Delete workout
    const deleteWorkout = async (workoutId: string) => {
        try {
            await workoutService.deleteWorkout(workoutId); 
            setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== workoutId));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        localStorage.setItem('isTableView', JSON.stringify(isTableView));
    }, [isTableView]);

    // Fetch workouts when userId is available
    useEffect(() => {
        if (userId) {
            getWorkouts(); 
        }
    }, [userId]); // Dependency on userId

    return (
        <WorkoutContext.Provider value={{ 
            isTableView, 
            setIsTableView, 
            workouts, 
            setWorkouts, 
            getWorkouts, 
            addWorkout, 
            editWorkout,
            deleteWorkout, 
            workoutOptions,
            isFormVisible,
            setIsFormVisible,
            workoutsLoading,
            setWorkoutsLoading
        }}>
            {isLoading ? <LoadingSpinner /> : children} {/* Show loading state */}
        </WorkoutContext.Provider>
    );
};

// Custom hook to use the Workout context
export const useWorkout = (): WorkoutContextType => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error("useWorkout must be used within a WorkoutProvider");
    }
    return context;
};
