import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Switch } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import UserForm from "../../components/user-manage/UserForm";
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [isAddopen, setIsAddopen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const formRef = useRef(null);
  const editRef = useRef(null);
  const [regionDisabled, setRegionDisabled] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const { roleId, username, region } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    axios.get("/users?_expand=role").then((res) => {
      let list = res.data;
      if (roleId === 2) {
        list = list.filter(
          (item) =>
            item.username === username ||
            (item.region === region && item.roleId === 3)
        );
      }
      setDataSource(list);
    });
  }, [region,roleId,username]);
  useEffect(() => {
    axios.get("/regions").then((res) => {
      setRegionList(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setRoleList(res.data);
    });
  }, []);
  const showConfirm = (item) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        setDataSource(dataSource.filter((data) => data.id !== item.id));
        axios.delete(`/users/${item.id}`);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  function handleSubmit() {
    formRef.current
      .validateFields()
      .then((value) => {
        console.log(value);
        setIsAddopen(false);
        formRef.current.resetFields();
        axios
          .post(`/users`, {
            ...value,
            default: false,
            roleState: true,
          })
          .then((res) => {
            console.log(res.data);
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdate() {
    editRef.current
      .validateFields()
      .then((value) => {
        setRegionDisabled(!regionDisabled);
        setIsEditOpen(false);
        editRef.current.resetFields();
        setDataSource(
          dataSource.map((data) => {
            if (data.id === currentRow.id) {
              return {
                ...currentRow,
                ...value,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              };
            }
            return data;
          })
        );
        axios.patch(`/users/${currentRow.id}`, {
          ...value,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };
  const columns = [
    {
      title: "Region",
      dataIndex: "region",
      render(region) {
        return <b>{region ? region : "??????"}</b>;
      },
      filters: [
        ...regionList.map((item) => {
          return {
            text: item.label,
            value: item.value,
          };
        }),
        {
          text: "??????",
          value: "??????",
        },
      ],
      onFilter: (value, item) => {
        return value === "??????" ? item.region === "" : item.region === value;
      },
    },
    {
      title: "Role Name",
      dataIndex: "role",
      render(role) {
        return role?.roleName;
      },
    },
    {
      title: "User Name",
      dataIndex: "username",
    },
    {
      title: "roleState",
      dataIndex: "roleState",
      render(roleState, item) {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => {
              handleChange(item);
            }}
          />
        );
      },
    },
    {
      title: "Operation",
      render(item) {
        return (
          <div>
            <Button
              danger
              shape="circle"
              onClick={() => showConfirm(item)}
              disabled={item.default}
            >
              <DeleteOutlined />
            </Button>
            <Button
              type="primary"
              shape="circle"
              disabled={item.default}
              onClick={async () => {
                await setIsEditOpen(true);
                if (item.roleId === 1) {
                  setRegionDisabled(true);
                } else {
                  setRegionDisabled(false);
                }
                editRef.current.setFieldsValue(item);
                setCurrentRow(item);
              }}
            >
              <EditOutlined />
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setIsAddopen(true);
        }}
      >
        Add
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
      />
      <Modal
        open={isAddopen}
        title="Add User"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => setIsAddopen(false)}
        onOk={() => {
          handleSubmit();
        }}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={formRef} />
      </Modal>
      <Modal
        open={isEditOpen}
        title="Edit User"
        okText="Update"
        cancelText="Cancel"
        onCancel={async () => {
          await setRegionDisabled(!regionDisabled);
          setIsEditOpen(false);
        }}
        onOk={() => {
          handleUpdate();
        }}
      >
        <UserForm
          roleList={roleList}
          regionList={regionList}
          ref={editRef}
          regionDisabled={regionDisabled}
          isEdit={true}
        />
      </Modal>
      ;
    </div>
  );
}
