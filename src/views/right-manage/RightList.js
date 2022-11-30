import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Tag, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
      res.data.forEach((item) => {
        if (!item.children.length) {
          item.children = null;
        }
      });
      setDataSource(res.data);
    });
  }, []);

  const showConfirm = (item) => {
    confirm()
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "Name",
      dataIndex: "label",
    },
    {
      title: "Path",
      dataIndex: "key",
      render(key) {
        return <Tag color="orange">{key}</Tag>;
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
            <Button type="primary" shape="circle">
              <EditOutlined />
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
      />
      ;
    </div>
  );
}
