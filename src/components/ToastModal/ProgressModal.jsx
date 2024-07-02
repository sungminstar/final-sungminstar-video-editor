import React from "react";
import { Modal } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./ProgressModal.module.css";

const ProgressModal = ({ show, onHide, progress }) => {
  return (
    <div className={styles.modal}>
      <Modal
        show={show}
        onHide={onHide}
        backdrop={false}
        keyboard={false}
        centered
        size="sm"
      >
        <div className={styles.modal__container}>
          <Modal.Body>
            <div className={styles.progress__container}>
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: "#383838",
                  textColor: "#383838",
                })}
              />
            </div>
            <p className={styles.progress__text}>Export in progress</p>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default ProgressModal;
