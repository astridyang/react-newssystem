import { Button, Table, Tag, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => {
        setDataSource(res.data);
      });
  }, [username]);
  const auditText = ["", "审核中", "已通过", "未通过"];
  const colorList = ["black", "orange", "green", "red"];
  const columns = [
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
      title: "Audit State",
      dataIndex: "auditState",
      render(auditState) {
        return (
          <>
            <Tag color={colorList[auditState]}>{auditText[auditState]}</Tag>
          </>
        );
      },
    },
    {
      title: "Operation",
      render(item) {
        return (
          <div>
            {item.auditState === 1 && (
              <Button type="default" onClick={() => handleRevert(item)}>
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button
                type="primary"
                onClick={() => {
                  handleUpdate(item);
                }}
              >
                修改
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  const handlePublish = (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `Publish success`,
          description: `You can check it in your published list`,
          placement: "bottomRight",
        });
      });
  };
  const handleRevert = (item) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState: 0,
      })
      .then((res) => {
        notification.info({
          message: `Revert success`,
          description: `You can check it in your audit list`,
          placement: "bottomRight",
        });
      });
  };
  const navigate = useNavigate();
  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
