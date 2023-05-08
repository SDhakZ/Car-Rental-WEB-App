import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const ConfirmModal = (props) => {
  const { header, isConfirming, handleConfirmMethod, onClose, buttonVariant } =
    props;
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };
  return (
    <>
      <Modal show={props.showConfirmModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={buttonVariant ? buttonVariant : "danger"}
            onClick={handleConfirmMethod}
          >
            {isConfirming ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "Confirm"
            )}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
