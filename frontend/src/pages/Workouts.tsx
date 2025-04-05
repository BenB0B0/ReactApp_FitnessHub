import { useState, useEffect } from "react";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutTable from "../components/WorkoutTable";
import WorkoutForm from "../components/WorkoutForm";
import { Container, Row, Col, Button, Form, Pagination, Alert } from "react-bootstrap";
import { useWorkout } from "../context/WorkoutContext";
import { Workout } from '../types/workout';
import { ArrowsAngleExpand, ArrowsAngleContract } from "react-bootstrap-icons";
import SearchFilter from "../components/SearchFilter";

const ITEMS_PER_PAGE = import.meta.env.VITE_PAGINATION_MAX;

const Workouts = () => {
    // ***** STATES *****
    const [currentPage, setCurrentPage] = useState(1);
    const [expandAll, setExpandAll] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
    // ***** CONTEXTS *****
    const { getWorkouts, isTableView, setIsTableView, isFormVisible, setIsFormVisible, filteredWorkouts } = useWorkout();

    // **** PAGINATION CONTROLS **** <-- COMPONETIZE THIS LATER
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const totalPages = Math.ceil(filteredWorkouts.length / ITEMS_PER_PAGE);
    // FILTERED LIST
    const currentWorkouts = filteredWorkouts.slice(indexOfFirstItem, indexOfLastItem);
    // GROUP BY DATE
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureOrTodayWorkouts = currentWorkouts.filter(w => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate >= today;
    });

    const pastWorkouts = currentWorkouts.filter(w => {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate < today;
    });

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
        <>
            <Container>
                <div className="mb-3 mt-3 d-flex align-items-center justify-content-between">
                    <Button className="border border-dark" variant="warning" onClick={() => { toggleForm(); setSelectedWorkout(undefined); }} disabled={isFormVisible}>
                        Add Workout
                    </Button>
                    <SearchFilter />

                    <span className="text-muted small ms-2">({filteredWorkouts.length})</span>
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
                ) : (<>
                    <Row>
                        <Alert variant="success" dismissible transition>Upcoming Workouts</Alert>
                        {futureOrTodayWorkouts.map((workout_) => (
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
                    <Row>
                        <Alert variant="dark" dismissible transition>History</Alert>
                        {pastWorkouts.map((workout_) => (
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
                </>)}

                {/* Pagination Controls */}
                <div className="d-flex justify-content-center mt-3 mb-3">
                    <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} />

                        {/* Show surrounding page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>

            </Container>
        </>
    );
};

export default Workouts;
