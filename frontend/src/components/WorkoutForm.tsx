import React, { useState, useEffect } from 'react';
import { Workout } from '../types/workout';
import { Modal, Button, Form } from 'react-bootstrap';
import { useWorkout } from "../context/WorkoutContext";
import { useAuth } from "../context/AuthContext";
import { PinMap, Stopwatch, Youtube, Calendar } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";


type WorkoutsFormProps = {
    initialFormData?: Workout; 
};

const WorkoutsForm: React.FC<WorkoutsFormProps> = ({ initialFormData }) => {
    const { userId } = useAuth();
    const { addWorkout, editWorkout, workoutOptions, setIsFormVisible } = useWorkout();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        time_length: 0,
        distance: 0,
        url: '',
        date: new Date().toISOString().split('T')[0],
        id: ''
    });

    useEffect(() => {
        if (initialFormData) {
            setEditing(true);
            setFormData({
                user_id: initialFormData.user_id ?? '',
                name: initialFormData.name ?? '',
                time_length: initialFormData.time_length ?? 0,
                distance: initialFormData.distance ?? 0,
                url: initialFormData.url ?? '',
                date: initialFormData.date ? new Date(initialFormData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                id: initialFormData.id ?? ''
            });
        }
      }, [initialFormData]);

    const findIconForWorkout = (workoutName: string) => {
        const workoutOption = workoutOptions.find(option => option.value === workoutName);
        return workoutOption ? workoutOption.icon : null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCloseModal = () => {
        setIsFormVisible(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (userId === null) {
            console.error("User ID is not available.");
            return;
        }

        const newWorkout: Workout = {
            user_id: userId,
            name: formData.name,
            time_length: formData.time_length,
            distance: formData.distance,
            url: formData.url,
            date: formData.date,
            id: formData.id
        };

        if (editing) {
            editWorkout(newWorkout);
        } else {
            addWorkout(newWorkout);
        }
        
        handleCloseModal();
        setLoading(false);
    };

    return (
        <Modal show={true}>
            <Modal.Header className="bg-warning text-black d-flex justify-content-between align-items-center">
                <Modal.Title>{editing ? "Edit Workout" : "Add New Workout"}</Modal.Title>
                <FontAwesomeIcon
                    icon={findIconForWorkout(formData.name) || faPencil}
                    className="p-2"
                />
            </Modal.Header>
            <Modal.Body>
                <Form id="workoutForm" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1">
                        <Form.Label>Workout Name</Form.Label>
                        <Form.Select name="name" value={formData.name} onChange={handleChange} required>
                            <option value="">Select a workout</option>
                            {workoutOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {formData.name && <>
                        {workoutOptions.find(option => option.value === formData.name)?.distance_req &&
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <PinMap className="me-2" />
                                <Form.Label><small className="form-text text-muted">Distance (miles)</small></Form.Label>
                                <Form.Control name="distance" type="number" value={formData.distance} onChange={handleChange} />
                            </Form.Group>
                        }
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Stopwatch className="me-2" />
                            <Form.Label><small className="form-text text-muted">Activity Length (minutes)</small></Form.Label>
                            <Form.Control name="time_length" type="number" value={formData.time_length} onChange={handleChange} />
                        </Form.Group>
                        {workoutOptions.find(option => option.value === formData.name)?.url_req &&
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Youtube className="me-2" />
                                <Form.Label><small className="form-text text-muted">Video URL</small></Form.Label>
                                <Form.Control name="url" type="url" value={formData.url} onChange={handleChange} />
                            </Form.Group>
                        }
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Calendar className="me-2" />
                            <Form.Label><small className="form-text text-muted">Date</small></Form.Label>
                            <Form.Control name="date" type="date"
                                value={formData.date}
                                onChange={handleChange} required />
                        </Form.Group>
                    </>}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="workoutForm"
                    variant="primary"
                    disabled={loading}
                >
                    {editing ? (
                        <>{loading ? 'Updating...' : 'Update'}</>
                    ) : (
                        <>{loading ? 'Submitting...' : 'Submit'}</>
                    )}
                    
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>


    );
};

export default WorkoutsForm;
