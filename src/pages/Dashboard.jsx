import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Table, notification } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EditModal from "../components/modal/EditModal";
import DeleteModal from "../components/modal/DeleteModal";
import networkRequest from "../lib/apis/networkRequest";

const Dashboard = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "_id",
      render: (_id) => (
        <Row>
          <Button
            style={{ marginRight: "1rem" }}
            onClick={() => editHandler(_id)}
            icon={<EditOutlined />}
          />
          <Button
            danger
            onClick={() => deleteHandler(_id)}
            icon={<DeleteOutlined />}
          />
        </Row>
      ),
    },
  ];
  const [datas, setDatas] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dataToSendForEdit, setDataToSendForEdit] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState("");
  const [indexSearchText, setIndexSearchText] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  const getData = async () => {
    setLoading(true);
    try {
      const { isOk, message, data } = await networkRequest(
        "/admin/get_data",
        "POST",
        {
          searchString: indexSearchText,
          page: `${tableParams.pagination.current}`,
          size: `${tableParams.pagination.pageSize}`,
        }
      );
      if (isOk) {
        setDatas(data.dataList);
        setLoading(false);
        setTableParams((prevState) => ({
          // ...prevState,
          pagination: {
            ...prevState.pagination,
            total: data.count,
          },
        }));
      } else {
        setDatas([]);
        notification.error({
          message: message || "Something went wrong :(",
        });
        setLoading(false);
      }
    } catch (err) {
      console.log("Error =", err);
      setLoading(false);
    }
  };

  const editedDataHandler = async (values) => {
    const reqBody = {
      email: dataToSendForEdit.email,
      nameToUpdate: values.name,
      emailToUpdate: values.email,
      roleToUpdate: values.role,
    };
    try {
      const { isOk, message } = await networkRequest(
        "/admin/edit_data",
        "POST",
        reqBody,
      );
      if (!isOk) {
        notification.error({
          message,
        });
      } else {
        notification.success({
          message,
        });
        getData();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.log("Error =", err);
    }
  };

  const deleteDataHandler = async (values) => {
    if(values === "OK"){
      const reqBody = {
        _id: dataToDelete._id,
      };
      try {
        const { isOk, message } = await networkRequest(
          "/admin/delete_data",
          "POST",
          reqBody,
        );
        if (!isOk) {
          notification.error({
            message: message || "Something went wrong :(",
          });
        } else {
          setIsDeleteModalOpen(false);
          notification.success({
            message: message || "Successfully Deleted :)",
          });
          getData();
        }
      } catch (err) {
        console.log("Error =", err);
      }
    }else{
      notification.error({
        message: "Modal response Invalid",
      });
    }
  }

  const handleTableChange = (pagination) => {
    setTableParams({
      pagination,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDatas([]);
    }
  };

  const textIndexSearchHandler = (event) => {
    const searchString = event.target.value;
    setIndexSearchText(searchString);
  };

  const editHandler = (values) => {
    setDataToSendForEdit(values);
    setIsEditModalOpen(true);
  };

  const editModalCancleHandler = () => {
    setIsEditModalOpen(false);
  };

  const deleteHandler = (values) => {
    setIsDeleteModalOpen(true);
    setDataToDelete(values);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tableParams), tableParams.pagination.total]);

  useEffect(() => {
    const getDatas = setTimeout(() => {
      getData();
    }, 1000);
    return () => clearTimeout(getDatas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexSearchText]);

  return (
    <div>
      <Row style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        <Col span={10}>
          <Input
          style={{height: "35px"}}
            onChange={textIndexSearchHandler}
            placeholder="enter value..."
          />
        </Col>
        <Col span={12}></Col>
        <Col span={2}>
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={loading}
          />
        </Col>
      </Row>
      <Table
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        columns={columns}
        dataSource={datas}
      />
      {isEditModalOpen && (
        <EditModal
          open={isEditModalOpen}
          onCancel={editModalCancleHandler}
          dataToSend={dataToSendForEdit}
          payloadData={editedDataHandler}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          visible={isDeleteModalOpen}
          onClose={closeDeleteModal}
          payloadData={dataToDelete}
          response={deleteDataHandler}
        />
      )}
    </div>
  );
};
export default Dashboard;
