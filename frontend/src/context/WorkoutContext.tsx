import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Workout } from "../types/workout";
import * as workoutService from "../services/workoutService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faPersonRunning, faDumbbell, faBolt , faBasketball, faSpa } from "@fortawesome/free-solid-svg-icons";


interface WorkoutOption {
    value: string;
    label: string;
    icon: IconDefinition;
}

// Define the context type
interface WorkoutContextType {
    isTableView: boolean;
    setIsTableView: React.Dispatch<React.SetStateAction<boolean>>;
    workouts: Workout[];
    setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
    getWorkouts: () => Promise<void>;
    addWorkout: (newWorkout: Workout) => void;
    deleteWorkout: (workoutId: string) => void;
    workoutOptions: WorkoutOption[];
}

// Create the context with a default undefined value
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Provider component
export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userId, isLoading } = useAuth(); // Get userId from AuthContext
    const storedTableView = localStorage.getItem('isTableView') === 'true';
    const [isTableView, setIsTableView] = useState<boolean>(storedTableView || false);
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
            const data = await workoutService.fetchWorkouts(userId); 
            setWorkouts(sortWorkoutsByDate(data));
        } catch (error) {
            console.error(error);
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

    // Delete workout
    const deleteWorkout = async (workoutId: string) => {
        try {
            await workoutService.deleteWorkout(workoutId); 
            setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== workoutId));
        } catch (error) {
            console.error(error);
        }
    };

    // Workout Types
    const workoutOptions: WorkoutOption[] = [
        { value: "Run", label: "Run", icon: faPersonRunning },
        { value: "Upperbody Lift", label: "Upperbody Lift", icon: faDumbbell },
        { value: "Lowerbody Lift", label: "Lowerbody Lift", icon: faDumbbell },
        { value: "Fullbody Lift", label: "Fullbody Lift", icon: faDumbbell },
        { value: "HIIT", label: "HIIT", icon: faBolt },
        { value: "Basketball", label: "Basketball", icon: faBasketball },
        { value: "Yoga", label: "Yoga", icon: faSpa },
    ];

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
        <WorkoutContext.Provider value={{ isTableView, setIsTableView, workouts, setWorkouts, getWorkouts, addWorkout, deleteWorkout, workoutOptions }}>
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
