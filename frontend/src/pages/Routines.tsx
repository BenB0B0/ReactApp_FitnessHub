import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import RoutineForm from '../components/RoutineForm';
import { useRoutine } from "../context/RoutineContext";
import RoutineList from "../components/RoutineList";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchFilter from "../components/SearchFilter";

const Routine = () => {
    const [showForm, setShowForm] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const { getRoutines, routinesLoading, filteredRoutines, searchTerm, setSearchTerm } = useRoutine();

    // **** USE EFFECT CALLS ****
    useEffect(() => {
        getRoutines();
    }, []);

    return (
        <div className="p-4">
            <div className="mb-3 mt-3 d-flex align-items-center gap-1">
                <Button variant="outline-primary" onClick={() => setShowForm(true)}>
                    + Create Routine
                </Button>
                <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {showForm && <RoutineForm onClose={() => setShowForm(false)} />}

            {!routinesLoading ? (
                <>
                    {filteredRoutines.map((routine) => (
                        <div key={routine.id} className="mb-2">
                            <RoutineList
                                routine={routine}
                                activeKey={activeKey}
                                setActiveKey={(key) => {
                                    setActiveKey(prev => {
                                        const newKey = prev === key ? null : key;

                                        // Set or clear search depending on whether it's being toggled open or closed
                                        if (newKey === null) {
                                            setSearchTerm('');
                                        } else {
                                            setSearchTerm(routine.name);
                                        }

                                        return newKey;
                                    });
                                }}
                            />
                        </div>
                    ))}
                </>
            ) : (
                <LoadingSpinner />
            )}

        </div>
    );
};

export default Routine;
