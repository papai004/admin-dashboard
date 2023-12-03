import { Button, Modal, Tag } from "antd";
import React from "react";

const DeleteModal = ({ visible, onClose, payloadData, response }) => {

  const deleteResponseHandler = () => {
    response("OK");
  }
  return (
    <Modal
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <h3>
        Do you really want to delete
        <Tag color="blue">{payloadData.name}</Tag>?
      </h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <Button type="primary" onClick={deleteResponseHandler} danger style={{ marginRight: "0.4rem" }}>
            Yes
          </Button>
          <Button type="primary" onClick={onClose}>No</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
