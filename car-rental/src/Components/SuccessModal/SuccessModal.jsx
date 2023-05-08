import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";

export const SuccessModal = (props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId = null;
    if (props.show) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          const diff = 100 / (1000 / 100); // fill up over 1.3 seconds
          const nextProgress = prevProgress + diff;
          if (nextProgress >= 100) {
            clearInterval(intervalId);
          }
          return nextProgress;
        });
      }, 100);
    }
    return () => clearInterval(intervalId);
  }, [props.show]);

  useEffect(() => {
    if (props.show) {
      const timerId = setTimeout(() => {
        handleClose();
      }, 1500);
      return () => clearTimeout(timerId);
    } else {
      // Reset progress when the modal is hidden
      setProgress(0);
    }
  }, [props.show]);

  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
      if (props.refresh) {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <ProgressBar
            now={progress}
            style={{ width: "100%", height: "10px" }}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
