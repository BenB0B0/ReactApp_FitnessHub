import { useState } from 'react';
import { Accordion, Alert, Table, Button, Badge } from "react-bootstrap";
import { Trash, Pencil } from "react-bootstrap-icons";
import { Routine } from '../types/routine';
import { useRoutine } from "../context/RoutineContext";
import RoutineForm from '../components/RoutineForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from '@fortawesome/free-solid-svg-icons';

interface RoutineListProps {
    routine: Routine;
    activeKey: string | null;
    onClick: () => void;
}

const RoutineList = ({ routine, activeKey, onClick }: RoutineListProps) => {
    const { deleteRoutine, category } = useRoutine();
    const [showForm, setShowForm] = useState(false);

    const findIconForWorkout = (categoryName: string) => {
        const categoryOption = category.find(option => option.value === categoryName);
        return categoryOption ? categoryOption.icon : null;
    };

    // **** RETURN LOGIC ****
    return (
        <Accordion activeKey={activeKey} alwaysOpen={false} className="shadow">
            {showForm && <RoutineForm onClose={() => setShowForm(false)} initialFormData={routine} />}
            <Accordion.Item eventKey={String(routine.id)}>
                <Accordion.Header
                    onClick={onClick}
                >
                    <FontAwesomeIcon
                        icon={findIconForWorkout(routine.category) || faBolt}
                        className="p-2"
                    />
                    {routine.name}
                    <Badge className="ms-2" bg="dark">{routine.category}</Badge>
                </Accordion.Header>
                <Accordion.Body>
                    <div>
                    <Button variant="outline-primary " className="mb-2 me-2"
                        onClick={() => setShowForm(true)}
                    ><Pencil className="fs-6" /></Button>
                    <Button variant="outline-danger" className="mb-2"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this routine?")) {
                                deleteRoutine(String(routine.id));
                            }
                        }}
                    ><Trash className="fs-6" /></Button>
                    </div>
                    {routine.note && <Alert variant="warning" dismissible> {routine.note} </Alert>}

                    {routine.equipment && routine.equipment.map((eq) => (
                        <Badge pill className="mb-2 me-2">{eq.name}</Badge>
                    ))}

                    <Table striped hover variant="light" bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Exercise</th>
                                <th>Reps</th>
                                <th>Sets</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        {routine.steps && routine.steps.map((step) => (
                            <tbody key={step.id}>
                                <tr>
                                    <td>{step.order}</td>
                                    <td>{step.exercise}</td>
                                    <td>{step.reps}</td>
                                    <td>{step.sets}</td>
                                    <td>{step.weight}</td>
                                </tr>
                            </tbody>))}
                    </Table>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default RoutineList;
