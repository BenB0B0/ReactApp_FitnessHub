import { useState, useEffect } from "react";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutTable from "../components/WorkoutTable";
import WorkoutForm from "../components/WorkoutForm";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useWorkout } from "../context/WorkoutContext";

const ITEMS_PER_PAGE = 16;

const Workouts = () => {
    // **** STATE CALLS ****
    const { workouts, getWorkouts, isTableView, setIsTableView, isFormVisible, setIsFormVisible } = useWorkout();
    const [currentPage, setCurrentPage] = useState(1);

    // **** PAGINATION CONTROLS **** <-- COMPONETIZE THIS LATER
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentWorkouts = workouts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(workouts.length / ITEMS_PER_PAGE);
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    // **** EFFECT CALLS ****
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

    // **** RETURN ****
    return (
        <Container>
            <div className="mb-3 mt-3 d-flex align-items-center justify-content-between">
                <Button variant="warning" onClick={toggleForm} disabled={isFormVisible}>
                    Add Workout
                </Button>
                <div className="ms-auto">
                    <Form>
                        <Form.Check
                            type="switch"
                            id="table-slider"
                            label={<span className="small ms-2">Table View</span>}
                            checked={isTableView}
                            onChange={handleToggle}
                            className="d-flex align-items-center"
                        />
                    </Form>
                </div>
            </div>

            {isFormVisible && <WorkoutForm setIsFormVisible={setIsFormVisible} />}

            <div>
                {/* WORKOUT DATA SHOWN HERE */}
                {isTableView ? (
                    <WorkoutTable workouts={currentWorkouts} />
                ) : (
                    <Row>
                        {currentWorkouts.map((workout_) => (
                            <Col key={workout_.id} sm={10} md={5} lg={3}>
                                <WorkoutCard workout={workout_} />
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
            </div>
        </Container>
    );
};

export default Workouts;
