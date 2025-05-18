import { useState, useEffect, useRef } from 'react';
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
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                const lock = await (navigator as any).wakeLock.request('screen');
                setWakeLock(lock);

                lock.addEventListener('release', () => {
                    console.log('Wake Lock was released');
                });

            } catch (err) {
                console.error(`Wake Lock error`);
            }
        };

        if (isFullscreen) {
            requestWakeLock();
        } else {
            wakeLock?.release().then(() => setWakeLock(null));
        }

        return () => {
            wakeLock?.release().then(() => setWakeLock(null));
        };
    }, [isFullscreen]);

    const toggleFullscreen = () => {
        const el = fullscreenRef.current;

        if (!el) return;

        if (!document.fullscreenElement) {
            setIsFullscreen(true);
            el.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            setIsFullscreen(false);
            document.exitFullscreen().catch((err) => {
                console.error(`Error attempting to exit fullscreen: ${err.message}`);
            });
        }
    };

    document.addEventListener("fullscreenchange", () => {
        setIsFullscreen(!!document.fullscreenElement);
    });

    const findIconForWorkout = (categoryName: string) => {
        const categoryOption = category.find(option => option.value === categoryName);
        return categoryOption ? categoryOption.icon : null;
    };

    // **** RETURN LOGIC ****
    return (
        <Accordion activeKey={activeKey} alwaysOpen={false} className="shadow" >
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
                    <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                        <div className="mb-2">
                            <Button variant="outline-primary" className="me-2" onClick={() => setShowForm(true)}>
                                <Pencil className="fs-6" />
                            </Button>
                            <Button variant="outline-danger" onClick={() => {
                                if (window.confirm("Are you sure you want to delete this routine?")) {
                                    deleteRoutine(String(routine.id));
                                }
                            }}>
                                <Trash className="fs-6" />
                            </Button>
                        </div>
                        <div className="mb-2 ms-auto">
                            <Button
                                variant={isFullscreen ? "secondary" : "outline-secondary"}
                                onClick={toggleFullscreen}
                            >
                                Full Screen
                            </Button>
                        </div>
                    </div>
                    {routine.note && <Alert variant="warning" dismissible> {routine.note} </Alert>}

                    {routine.equipment && routine.equipment.map((eq) => (
                        <Badge key={eq.name} pill className="mb-2 me-2">{eq.name}</Badge>
                    ))}

                    <div ref={fullscreenRef} className={`shadow ${isFullscreen ? "fullscreen-accordion" : ""}`}>
                        <Table striped hover variant="light" bordered >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Exercise</th>
                                    <th>Reps</th>
                                    <th>Sets</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            
                                <tbody >
                                {routine.steps && routine.steps.map((step) => (
                                    <tr key={step.id}>
                                        <td>{step.order}</td>
                                        <td>{step.exercise}</td>
                                        <td>{step.reps}</td>
                                        <td>{step.sets}</td>
                                        <td>{step.weight}</td>
                                    </tr>))}
                                    </tbody>
                        </Table></div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default RoutineList;
