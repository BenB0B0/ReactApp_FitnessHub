// --------- DATABASE MODEL ---------
export interface Routine {
    id?: string,
    name: string,
    note?: string,
    steps: RoutineStep[],
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