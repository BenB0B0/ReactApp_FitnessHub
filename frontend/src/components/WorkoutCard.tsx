import { Card, Button, ListGroup } from "react-bootstrap";
import { Trash, Youtube, Calendar2Check, Clock, Signpost, Activity } from "react-bootstrap-icons";
import { Workout } from '../types/workout';
import { useWorkout } from "../context/WorkoutContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 

interface WorkoutsCardProps {
  workout: Workout;
}

const WorkoutCard = ({ workout }: WorkoutsCardProps) => {
  const { deleteWorkout, workoutOptions  } = useWorkout();

  const findIconForWorkout = (workoutName: string) => {
    const workoutOption = workoutOptions.find(option => option.value === workoutName);
    return workoutOption ? workoutOption.icon : null;
  };

  const workoutIcon = findIconForWorkout(workout.name);

  return (
    <Card className="mb-3" bg="light" text="dark">

    <Card.Header className="bg-dark text-white">
      {/* Header Workout Name with Icon */}
      <div className="d-flex align-items-center">
        {/* Display the correct icon if found, else fallback to Activity icon */}
        {workoutIcon ? (
          <FontAwesomeIcon icon={workoutIcon} className="me-2" />
        ) : (
          <Activity className="me-2" />
        )}
        <span>{workout.name}</span>
      </div>
    </Card.Header>

      <Card.Body className="bg-secondary text-white">
        <ListGroup.Item>
          {/* Date with Icon and YouTube icon on the same row */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <Calendar2Check className="me-2" />
              <span>{new Date(workout.date).toLocaleDateString('en-US')}</span>
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

          {/* Length with Icon */}
          <div className="d-flex align-items-center mb-2">
            {workout.is_miles ? <Signpost /> : <Clock />}
            <span className="ms-2">{workout.length} {workout.is_miles ? 'Miles' : 'Minutes'}</span>
          </div>


        </ListGroup.Item>
      </Card.Body>

      {/* Delete Button */}
      <div className="d-flex justify-content-end p-2">
        <Button type="button" form="workoutForm" variant="outline-danger" onClick={() => deleteWorkout(workout.id)}>
          <Trash className="fs-6" />
        </Button>
      </div>
    </Card>
  );
};

export default WorkoutCard;
