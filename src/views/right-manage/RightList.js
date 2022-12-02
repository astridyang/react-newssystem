import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Tag, Modal, Switch, Popover } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      res.data.forEach((item) => {
        if (!item.children.length) {
          item.children = null;
        }
      });
      setDataSource(res.data);
    });
  }, []);

  const showConfirm = (item) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        console.log(item);
        if (item.grade === 1) {
          // 一级权限直接删除
          setDataSource(dataSource.filter((data) => data.id !== item.id));
          axios.delete(`/rights/${item.id}`);
        } else {
          // 二级权限先找到父级，在父级删除，再删除children

          const parent = dataSource.filter((data) => data.id === item.rightId);
          parent[0].children = parent[0].children.filter(
            (data) => data.id !== item.id
          );
          setDataSource([...dataSource]);
          axios.delete(`/children/${item.id}`);
        }
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  const switchChange = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
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
            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => switchChange(item)}
                  />
                </div>
              }
              title="Page Config"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                disabled={item.pagepermisson === undefined}
              >
                <EditOutlined />
              </Button>
            </Popover>
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
