import React, { useState } from 'react';
import { Workout } from '../types/workout';
import { Modal, Button, Form } from 'react-bootstrap';
import { useWorkout } from "../context/WorkoutContext";
import { useAuth } from "../context/AuthContext";

interface WorkoutFormProps {
    setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkoutsForm = ({ setIsFormVisible }: WorkoutFormProps) => {
    const { userId } = useAuth();
    const { addWorkout, workoutOptions } = useWorkout();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        length: 0,
        url: '',
        is_miles: false,
        date: ''
    });

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
            length: formData.length,
            url: formData.url,
            is_miles: formData.is_miles,
            date: formData.date,
            id: ''
        };

        addWorkout(newWorkout);
        handleCloseModal();
        setLoading(false);
    };

    return (
        <Modal show={true}>
            <Modal.Header className="bg-warning text-black">
                <Modal.Title>Add New Workout</Modal.Title>
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
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label><small className="form-text text-muted">Length</small></Form.Label>
                        <Form.Control name="length" type="number" value={formData.length} onChange={handleChange} required />
                    </Form.Group>
                    <div className="mb-3">
                        <Form.Check label={<small className="form-text text-muted">Miles</small>} id="miles" name="is_miles" type="radio" value="true" checked={formData.is_miles === true} onChange={() => setFormData({ ...formData, is_miles: true })} />
                        <Form.Check label={<small className="form-text text-muted">Minutes</small>} id="minutes" name="is_miles" type="radio" value="false" checked={formData.is_miles === false} onChange={() => setFormData({ ...formData, is_miles: false })} />
                    </div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label><small className="form-text text-muted">Video URL</small></Form.Label>
                        <Form.Control name="url" type="url" value={formData.url} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label><small className="form-text text-muted">Date</small></Form.Label>
                        <Form.Control name="date" type="date" 
                        value={formData.date}
                        onChange={handleChange} required />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="workoutForm"
                    variant="primary"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>


    );
};

export default WorkoutsForm;
