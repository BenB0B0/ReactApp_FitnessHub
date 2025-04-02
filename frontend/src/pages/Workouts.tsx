import { useState, useEffect } from "react";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutTable from "../components/WorkoutTable";
import WorkoutForm from "../components/WorkoutForm";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useWorkout } from "../context/WorkoutContext";
import { Workout } from '../types/workout';
import { ArrowsAngleExpand, ArrowsAngleContract } from "react-bootstrap-icons";

const ITEMS_PER_PAGE = import.meta.env.VITE_PAGINATION_MAX;

const Workouts = () => {
    // ***** STATES *****
    const [currentPage, setCurrentPage] = useState(1);
    const [expandAll, setExpandAll] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
    // ***** CONTEXTS *****
    const { workouts, getWorkouts, isTableView, setIsTableView, isFormVisible, setIsFormVisible } = useWorkout();
    
    // **** PAGINATION CONTROLS **** <-- COMPONETIZE THIS LATER
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentWorkouts = workouts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(workouts.length / ITEMS_PER_PAGE);
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    // **** USE EFFECT CALLS ****
    useEffect(() => {
        getWorkouts();
    }, []);

    // **** HANDLE CALLS ****
    const toggleForm = () => {
        setIsFormVisible((prev) => !prev);
    };

    const handleToggle = () => {
        setIsTableView((prevState: boolean) => !prevState);
    };

    // **** RETURN LOGIC ****
    return (
        <Container>
            <div className="mb-3 mt-3 d-flex align-items-center justify-content-between">
                <Button variant="warning" onClick={() => { toggleForm(); setSelectedWorkout(undefined); }} disabled={isFormVisible}>
                    Add Workout
                </Button>
                <div className="d-flex align-items-center ms-auto">
                    <Form>
                        <Form.Check
                            type="switch"
                            id="table-slider"
                            label={<span className="small ms-2 text-muted">Table View</span>}
                            checked={isTableView}
                            onChange={handleToggle}
                            className="d-flex align-items-center"
                        />
                    </Form>
                    {!isTableView && (
                        <>
                            <span className="m-2"> | </span>
                            <span className="d-flex align-items-center small">
                                {expandAll ?
                                    (<><ArrowsAngleContract title="Collapse All" className="m-2 hover-scale" onClick={() => setExpandAll(prev => !prev)} /> </>) :
                                    (<><ArrowsAngleExpand title="Expand All" className="m-2 hover-scale" onClick={() => setExpandAll(prev => !prev)} /> </>)
                                }
                            </span>
                        </>
                    )}
                </div>
            </div>

            {isFormVisible && <WorkoutForm initialFormData={selectedWorkout} />}


            {/* WORKOUT DATA SHOWN HERE */}
            {isTableView ? (
                <WorkoutTable onEdit={(workout_) => {
                    setSelectedWorkout(workout_);
                    setIsFormVisible(true);
                }} workouts={currentWorkouts} />
            ) : (
                <Row>
                    {currentWorkouts.map((workout_) => (
                        <Col key={workout_.id} sm={10} md={5} lg={3}>
                            <WorkoutCard workout={workout_} expandAll={expandAll}
                                onEdit={() => {
                                    setSelectedWorkout(workout_);
                                    setIsFormVisible(true);
                                }}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3 ">
                <Button onClick={goToPrevPage} disabled={currentPage === 1}>
                    Prev
                </Button>
                <span className="mx-3 mt-1">Page {currentPage} of {totalPages}</span>
                <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </div>

        </Container>
    );
};

export default Workouts;
