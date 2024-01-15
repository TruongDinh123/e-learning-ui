"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { Button, Dropdown, Menu, Popconfirm, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import EditRole from "../users/edit-role/page";
import { useMediaQuery } from "react-responsive";
import {
  deleteCategory,
  getAllCategoryAndSubCourses,
} from "@/features/categories/categorySlice";
import EditCategory from "./update-category/page";
import CreateCategory from "./create-category/page";

export default function ViewCategories() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState([]);
  const [update, setUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Chức năng",
      dataIndex: "action",
    },
  ];

  //viewRoles api
  useEffect(() => {
    setIsLoading(true);

    dispatch(getAllCategoryAndSubCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCategory(res.metadata);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch, update]);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  //handleDelete
  const handleDelete = (categoryId) => {
    setIsLoading(true);
    dispatch(deleteCategory(categoryId))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdate(update + 1);
        }
        setUpdate(update + 1);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  //table role
  let data = [];
  category.forEach((i, index) => {
    const menu = (
      <Menu>
        <Menu.Item>
          <EditCategory
            id={i?._id}
            categoryName={i?.name}
            refresh={() => setUpdate(update + 1)}
          />
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn muốn chắc xóa danh mục?"
            okText="Có"
            cancelText="Không"
            okButtonProps={{
              style: { backgroundColor: "red" },
            }}
            onConfirm={() => handleDelete(i?._id)}
          >
            <Button danger style={{ width: "100%" }}>
              Xóa
            </Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
    data.push({
      key: index + 1,
      name: i?.name,
      action: isMobile ? (
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button
            className="text-center justify-self-center"
            onClick={(e) => e.preventDefault()}
          >
            Chức năng
          </Button>
        </Dropdown>
      ) : (
        <Space size={"middle"}>
          <EditCategory
            id={i?._id}
            categoryName={i?.name}
            refresh={() => setUpdate(update + 1)}
          />
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn muốn chắc xóa danh mục?"
            okText="Có"
            cancelText="Không"
            okButtonProps={{
              style: { backgroundColor: "red" },
            }}
            onConfirm={() => handleDelete(i?._id)}
          >
            <Button danger style={{ width: "100%" }}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  });

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <CreateCategory refresh={() => setUpdate(update + 1)} />
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5, position: ["bottomLeft"] }}
            className="pt-3"
          />
        </React.Fragment>
      )}
    </div>
  );
}
