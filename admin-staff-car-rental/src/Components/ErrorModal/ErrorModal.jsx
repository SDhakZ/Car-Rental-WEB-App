import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const ErrorModal = (props) => {
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };
  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
