import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";

// --------- DATABASE MODEL ---------
export interface Routine {
    id?: string,
    name: string,
    note?: string,
    category: string,
    steps: RoutineStep[],
    equipment: Equipment[],
    user_id: string,
}

export interface RoutineStep {
    id?: string,
    routine_id?: string,
    exercise: string,
    reps: number,
    sets: number,
    weight: string,
    order: number
}

export interface Equipment {
    id?: string,
    equipment_id?: string,
    name: string
}

// --------- CATEGORY OPTION TYPES ---------
export interface CategoryOptions {
    value: string;
    label: string;
    icon: IconDefinition;
}

export const category: CategoryOptions[] = [
    { value: "Cardio", label: "Cardio", icon: Icons.faPersonRunning },
    { value: "Strength", label: "Strength", icon: Icons.faDumbbell },
    { value: "Mix", label: "Mix", icon: Icons.faFireAlt },
].sort((a, b) => a.label.localeCompare(b.label));