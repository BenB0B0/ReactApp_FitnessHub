import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Button, ListGroup, Collapse } from "react-bootstrap";
import { Trash, Youtube, Calendar2Check, Clock, Signpost, Activity, FileEarmarkRuled, Fire, CardChecklist } from "react-bootstrap-icons";
import { Workout } from '../types/workout';
import { useWorkout } from "../context/WorkoutContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isAfter, startOfToday } from 'date-fns';
import { useRoutine } from "../context/RoutineContext";
import IframeVideo from "./IframeVideo";


interface WorkoutsCardProps {
  workout: Workout;
  expandAll: boolean;
  onEdit: () => void;
}

const WorkoutCard = ({ workout, expandAll, onEdit }: WorkoutsCardProps) => {
  // **** STATES ****
  const [open, setOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  // **** CONTEXTS ****
  const { deleteWorkout, workoutOptions } = useWorkout();
  const { routines, setSearchTerm } = useRoutine();
  const navigate = useNavigate();


  // **** HELPERS ****  
  const findIconForWorkout = (workoutName: string) => {
    const workoutOption = workoutOptions.find(option => option.value === workoutName);
    return workoutOption ? workoutOption.icon : null;
  };

  const workoutIcon = findIconForWorkout(workout.name);

  const handleRoutineSelect = (routineId: string | number | undefined) => {
    if (!routineId) return;

    const routine = routines.find(r => r.id?.toString() === routineId.toString());
    if (!routine) return;

    setSearchTerm(routine.name);
    navigate('/routines');
  };

  // **** USE EFFECTS ****
  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  useEffect(() => {
    if (isAfter(workout.date, startOfToday())) {
      setOpen(prev => !prev);
    }
  }, []);


  // **** RETURN LOGIC ****
  return (
    <Card className="mb-3" bg="light" text="dark" border={isAfter(workout.date, startOfToday()) ? ("warning") : ("")}>

      <Card.Header
        className="bg-dark text-white p-2"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Left side: workout icon and name */}
          <div className="d-flex align-items-center">
            {workoutIcon ? (
              <Button
                type="button"
                className="me-2"
                variant="outline-warning"
                size="sm"
                title="Edit Workout"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}>
                <FontAwesomeIcon
                  icon={workoutIcon}
                  className="hover-scale"
                /></Button>
            ) : (
              <Activity className="me-2" />
            )}
            <span>{workout.name}</span>
          </div>
          {/* Right side: date */}
          <div className={`d-flex align-items-center ms-auto small ${isAfter(workout.date, startOfToday()) ? 'text-white' : 'text-secondary'}`}>
            <span>{new Date(workout.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
          </div>
        </div>
      </Card.Header>

      <Collapse in={open}>
        <div>
          <Card.Body className="bg-secondary text-white p-2 position-relative" >
            <ListGroup.Item>
              {/* Date with Icon and YouTube icon on the same row */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <Calendar2Check className="me-2" />
                  <span>{new Date(workout.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                </div>
                {/* YouTube Link aligned to the right */}
                {workout.url && (
                  <Button variant="link" className="text-warning p-0" onClick={() => setShowVideoModal(true) }>
                    <Youtube title="Open Video" className="hover-scale"/>
                  </Button>
                )}
              </div>

              {/* Distance with Icon */}
              {workout.distance != 0 ? (
                <div className="d-flex align-items-center mb-2">
                  <Signpost />
                  <span className="ms-2">{workout.distance} Miles</span>
                </div>) : ("")}

              {/* Time Length with Icon */}
              {workout.time_length != 0 ? (
                <div className="d-flex align-items-center mb-2">
                  <Clock />
                  <span className="ms-2">{workout.time_length} Minutes</span>
                </div>) : ("")}

              {/* Notes */}
              {workout.note && <div className="d-flex align-items-center">
                <small><FileEarmarkRuled /></small>
                <span className="ms-2"><small>{workout.note}</small></span>
              </div>}

              {/* Intensity */}
              {(workout.intensity === "Medium" || workout.intensity === "High") && (
                <div className="position-absolute bottom-0 end-0">
                  <small>
                    <Fire title={"Intensity: " + workout.intensity} className={workout.intensity === "High" ? "text-warning" : "text-white"} />
                  </small>
                </div>)}

            </ListGroup.Item>
          </Card.Body>

          <div className="d-flex justify-content-between align-items-center p-2">

            {/* Left: Routine Icon */}
            <div>
              {workout.routine_id && (
                <CardChecklist title="Routine Attached" className="ms-2 text-dark hover-scale" onClick={() => handleRoutineSelect(workout.routine_id || '')} />
              )}

            </div>

            {/* Right: Delete Button */}
            <Button
              type="button"
              form="workoutForm"
              variant="outline-danger"
              size="sm"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this workout?")) {
                  deleteWorkout(workout.id);
                }
              }}
            >
              <Trash className=" hover-scale" />
            </Button>

          </div>
        </div>
      </Collapse>
      <IframeVideo
        show={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        url={workout.url}
      />
    </Card>
  );
};

export default WorkoutCard;
