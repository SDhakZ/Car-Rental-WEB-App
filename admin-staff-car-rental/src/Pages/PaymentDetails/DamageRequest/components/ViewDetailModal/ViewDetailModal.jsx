import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ViewModalCSS from "./ViewDetailModal.module.css";

export const ViewDetailModal = (props) => {
  const { header, onClose } = props;
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };
  return (
    <>
      <Modal show={props.showDetailModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={ViewModalCSS["VM-img-container"]}>
            <img
              className={ViewModalCSS["VM-img"]}
              src={props.selectedRequest?.rentalDetails?.car?.image}
              alt="car"
            />
          </div>
          <div>
            <div className={ViewModalCSS["VM-info-wrap"]}>
              <p>
                <b>Username:</b>{" "}
                {props.selectedRequest?.rentalDetails?.customer?.username}
              </p>
              <p>
                <b>Full Name:</b>{" "}
                {props.selectedRequest?.rentalDetails?.customer?.name}
              </p>
            </div>

            <div className={ViewModalCSS["VM-info-wrap"]}>
              <p>
                <b>Car Name:</b>{" "}
                {props.selectedRequest?.rentalDetails?.car?.name}
              </p>
              <p>
                <b>Car Brand:</b>{" "}
                {props.selectedRequest?.rentalDetails?.car?.brand}
              </p>
            </div>
          </div>
          <div className={ViewModalCSS["VM-description"]}>
            <b>Damage Description:</b>{" "}
            <p className={ViewModalCSS["VM-desc"]}>
              {props.selectedRequest?.damageDescription}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
