import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { PlusCircle, BarChart, Calendar2Check, Lightning, Clock, Signpost } from "react-bootstrap-icons";
import { useWorkout } from "../context/WorkoutContext";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAfter, startOfToday } from 'date-fns';
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
    const { workouts, workoutOptions, workoutsLoading, setIsFormVisible } = useWorkout();
    const navigate = useNavigate();
    const { user } = useAuth();
    const lastWorkout = workouts.length > 0 ? workouts[0] : null;

    const findIconForWorkout = (workoutName: string) => {
        const workoutOption = workoutOptions.find(option => option.value === workoutName);
        return workoutOption ? workoutOption.icon : faQuestionCircle;
    };

    return (
        <> {workoutsLoading ? (<LoadingSpinner/>) : (
        <Container className="py-5 text-center">
            <h1 className="display-4 mb-3 text-primary fw-bold">Welcome Back, {user.name} 👋</h1>
            <p className="lead text-muted mb-5">Let’s crush some goals today. Track your progress and keep moving forward.</p>

            <Row className="justify-content-center mb-4">
                <Col xs={10} md={6} lg={4}>
                    {lastWorkout ? (
                        <Card className="text-start shadow hover-scale" onClick={() => navigate("/workouts")}>
                            <Card.Body>
                                <h5 className="mb-3"> <Lightning className="me-2 text-warning" />
                                    {isAfter(lastWorkout.date, startOfToday()) ? ("Upcoming Workout") : ("Last Workout")}
                                </h5>
                                <p className="mb-1 d-flex align-items-center">
                                    <FontAwesomeIcon className="me-2" icon={findIconForWorkout(lastWorkout.name)} />
                                    {lastWorkout.name}
                                </p>

                                <p className="mb-1 d-flex align-items-center">
                                    <Calendar2Check className="me-2" />
                                    {new Date(lastWorkout.date).toLocaleDateString()}
                                </p>

                                <p className="mb-1 d-flex align-items-center">
                                    <Clock className="me-2" />
                                    {lastWorkout.time_length} mins
                                    {lastWorkout.distance ? (
                                        <>
                                            <span className="mx-2">|</span>
                                            <Signpost className="me-2" />
                                            {lastWorkout.distance} miles
                                        </>
                                    ) : null}
                                </p>
                            </Card.Body>
                        </Card>
                    ) : (
                        <p className="text-muted">"No workouts yet. Let's get started!"</p>
                    )}
                </Col>
            </Row>

            <Row className="justify-content-center gap-3">
                <Col xs="auto">
                    <Button variant="success" size="lg" onClick={() => {setIsFormVisible(true); navigate("/workouts");}}>
                        <PlusCircle className="me-2" />
                        Add Workout
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" size="lg" onClick={() => navigate("/calendar")}>
                        <Calendar2Check className="me-2" />
                        View Calendar
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button variant="dark" size="lg" onClick={() => navigate("/stats")}>
                        <BarChart className="me-2" />
                        View Progress
                    </Button>
                </Col>
            </Row>
        </Container>
        )}; </>
    );
};

export default Home;
