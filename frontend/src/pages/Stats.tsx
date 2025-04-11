import { PieChart, Pie, Legend, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Container, Row, Col, Card } from "react-bootstrap";
import { useWorkout } from "../context/WorkoutContext";

// Optional colors for charts
const COLORS = ["#0d6efd", "#ffc107", "#dc3545", "#198754", "#6610f2"];

const Stats = () => {
    const { workouts, workoutOptions } = useWorkout();

    // --- Radar
    const workoutCounts = workoutOptions.map((opt) => ({
        name: opt.label,
        count: workouts.filter((w) => w.name === opt.value).length,
    }));

    // --- Streaks
    // Get unique workout dates as YYYY-MM-DD
    const workoutDays = Array.from(new Set(
        workouts.map(w => new Date(w.date).toISOString().split("T")[0])
    )).sort();

    // Convert to Date objects
    const dateObjs = workoutDays.map(d => new Date(d));

    // Streak calculation
    let longest = 0;
    let current = 1;

    for (let i = 1; i < dateObjs.length; i++) {
        const prev = dateObjs[i - 1];
        const curr = dateObjs[i];
        const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            current += 1;
        } else {
            longest = Math.max(longest, current);
            current = 1;
        }
    }

    const longestStreak = Math.max(longest, current);


    // --- Distance over time 
    const distancePerDayMap: Record<string, number> = {};

    workouts.forEach((w) => {
        const date = new Date(w.date).toISOString().split("T")[0];
        const distance = w.distance || 0;

        if (distance > 0) {
            if (!distancePerDayMap[date]) {
                distancePerDayMap[date] = 0;
            }
            distancePerDayMap[date] += distance;
        }
    });

    const distancePerDay = Object.entries(distancePerDayMap)
        .map(([date, distance]) => ({ date, distance }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // --- Cardio vs Weight Breakdown ---
    const getOption = (name: string) =>
        workoutOptions.find(option => option.value === name);
    const totalCardio = workouts.filter(w => getOption(w.name)?.cardio).length;
    const totalWeight = workouts.length - totalCardio;
    const cardioVsWeightData = [
        { name: "Cardio", value: totalCardio },
        { name: "Strength", value: totalWeight }
    ];

    // --- Cardio Types Breakdown ---
    const cardioTypes = workoutOptions
        .filter(opt => opt.cardio)
        .map(opt => ({
            name: opt.label,
            value: workouts.filter(w => w.name === opt.value).length
        })).filter(d => d.value > 0);

    // --- Weight Types Breakdown ---
    const weightTypes = workoutOptions
        .filter(opt => !opt.cardio)
        .map(opt => ({
            name: opt.label,
            value: workouts.filter(w => w.name === opt.value).length
        })).filter(d => d.value > 0);

    // --- Longest Run / Bike ---
    const maxRun = Math.max(...workouts.filter(w => w.name === "Run").map(w => w.distance || 0), 0);
    const maxBike = Math.max(...workouts.filter(w => w.name === "Bike").map(w => w.distance || 0), 0);

    return (
        <Container className="py-4">
            <h2 className="text-center mb-4">Your Breakdown</h2>
            <Row>
                <Card className="text-center p-4 shadow mb-4 bg-light">
                    <h5>🔥 Longest Streak</h5>
                    <h2 className="text-primary">{longestStreak} days</h2>
                </Card>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className="m-3">
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart outerRadius="80%" data={workoutCounts}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" />
                                <PolarRadiusAxis />
                                <Radar dataKey="count" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="text-center p-4 shadow mb-4 bg-light">
                        <h5>🏃‍♂️ Longest Run</h5>
                        <h2 className="text-primary">{maxRun} miles</h2>
                    </Card>
                    <Card className="text-center p-4 shadow mb-4 bg-light">
                        <h5>🚴 Longest Bike Ride</h5>
                        <h2 className="text-primary">{maxBike} miles</h2>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card className="p-3 mb-4">
                        <h5>Cardio Breakdown</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={cardioTypes}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#ffc107" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="p-3 mb-4">
                        <h5>Cardio vs Strength</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={cardioVsWeightData} dataKey="value" nameKey="name" outerRadius={80} label>
                                    {cardioVsWeightData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card className="p-3 mb-4">
                        <h5>Strength Breakdown</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weightTypes}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#dc3545" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="p-3 mb-4">
                        <h5>Distances Over Time</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={distancePerDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(v) => `${v} mi`} />
                                <Tooltip formatter={(value: number) => `${value} miles`} />
                                <Line type="monotone" dataKey="distance" stroke="#0d6efd" strokeWidth={3} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default Stats;
