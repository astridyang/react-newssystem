import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { confirm } = Modal;
export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        setDataSource(res.data);
      });
  }, []);

  const showConfirm = (item) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        setDataSource(dataSource.filter((data) => data.id !== item.id));
        axios.delete(`/news/${item.id}`);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  const handleAudit = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        navigate("/audit-manage/list");
        notification.info({
          message: `Save success`,
          description: `You can check it in your audit list`,
          placement: "bottomRight",
        });
      });
  };
  const navigate = useNavigate();
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      render(title, item) {
        return <a href={`/#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Category",
      dataIndex: "category",
      render(category) {
        return category.label;
      },
    },
    {
      title: "Operation",
      render(item) {
        return (
          <div>
            <Button danger shape="circle" onClick={() => showConfirm(item)}>
              <DeleteOutlined />
            </Button>
            <Button
              shape="circle"
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`);
              }}
            >
              <EditOutlined />
            </Button>
            <Button type="primary" shape="circle">
              <UploadOutlined onClick={() => handleAudit(item.id)} />
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      />
      ;
    </div>
  );
}
