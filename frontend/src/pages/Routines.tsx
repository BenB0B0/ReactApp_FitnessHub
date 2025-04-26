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
        const matchingRoutine = filteredRoutines.find(r => r.name === searchTerm);
        if (matchingRoutine) {
            setActiveKey(matchingRoutine.id?.toString() ?? null);
        } else {
            setActiveKey(null);
            setSearchTerm('');
        }
    }, []);

    const handleAccordionClick = (routineId: string, routineName: string) => {
        setActiveKey(prev => {
            const newKey = prev === routineId ? null : routineId;
          
            setTimeout(() => {
              setSearchTerm(newKey === null ? '' : routineName);
            }, 0);
          
            return newKey;
        });
    };

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
                            onClick={() => handleAccordionClick(String(routine.id), routine.name)}
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
