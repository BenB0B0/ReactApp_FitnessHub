import { Accordion, Alert, Table } from "react-bootstrap";
import { Routine } from '../types/routine';

interface RoutineListProps {
    routine: Routine;
    activeKey: string | null;
    setActiveKey: (key: string) => void;
}

const RoutineList = ({ routine, activeKey, setActiveKey }: RoutineListProps) => {
    // **** RETURN LOGIC ****
    return (
        <Accordion activeKey={activeKey} alwaysOpen={false}>
            <Accordion.Item eventKey={String(routine.id)}>
                <Accordion.Header
                    onClick={() => setActiveKey(String(routine.id))}
                >{routine.name}</Accordion.Header>
                <Accordion.Body>
                    {routine.note && <Alert variant="warning" dismissible> {routine.note} </Alert>}
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
