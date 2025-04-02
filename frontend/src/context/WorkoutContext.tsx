import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Workout, WorkoutOption, workoutOptions } from "../types/workout";
import * as workoutService from "../services/workoutService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAlert } from "../context/AlertContext";

// Workout Definition
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
    filteredWorkouts: Workout[];
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

// Create Context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Provider component
export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     // **** CONTEXTS ****
     const { userId, isLoading } = useAuth(); 
     const storedTableView = localStorage.getItem('isTableView') === 'true';
     const { showAlert } = useAlert();
    // **** STATES ****
    const [isTableView, setIsTableView] = useState<boolean>(storedTableView || false);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [workoutsLoading, setWorkoutsLoading] = useState<boolean>(true);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
   

    // HELPERS
    const filteredWorkouts = workouts.filter((w) =>
        `${w.name} ${w.date} ${w.distance} ${w.time_length}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    const sortWorkoutsByDate = (workouts: Workout[]) => {
        return workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Fetch workouts
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

            showAlert("Workout Added!", "success");
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

            showAlert("Workout Edited!", "info");

        } catch (error) {
            console.error(error);
        }
    };

    // Delete workout
    const deleteWorkout = async (workoutId: string) => {
        try {
            await workoutService.deleteWorkout(workoutId); 
            setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== workoutId));
            showAlert("Workout Deleted!", "danger");
        } catch (error) {
            console.error(error);
        }
    };

    // Store Table vs Card view in storage
    useEffect(() => {
        localStorage.setItem('isTableView', JSON.stringify(isTableView));
    }, [isTableView]);

    // Fetch workouts only when userId is available
    useEffect(() => {
        if (userId) {
            getWorkouts(); 
        }
    }, [userId]); 

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
            setWorkoutsLoading,
            filteredWorkouts,
            searchTerm,
            setSearchTerm
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
