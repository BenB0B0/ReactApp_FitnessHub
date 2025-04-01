import { Table } from 'react-bootstrap';
import { Trash, Youtube, Signpost, Clock, Calendar2Check } from "react-bootstrap-icons";
import { Workout } from '../types/workout';
import { useWorkout } from "../context/WorkoutContext";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 

interface WorkoutsTableProps {
  workouts: Workout[];
}

const WorkoutTables = ({ workouts }: WorkoutsTableProps) => {
  const { deleteWorkout, workoutOptions } = useWorkout();

  const findIconForWorkout = (workoutName: string) => {
    const workoutOption = workoutOptions.find(option => option.value === workoutName);
    return workoutOption ? workoutOption.icon : faQuestionCircle;
  };

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Workout Name</th>
          <th>Date <Calendar2Check /> </th>
          <th>Distance (miles) <Signpost /></th>
          <th>Time (minutes) <Clock /></th>
          <th className='w-auto' style={{ width: 'auto', whiteSpace: 'nowrap' }}></th>
          <th className='w-auto' style={{ width: 'auto', whiteSpace: 'nowrap' }}></th>
        </tr>
      </thead>
      <tbody>

        {workouts.map((workout_) => (
          <tr key={workout_.id}>
             {/* Name with Video Icon Link */}
            <td> 
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={findIconForWorkout(workout_.name)} className="me-2" /><span>{workout_.name}</span>
              </div>
            </td>

            {/* Date with Icon */}
            <td>
              <div className="d-flex align-items-center">
                <span>{new Date(workout_.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
              </div>
            </td>

             {/* Distance with Icon */}
            <td> <div className="d-flex align-items-center">
              {workout_.distance != 0 ? (<><span className="ms-2"> {workout_.distance} </span></>):("")} 
            </div> </td>

            {/* Time Length with Icon */}
            <td> <div className="d-flex align-items-center"> 
              {workout_.time_length != 0 ? (<><span className="ms-2"> {workout_.time_length} </span></>):("")} 
            </div> </td>

             {/* Video URL */}
            <td className="text-center w-auto" style={{ width: 'auto', whiteSpace: 'nowrap' }}> 
            {workout_.url && (
                <Youtube href={workout_.url} target="_blank" size={24}  className="text-warning"
                  style={{ cursor: 'pointer', transition: 'transform 0.2s ease, color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}/>
              )}
            </td>

             {/* Delete */}
            <td className="text-center w-auto" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
              <Trash
                onClick={() => deleteWorkout(workout_.id)}
                className="fs-6 text-danger"
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease, color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} />
            </td>
          </tr>
        ))}

      </tbody>
    </Table>
  );
};

export default WorkoutTables;
