import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function AlertModal({ show, onHide, onConfirm }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Remover todas as guias?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Atenção!</h4>
        <p>Você confirma que deseja apagar todas as guias?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        <Button onClick={onConfirm}>Remover</Button>
      </Modal.Footer>
    </Modal>
  );
}
