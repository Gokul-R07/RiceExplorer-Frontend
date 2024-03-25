import React from 'react';
import { Modal, Button } from 'react-bootstrap'; 

function ThresholdPopup({ showPopup, handleClose, thresholdData }) {
  return (
    <Modal show={showPopup} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Threshold Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Max Threshold:</p>
        <ul>
          <li>VH_max: {thresholdData.VH_max}</li>
          <li>VV_max: {thresholdData.VV_max}</li>
        </ul>
        <p>Min Threshold:</p>
        <ul>
          <li>VH_min: {thresholdData.VH_min}</li>
          <li>VV_min: {thresholdData.VV_min}</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ThresholdPopup;
