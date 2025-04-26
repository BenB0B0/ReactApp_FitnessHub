import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Routine, RoutineStep, Equipment } from '../types/routine';
import { useRoutine } from '../context/RoutineContext';
import { useAuth } from '../context/AuthContext';
import { faListCheck, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EquipmentInput from '../components/EquipmentInput';

type RoutineFormProps = {
    initialFormData?: Routine;
    onClose: () => void;
};

const defaultStep: RoutineStep = {
    exercise: '',
    reps: 0,
    sets: 0,
    weight: '',
    order: 1
};

const defaultEq: Equipment = {
    name: ''
};

const RoutineForm: React.FC<RoutineFormProps> = ({ initialFormData, onClose }) => {
    const { userId } = useAuth();
    const { addRoutine, editRoutine, category } = useRoutine();
    const [equipment, setEquipment] = useState<string[]>([]);


    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Routine>({
        id: '',
        name: '',
        note: '',
        category: '',
        user_id: userId ?? '',
        steps: [{ ...defaultStep }],
        equipment: [{ ...defaultEq }]
    });

    useEffect(() => {
        if (initialFormData) {
            setEditing(true);
            setFormData(initialFormData);
            setEquipment(initialFormData.equipment.map(eq => eq.name));
        }
    }, [initialFormData]);

    const handleStepKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            addStep();       
        }
    };

    const handleStepChange = (index: number, field: keyof RoutineStep, value: any) => {
        const updatedSteps = [...formData.steps];
        updatedSteps[index] = {
            ...updatedSteps[index],
            [field]: field === 'reps' || field === 'sets' || field === 'order' ? parseInt(value) : value
        };
        setFormData({ ...formData, steps: updatedSteps });
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [
                ...prev.steps,
                { ...defaultStep, order: prev.steps.length + 1 }
            ]
        }));
    };

    const removeStep = (index: number) => {
        const updated = formData.steps
            .filter((_, i) => i !== index)
            .map((step, idx) => ({ ...step, order: idx + 1 }));
        setFormData({ ...formData, steps: updated });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!userId) return;

        const payload: Routine = {
            ...formData,
            equipment: equipment.map(e => ({ name: e })),
            user_id: userId
        };

        if (editing) {
            await editRoutine(payload);
        } else {
            await addRoutine(payload);
        }

        setLoading(false);
        onClose();
    };

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header className="bg-info text-white">
                <Modal.Title>
                    <FontAwesomeIcon icon={editing ? faPencil : faListCheck} className="me-2" />
                    {editing ? 'Edit Routine' : 'Add New Routine'}
                </Modal.Title>
            </Modal.Header>

            <Form id="routineForm" onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Routine Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select a category</option>
                            {category.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <EquipmentInput equipment={equipment} setEquipment={setEquipment} />
                    
                    <h3>Steps</h3>
                    {formData.steps.map((step, index) => (
                        <Row key={index} className="mb-3 align-items-end">
                            <Col md={3}>
                                <Form.Label>Exercise #{step.order}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={step.exercise}
                                    onChange={(e) => handleStepChange(index, 'exercise', e.target.value)}
                                    onKeyDown={handleStepKeyDown}
                                    required
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label>Reps</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={step.reps}
                                    onChange={(e) => handleStepChange(index, 'reps', e.target.value)}
                                    onKeyDown={handleStepKeyDown}
                                    required
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label>Sets</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={step.sets}
                                    onChange={(e) => handleStepChange(index, 'sets', e.target.value)}
                                    onKeyDown={handleStepKeyDown}
                                    required
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Weight</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={step.weight}
                                    onChange={(e) => handleStepChange(index, 'weight', e.target.value)}
                                    onKeyDown={handleStepKeyDown}
                                />
                            </Col>
                            <Col md={2}>
                                <Button variant="outline-danger" onClick={() => removeStep(index)} disabled={formData.steps.length === 1}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                    ))}

                    <Button variant="outline-primary" onClick={addStep}>
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        Add Step
                    </Button>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" type="submit" form="routineForm" disabled={loading}>
                        {editing ? (loading ? 'Updating...' : 'Update Routine') : (loading ? 'Submitting...' : 'Create Routine')}
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default RoutineForm;
