import { useEffect, useState } from "react";
import { Modal, Button, Row, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
// import networkRequest from "../../lib/apis/networkRequest";

const EditModal = ({ open, dataToSend, onCancel, payloadData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = useForm();

  const onFinish = (values) => {
    payloadData(values);
    setIsLoading(true);
    if (open === false) {
      form.resetFields();
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataToSend) {
      form.setFieldsValue(dataToSend);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataToSend]);

  return (
    <Modal maskClosable={false} open={open} onCancel={onCancel} footer={null}>
      <div style={{ textAlign: "center" }}>
        <h2>
          <u>Edit Data</u>
        </h2>
      </div>
      <Form
        form={form}
        id="Edit__form"
        layout="vertical"
        name="EditForm"
        onFinish={onFinish}
        style={{
          maxHeight: 400,
          overflowY: "auto",
          margin: "auto",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[
            {
              required: true,
              message: "Please input your role!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            style={{ width: "25%", margin: "auto" }}
          >
            Edit
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditModal;
