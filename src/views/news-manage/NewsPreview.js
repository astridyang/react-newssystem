import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-layout";
import { Descriptions, Button } from "antd";
import moment from "moment";
export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState(null);
  const params = useParams();
  useEffect(() => {
    axios
      .get(`/news/${params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo(res.data);
      });
  }, [params.id]);
  const auditStateList = ["未审核", "审核中", "已通过", "未通过"];
  const publishStateList = ["未发布", "待发布", "已上线", "已下线"];
  const colorList = ["black", "orange", "green", "red"];
  return (
    <div>
      {newsInfo && (
        <>
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.label}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Author">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="Create Time">
                {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Publish Time">
                {newsInfo.publishTime
                  ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Region">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="Audit Status">
                <span style={{color:colorList[newsInfo.auditState]}}>{auditStateList[newsInfo.auditState]}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Publish Status">
                <span style={{color:colorList[newsInfo.publishState]}}>{publishStateList[newsInfo.publishState]}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Visits">
                {newsInfo.view}
              </Descriptions.Item>
              <Descriptions.Item label="Star">
                {newsInfo.star}
              </Descriptions.Item>
              <Descriptions.Item label="Comments">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            dangerouslySetInnerHTML={{ __html: newsInfo.content }}
            style={{ padding: "24px" }}
          ></div>
        </>
      )}
    </div>
  );
}
