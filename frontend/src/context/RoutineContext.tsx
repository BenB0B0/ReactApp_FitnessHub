import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Routine, CategoryOptions, category } from "../types/routine";
import * as routineService from "../services/routineService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAlert } from "../context/AlertContext";

// Routine Definition
interface RoutineContextType {
    routines: Routine[];
    setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
    getRoutines: () => Promise<void>;
    addRoutine: (newRoutine: Routine) => void;
    editRoutine: (newRoutine: Routine) => void;
    deleteRoutine: (routineId: string) => void;
    category: CategoryOptions[];
    routinesLoading: boolean;
    setRoutinesLoading: React.Dispatch<React.SetStateAction<boolean>>;
    filteredRoutines: Routine[];
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

// Create Context
const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

// Provider component
export const RoutineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     // **** CONTEXTS ****
     const { userId, isLoading } = useAuth(); 
     const { showAlert } = useAlert();
    // **** STATES ****
    const [routinesLoading, setRoutinesLoading] = useState<boolean>(true);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

     // HELPERS
     const filteredRoutines = routines.filter((w) =>
        `${w.name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    // Fetch routines
    const getRoutines = async () => {
        if (!userId) {
            console.error("User ID is not available.");
            return;
        }

        try {
            setRoutinesLoading(true);
            const data = await routineService.fetchRoutines(userId); 
            setRoutines(data);
            setRoutinesLoading(false);
        } catch (error) {
            console.error(error);
            setRoutinesLoading(false);
        }
    };

    // Add new routine
    const addRoutine = async (newRoutine: Routine) => {
        try {
            await routineService.addRoutine(newRoutine); 
            await getRoutines();
            showAlert("Routine Added!", "success");
        } catch (error) {
            console.error(error);
        }
    };

    // Edit existing routine
    const editRoutine = async (newRoutine: Routine) => {
        try {
            await routineService.editRoutine(newRoutine); 

            await getRoutines();

            showAlert("Routine Edited!", "info");

        } catch (error) {
            console.error(error);
        }
    };

    // Delete routine
    const deleteRoutine = async (routineId: string) => {
        try {
            await routineService.deleteRoutine(routineId); 
            await getRoutines();
            showAlert("Routine Deleted!", "danger");
            setSearchTerm('');
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch routines only when userId is available
    useEffect(() => {
        if (userId) {
            getRoutines(); 
        }
    }, [userId]); 

    return (
        <RoutineContext.Provider value={{ 
            routines, 
            setRoutines, 
            getRoutines, 
            addRoutine, 
            editRoutine,
            deleteRoutine,
            category,
            routinesLoading,
            setRoutinesLoading,
            filteredRoutines,
            searchTerm,
            setSearchTerm
        }}>
            {isLoading ? <LoadingSpinner /> : children} {/* Show loading state */}
        </RoutineContext.Provider>
    );
};

// Custom hook to use the Routine context
export const useRoutine = (): RoutineContextType => {
    const context = useContext(RoutineContext);
    if (!context) {
        throw new Error("useRoutine must be used within a RoutineProvider");
    }
    return context;
};
