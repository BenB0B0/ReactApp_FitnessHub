import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";

// --------- DATABASE MODEL ---------
export interface Workout {
    user_id: string,
    name: string,
    time_length: number,
    distance: number,
    url: string,
    date: string,
    id: string,
    note: string,
    intensity: string,
    routine_id: string
}

// --------- WORKOUT OPTION TYPES ---------
export interface WorkoutOption {
    value: string;
    label: string;
    icon: IconDefinition;
    distance_req: boolean;
    url_req: boolean;
    cardio: boolean;
}

export const workoutOptions: WorkoutOption[] = [
    { value: "Run", label: "Run", icon: Icons.faPersonRunning, distance_req:true, url_req: false, cardio:true},
    { value: "Walk", label: "Walk", icon: Icons.faPersonWalking, distance_req:true, url_req: false, cardio:true },
    { value: "Upperbody Lift", label: "Upperbody Lift", icon: Icons.faDumbbell, distance_req:false, url_req: true, cardio:false },
    { value: "Lowerbody Lift", label: "Lowerbody Lift", icon: Icons.faDumbbell, distance_req:false, url_req: true, cardio:false },
    { value: "Fullbody Lift", label: "Fullbody Lift", icon: Icons.faDumbbell, distance_req:false, url_req: true, cardio:false },
    { value: "HIIT", label: "HIIT", icon: Icons.faFireAlt, distance_req:false, url_req: true, cardio:true },
    { value: "Basketball", label: "Basketball", icon: Icons.faBasketball, distance_req:false, url_req: false, cardio:true },
    { value: "Yoga", label: "Yoga", icon: Icons.faSpa, distance_req:false, url_req: true, cardio:true },
    { value: "Swim", label: "Swim", icon: Icons.faSwimmer, distance_req:true, url_req: false, cardio:true },
    { value: "Ski", label: "Ski", icon: Icons.faSkiing, distance_req:true, url_req: false, cardio:true },
    { value: "Hike", label: "Hike", icon: Icons.faHiking, distance_req:true, url_req: false, cardio:true },
    { value: "Bike", label: "Bike", icon: Icons.faBiking, distance_req:true, url_req: false, cardio:true },
    { value: "Pickle Ball", label: "Pickle Ball", icon: Icons.faTableTennisPaddleBall, distance_req:false, url_req: false, cardio:true },

    { value: "Rowing", label: "Rowing", icon: Icons.faWater, distance_req:true, url_req: false, cardio:true },
    { value: "Indoor Bike", label: "Indoor Bike", icon: Icons.faBicycle, distance_req:true, url_req: false, cardio:true },
    { value: "Stair Climb", label: "Stair Climb", icon: Icons.faStairs, distance_req:false, url_req: false, cardio:true },
    { value: "Core Workout", label: "Core Workout", icon: Icons.faUserNinja, distance_req:false, url_req: true, cardio:false },
    { value: "Dance", label: "Dance", icon: Icons.faMusic, distance_req:false, url_req: true, cardio:true },
    { value: "Tennis", label: "Tennis", icon: Icons.faTableTennis, distance_req:false, url_req: false, cardio:true },
    { value: "Soccer", label: "Soccer", icon: Icons.faSoccerBall, distance_req:false, url_req: false, cardio:true },
    { value: "Stretching", label: "Stretching", icon: Icons.faPersonArrowDownToLine, distance_req:false, url_req: false, cardio:false },
    { value: "CrossFit", label: "CrossFit", icon: Icons.faWeightHanging, distance_req:false, url_req: true, cardio:true },
    { value: "Climbing", label: "Climbing", icon: Icons.faMountain, distance_req:false, url_req: false, cardio:true },
].sort((a, b) => a.label.localeCompare(b.label));