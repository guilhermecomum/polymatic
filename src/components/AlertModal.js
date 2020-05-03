import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function AlertModal(props) {
  return (
    <Modal
      {...props}
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
        <Button variant="secondary" onClick={props.onHide}>
          Fechar
        </Button>
        <Button onClick={props.onConfirm}>Remover</Button>
      </Modal.Footer>
    </Modal>
  );
}
