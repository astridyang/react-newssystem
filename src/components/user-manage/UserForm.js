import React, { forwardRef, useEffect, useState } from "react";
import { Form, Select, Input } from "antd";
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
  const [isRegionDisabled, setIsRegionDisabled] = useState(false);
  useEffect(() => {
    setIsRegionDisabled(props.regionDisabled);
  }, [props.regionDisabled]);
  const handleRoleChange = (value) => {
    if (value === 1) {
      setIsRegionDisabled(true);
      ref.current.setFieldValue("region", "");
    } else {
      setIsRegionDisabled(false);
    }
  };
  const { roleId, region } = JSON.parse(localStorage.getItem("token"));

  const checkRegionDisable = (item) => {
    if (props.isEdit) {
      if (roleId === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleId === 1) {
        return false;
      } else {
        return item.value !== region;
      }
    }
  };
  const checkRoleDisable = (item) => {
    if (props.isEdit) {
      if (roleId === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleId === 1) {
        return false;
      } else {
        return item.id !== 3
      }
    }
  };
  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="Region"
        rules={
          isRegionDisabled
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ]
        }
      >
        <Select disabled={isRegionDisabled}>
          {props.regionList.map((item) => (
            <Option
              value={item.value}
              key={item.id}
              disabled={checkRegionDisable(item)}
            >
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="Role"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Select onChange={(value) => handleRoleChange(value)}>
          {props.roleList.map((item) => (
            <Option
              value={item.id}
              key={item.id}
              disabled={checkRoleDisable(item)}
            >
              {item.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});
export default UserForm;
