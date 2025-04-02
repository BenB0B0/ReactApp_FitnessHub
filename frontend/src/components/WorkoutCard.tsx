import { useState, useEffect } from "react";
import { Card, Button, ListGroup, Collapse } from "react-bootstrap";
import { Trash, Youtube, Calendar2Check, Clock, Signpost, Activity } from "react-bootstrap-icons";
import { Workout } from '../types/workout';
import { useWorkout } from "../context/WorkoutContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface WorkoutsCardProps {
  workout: Workout;
  expandAll: boolean;
  onEdit: () => void;
}

const WorkoutCard = ({ workout, expandAll, onEdit }: WorkoutsCardProps) => {
  // **** STATES ****
  const [open, setOpen] = useState(false);
  // **** CONTEXTS ****
  const { deleteWorkout, workoutOptions } = useWorkout();

  // **** HELPERS ****
  const normalizedWorkoutDate = (new Date(workout.date).toLocaleDateString('en-US', { timeZone: 'UTC' }));
  const normalizedToday = (new Date().toLocaleDateString('en-US', { timeZone: 'UTC' }))

  const findIconForWorkout = (workoutName: string) => {
    const workoutOption = workoutOptions.find(option => option.value === workoutName);
    return workoutOption ? workoutOption.icon : null;
  };

  const workoutIcon = findIconForWorkout(workout.name);

  // **** USE EFFECTS ****
  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  
  // **** RETURN LOGIC ****
  return (
    <Card className="mb-3" bg="light" text="dark" border={normalizedWorkoutDate > normalizedToday ? ("warning") : ("")}>

      <Card.Header
        className="bg-dark text-white"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Left side: workout icon and name */}
          <div className="d-flex align-items-center">
            {workoutIcon ? (
              <FontAwesomeIcon
                icon={workoutIcon}
                className="me-2 text-warning hover-scale"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              />
            ) : (
              <Activity className="me-2" />
            )}
            <span>{workout.name}</span>
          </div>
          {/* Right side: date */}
          <div className="d-flex align-items-center ms-auto small text-secondary">
            <span>{new Date(workout.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
          </div>
        </div>
      </Card.Header>

      <Collapse in={open}>
        <div>
          <Card.Body className="bg-secondary text-white p-2" >
            <ListGroup.Item>
              {/* Date with Icon and YouTube icon on the same row */}
              <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
              <Calendar2Check className="me-2" />
              <span>{new Date(workout.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
            </div>
                {/* YouTube Link aligned to the right */}
                {workout.url && (
                  <Card.Link href={workout.url} target="_blank" className="text-warning">
                    <Youtube
                      size={24}
                      style={{ cursor: 'pointer', transition: 'transform 0.2s ease, color 0.2s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </Card.Link>
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


            </ListGroup.Item>
          </Card.Body>

          {/* Delete Button */}
          <div className="d-flex justify-content-end p-2">
            <Button type="button" form="workoutForm" variant="outline-danger" 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this workout?")) {
                  deleteWorkout(workout.id);
                }
              }}>
              <Trash className="fs-6" />
            </Button>
          </div>
        </div>
      </Collapse>
    </Card>
  );
};

export default WorkoutCard;
