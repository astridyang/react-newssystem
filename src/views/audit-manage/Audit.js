import { Button, Table, Tag, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Audit() {
  const [dataSource, setDataSource] = useState([]);
  const { roleId, username, region } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      let list = res.data;
      if (roleId === 2) {
        list = list.filter(
          (item) =>
            item.author === username ||
            (item.region === region && item.roleId === 3)
        );
      }
      setDataSource(list);
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
            <Button
              type="primary"
              onClick={() => {
                handleAudit(item,2,1);
              }}
            >
              通过
            </Button>
            <Button
              danger
              onClick={() => {
                handleAudit(item,3,0);
              }}
            >
              驳回
            </Button>
          </div>
        );
      },
    },
  ];
  const handleAudit = (item,auditState,publishState) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: `Audit success`,
          description: `You can check it in your unpublished list or audit list`,
          placement: "bottomRight",
        });
      });
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
