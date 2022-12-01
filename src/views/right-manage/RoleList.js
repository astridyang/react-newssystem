import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Tree } from "antd";
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [treeData, settreeData] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    axios.get(`http://localhost:5000/roles`).then((res) => {
      setDataSource(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get(`http://localhost:5000/rights?_embed=children`).then((res) => {
      settreeData(res.data);
    });
  }, []);
  const showConfirm = (item) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        setDataSource(dataSource.filter((data) => data.id !== item.id));
        axios.delete(`http://localhost:5000/roles/${item.id}`);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  const column = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "Name",
      dataIndex: "roleName",
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
              type="primary"
              shape="circle"
              onClick={() => {
                setisModalOpen(true);
                setCurrentRights(item.rights);
                setCurrentId(item.id);
              }}
            >
              <UnorderedListOutlined />
            </Button>
          </div>
        );
      },
    },
  ];
  const handleOk = () => {
    setisModalOpen(false);
    const newDataSource = dataSource.map((item) => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights,
        };
      }
      return item;
    });
    setDataSource(newDataSource);
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights,
    });
  };
  const handleCancel = () => {
    setisModalOpen(false);
  };
  const onCheck = (checkKeys) => {
    setCurrentRights(checkKeys.checked);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={column}
        rowKey={(item) => item.id}
      />
      <Modal
        title="Right Distribution"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          onCheck={onCheck}
          treeData={treeData}
          checkStrictly={true}
          checkedKeys={currentRights}
          fieldNames={{ title: "label" }}
        />
      </Modal>
    </div>
  );
}
