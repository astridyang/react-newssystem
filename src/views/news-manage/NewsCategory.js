import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form, Input } from "antd";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/categories").then((res) => {
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
        axios.delete(`/categories/${item.id}`);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  const handleSave = (row) => {
    console.log(row);
    setDataSource(
      dataSource.map((item) => {
        if (item.id === row.id) {
          return {
            id: item.id,
            label: row.label,
            value: row.label,
          };
        }
        return item;
      })
    );
    axios.patch(`/categories/${row.id}`, {
      label: row.label,
      value: row.label,
    });
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
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "label",
        title: "Name",
        handleSave,
      }),
    },
    {
      title: "Operation",
      render(item) {
        return (
          <div>
            <Button danger shape="circle" onClick={() => showConfirm(item)}>
              <DeleteOutlined />
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      />
      ;
    </div>
  );
}
