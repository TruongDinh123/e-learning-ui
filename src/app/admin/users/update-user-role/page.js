import { getAllRole } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function UpdateUserRole() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    dispatch(getAllRole())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setRoles(res.data.metadata);
        } else {
          messageApi.error(res.message);
        }
      });
  }, [dispatch, messageApi]);

  return (
    <div>
      {contextHolder}
      <label htmlFor="role" className="fs-6 fw-bold">
        Danh sách vai trò:
      </label>
      <select id="role" className="mx-2">
        {roles &&
          roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
      </select>
    </div>
  );
}
