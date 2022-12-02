import {
  Button,
  Form,
  Input,
  message,
  notification,
  Select,
  Steps,
} from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState, useParams } from "react";
import { useNavigate } from "react-router-dom";
import NewsEditor from "../../components/news-manage/NewsEditor";
import style from "./NewsAdd.module.css";
import { PageHeader } from "@ant-design/pro-layout";
const { Option } = Select;
export default function NewsUpdate() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [formInfo, setFormInfo] = useState(null);
  const [content, setContent] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategoryList(res.data);
    });
  });

  const params = useParams();
  useEffect(() => {
    axios
      .get(`/news/${params.id}?_expand=category&_expand=role`)
      .then((res) => {
        let { title, categoryId, content } = res.data;
        formRef.current.setFieldsValue({
          title,
          categoryId,
        });
        setContent(content);
      });
  }, [params.id]);
  const items = [
    { title: "Basic", description: "Title,Category" },
    { title: "Content", description: "" },
    { title: "Submit", description: "Draft/Audit" },
  ];
  const handlePrev = () => {
    setCurrent(current - 1);
  };
  const handleNext = () => {
    if (current === 0) {
      formRef.current
        .validateFields()
        .then((values) => {
          setFormInfo(values);
          setCurrent(current + 1);
        })
        .catch((err) => console.log(err));
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("conent can't be empty");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const { region, username } = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  const handleSave = (auditState) => {
    axios
      .post("/news", {
        ...formInfo,
        content,
        region: region ? region : "全球",
        author: username,
        roleId: 1,
        auditState: auditState,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
      })
      .then((res) => {
        navigate(`${auditState ? "/audit-manage/list" : "/news-manage/draft"}`);
        notification.info({
          message: `Save success`,
          description: `You can check it in your ${
            auditState ? "audit list" : "draft list"
          }`,
          placement: "bottomRight",
        });
      });
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title="Edit News"
      ></PageHeader>

      <Steps items={items} />

      <div className={style.center}>
        <div className={current === 0 ? "" : style.hidden}>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} ref={formRef}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Select>
                {categoryList.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.hidden}>
          <NewsEditor
            getContent={(content) => {
              setContent(content);
            }}
            content={content}
          />
        </div>
        {/* <div className={current === 2 ? "" : style.hidden}></div> */}
      </div>

      {current == 2 && (
        <>
          <Button type="primary" onClick={() => handleSave(0)}>
            Draft
          </Button>
          <Button danger onClick={() => handleSave(1)}>
            Audit
          </Button>
        </>
      )}
      {current > 0 && <Button onClick={() => handlePrev()}>Prev</Button>}
      {current < 2 && <Button onClick={() => handleNext()}>Next</Button>}
    </div>
  );
}
