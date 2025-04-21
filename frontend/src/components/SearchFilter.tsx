import { Form, Col, Row } from 'react-bootstrap';

interface SearchFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <Form.Group as={Row} className="align-items-center ms-2" controlId="searchInput">
            <Col>
                <Form.Control
                    type="text"
                    value={searchTerm}
                    placeholder="Filter"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-dark"
                />
            </Col>
        </Form.Group>
    );
};

export default SearchFilter;
