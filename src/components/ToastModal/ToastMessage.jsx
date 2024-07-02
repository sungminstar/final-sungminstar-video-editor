import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { CheckCircleOutlined } from "@ant-design/icons";

const ToastMessage = ({ show, onClose }) => {
  return (
    <ToastContainer
      className="p-3"
      position={"top-center"}
      style={{ zIndex: 1 }}
    >
      <Toast onClose={onClose} show={show} delay={2000} autohide>
        <Toast.Body>
          <CheckCircleOutlined /> Export completed
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
