import { Table, Badge } from 'react-bootstrap';
import { CSVLink } from "react-csv";
import { Trash, Youtube, Signpost, Clock, Calendar2Check, FileEarmarkRuled, FiletypeCsv, Fire } from "react-bootstrap-icons";
import { Workout } from '../types/workout';
import { useWorkout } from "../context/WorkoutContext";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isAfter, startOfToday } from 'date-fns';

interface WorkoutsTableProps {
  workouts: Workout[];
  onEdit: (workout: Workout) => void;
}

const WorkoutTables = ({ workouts, onEdit }: WorkoutsTableProps) => {
  // **** CONTEXTS ****
  const { deleteWorkout, workoutOptions } = useWorkout();
  

  // **** HELPERS ****
  const findIconForWorkout = (workoutName: string) => {
    const workoutOption = workoutOptions.find(option => option.value === workoutName);
    return workoutOption ? workoutOption.icon : faQuestionCircle;
  };

  // **** CSV DOWNLOAD ****
  const headers = Object.keys(workouts[0] || {}).map((key) => ({
    label: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    key: key as keyof Workout
  }));

  // **** RETURN LOGIC ****
  return (
    <>
      <Table striped hover variant="dark" className="custom-bordered-table">
        <thead>
          <tr>
            <th className="bg-light text-dark">Workout Name</th>
            <th className="bg-light text-dark">Date <Calendar2Check /> </th>
            <th className="bg-light text-dark text-center">Distance (miles) <Signpost /></th>
            <th className="bg-light text-dark text-center">Time (minutes) <Clock /></th>
            <th></th>
            <th></th>
            <th className="text-center align-top p-0"><CSVLink
              headers={headers}
              data={workouts}
              filename="workouts.csv"
              className="text-success hover-scale d-inline-block"
            > <FiletypeCsv size={20} />
            </CSVLink></th>
          </tr>
        </thead>
        <tbody>

          {workouts.map((workout_) => (
            <tr key={workout_.id}>
              {/* Name with Video Icon Link */}
              <td className="hover-no-scale" onClick={(e) => {e.stopPropagation();onEdit(workout_);}}>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={findIconForWorkout(workout_.name)} className="me-2" /><span>{workout_.name}</span>
                  {isAfter(workout_.date, startOfToday()) &&
                    <Badge className='ms-2' pill bg="success" text="white"> Upcoming</Badge>
                  }
                  {workout_.note && <small><FileEarmarkRuled className='ms-2 text-warning'/></small>}
                  {workout_.intensity === "High" && (<small><Fire className="ms-2 text-warning" /></small>)}
                </div>
              </td>

              {/* Date with Icon */}
              <td>
                <div className="d-flex align-items-center">
                  <span>{new Date(workout_.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                </div>
              </td>

              {/* Distance with Icon */}
              <td className="text-center">
                {workout_.distance != 0 ? (<><span className="ms-2"> {workout_.distance} </span></>) : ("")}
              </td>

              {/* Time Length with Icon */}
              <td className="text-center">
                {workout_.time_length != 0 ? (<><span className="ms-2"> {workout_.time_length} </span></>) : ("")}
              </td>

              {/* Video URL */}
              <td className="text-center w-auto" style={{ width: 'auto', whiteSpace: 'nowrap', border: 'none' }}>
                {workout_.url && (
                  <Youtube href={workout_.url} target="_blank" size={24} className="text-warning hover-scale" />
                )}
              </td>

              {/* Delete */}
              <td className="text-center w-auto" style={{ width: 'auto', whiteSpace: 'nowrap', border: 'none'}}>
                <Trash
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this workout?")) {
                      deleteWorkout(workout_.id);
                    }
                  }}
                  className="fs-6 text-danger hover-scale" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default WorkoutTables;
