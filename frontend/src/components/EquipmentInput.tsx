import React, { useState } from 'react';
import { Form, Badge } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

interface EquipmentInputProps {
  equipment: string[];
  setEquipment: (items: string[]) => void;
}

const EquipmentInput: React.FC<EquipmentInputProps> = ({ equipment, setEquipment }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!equipment.includes(input.trim())) {
        setEquipment([...equipment, input.trim()]);
      }
      setInput('');
    }
  };

  const removeItem = (item: string) => {
    setEquipment(equipment.filter(e => e !== item));
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Equipment Needed</Form.Label>
      <Form.Control
        type="text"
        placeholder="Press Enter or Comma to add"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="mt-2 d-flex flex-wrap gap-2">
        {equipment.map((item) => (
          <Badge key={item} bg="secondary" className="d-flex align-items-center">
            {item}
            <X className="ms-2" role="button" onClick={() => removeItem(item)} />
          </Badge>
        ))}
      </div>
    </Form.Group>
  );
};

export default EquipmentInput;
