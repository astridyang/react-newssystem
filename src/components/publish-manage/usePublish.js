import { notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
const usePublish = (type) => {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then((res) => {
        setDataSource(res.data);
      });
  }, [username, type]);

  const handlePublish = (id) => {
    setDataSource(dataSource.filter((data) => data.id !== id));

    axios
      .patch(`/news/${id}`, {
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
  const handleSunset = (id) => {
    console.log(id);
    setDataSource(dataSource.filter((data) => data.id !== id));

    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then((res) => {
        notification.info({
          message: `Sunset success`,
          description: `You can check it in your Sunset list`,
          placement: "bottomRight",
        });
      });
  };
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((data) => data.id !== id));

    axios.delete(`/news/${id}`).then((res) => {
      notification.info({
        message: `Delete success`,
        placement: "bottomRight",
      });
    });
  };

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
};
export default usePublish;
