import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface IframeVideoModalProps {
  show: boolean;
  onClose: () => void;
  url: string;
}

const IframeVideo: React.FC<IframeVideoModalProps> = ({ show, onClose, url }) => {
  const getEmbedUrl = (link: string) => {
    const videoIdMatch = link.match(/(?:\?v=|\/embed\/|\.be\/)([^&]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return link; // fallback if not a YouTube URL
  };

  if (!url) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Workout Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe
          src={getEmbedUrl(url)}
          title="Workout Video"
          width="100%"
          height="400px"
          frameBorder="0"
          allowFullScreen
          style={{ borderRadius: '8px' }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IframeVideo;
