"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ChartPieIcon,
  ChevronRightIcon,
  CursorArrowRaysIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "@heroicons/react";
import Link from "next/link";
import { Avatar, Dropdown, Menu } from "antd";
import {
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  logOut,
  resetState,
  setUser,
  setUserName,
} from "@/features/User/userSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  getAllCategoryAndSubCourses,
  resetStateCategory,
} from "@/features/categories/categorySlice";
import { resetStateCourse } from "@/features/Courses/courseSlice";
import { resetStateLesson } from "@/features/Lesson/lessonSlice";
import { resetStateQuiz } from "@/features/Quiz/quizSlice";

const logo3 = "/images/logo5.png";

const products = [
  {
    name: "Khóa học của tôi",
    description: "Nơi bạn có thể xem khóa học của mình",
    href: "/courses/view-course",
    icon: ChartPieIcon,
  },
  {
    name: "Điểm của tôi",
    description: "Bạn có thể xem điểm của mình ở đây",
    href: "/courses/view-score",
    icon: CursorArrowRaysIcon,
  },
];

const UserLinks = () => {
  return (
    <>
      <Link href="/courses/view-course">
        <div className="flex items-center">
          <BookOpenIcon className="h-5 w-5 text-gray-600 mr-2" />
          <span className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
            Khóa học của tôi
          </span>
        </div>
      </Link>
      <Link href="/courses/view-score">
        <div className="flex items-center">
          <BarChartIcon className="h-5 w-5 text-gray-600 mr-2" />
          <span className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
            Điểm của tôi
          </span>
        </div>
      </Link>
    </>
  );
};
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function HeaderUser() {
  const userState = useSelector((state) => state.user?.user);
  const isAdmin =
    userState?.roles?.some(
      (role) =>
        role.name === "Admin" ||
        role.name === "Super-Admin" ||
        role.name === "Mentor"
    ) ||
    userState?.metadata?.account?.roles?.some(
      (role) =>
        role.name === "Admin" ||
        role.name === "Super-Admin" ||
        role.name === "Mentor"
    );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName =
    useSelector((state) => state.user.userName) ||
    JSON.parse(localStorage.getItem("userName"));

  const router = useRouter();
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(logOut())
      .then(unwrapResult)
      .then(() => {
        localStorage.clear();
        Cookies.remove("Bearer");
        Cookies.remove("refreshToken");
        dispatch(resetState());
        dispatch(setUserName(null));
        dispatch(setUser(null));
        dispatch(resetStateCourse());
        dispatch(resetStateCategory());
        dispatch(resetStateLesson());
        dispatch(resetStateQuiz());
        router.push("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }, [dispatch, router]);

  const menu = (
    <Menu>
      <Menu.Item>
        <Link href="/user">Cập nhật thông tin</Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/user/change-password">Đổi mật khẩu</Link>
      </Menu.Item>
      <Menu.Item>
        {isAdmin && <Link href="/admin/courses">Quản trị viên</Link>}
      </Menu.Item>
      <Menu.Item onClick={logout}>
        {userState !== null && (
          <span
            title="Logout"
            className="text-red-500"
            icon={<LogoutOutlined />}
          >
            Đăng xuất
          </span>
        )}
      </Menu.Item>
    </Menu>
  );

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(getAllCategoryAndSubCourses())
      .then(unwrapResult)
      .then((res) => {
        setCategories(res.metadata);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [dispatch]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  //lấy ra các category có ít nhất 1 khóa học
  const categoriesWithCourses = categories.filter(
    (category) => category.courses && category.courses.length > 0
  );

  return (
    <header className="bg-[#4d6d7b] fixed w-full top-0 z-50">
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[75px]">
          <div className="flex items-center">
            {/* <div className="flex-shrink-0">
              <a href="/">
                <img className="h-36 w-auto" src={logo3} alt="" />
              </a>
            </div> */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Popover className="relative">
                  <Popover.Button className="">
                    <div className="ml-3 relative">
                      <div className="flex items-center space-x-4">
                        <a
                          aria-current="page"
                          className="text-white py-2 rounded-md text-sm font-medium"
                          href="#"
                        >
                          Danh mục
                        </a>
                        <ChevronDownIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5">
                      <div
                        className="p-1"
                        style={{ maxHeight: "500px", overflowY: "auto" }}
                      >
                        <div className="flex space-x-6 p-6 bg-white">
                          <nav aria-label="Main navigation" className="w-3/6">
                            <ul className="space-y-1">
                              {categoriesWithCourses.map((category) => (
                                <li key={category?._id}>
                                  <a
                                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleCategorySelect(category);
                                    }}
                                  >
                                    {category.name}
                                    <ChevronRightIcon className="w-4 h-4" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </nav>
                          <div className="w-5/6 overflow-auto max-h-[500px]">
                            {selectedCategory && (
                              <div key={selectedCategory?._id}>
                                <h2 className="text-xl font-semibold mb-4">
                                  {selectedCategory.name}
                                </h2>
                                {selectedCategory.courses
                                  .filter(
                                    (course) => course.showCourse === true
                                  )
                                  .map((course) => (
                                    <div key={course?._id} className="mb-6">
                                      <Link
                                        className="text-sm text-[#C89F65] font-medium mb-2"
                                        href={`/courses/view-course-details/${course?._id}`}
                                      >
                                        {course.name}
                                      </Link>
                                    </div>
                                  ))}
                                <div className="mt-4">
                                  <a
                                    className="text-blue-600 hover:underline"
                                    href="#"
                                  >
                                    {/* Tất cả &quot;{selectedCategory.name}&quot; */}
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>

                {/* search */}
                {/* <div className="relative">
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:border-white focus:ring-white sm:text-sm"
                    id="search"
                    placeholder="Tìm kiếm khóa học"
                    type="text"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="flex lg:hidden">
            {!userState ? (
              <Link href="/login">
                <span className="cursor-pointer -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white">
                  Đăng nhập
                </span>
              </Link>
            ) : (
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <div className="ml-10 flex items-center space-x-4">
                  {userState !== null && (
                    <Popover className="relative">
                      <Popover.Button className="">
                        <div className="ml-3 relative">
                          <div className="flex items-center space-x-4">
                            <a
                              aria-current="page"
                              className="text-white py-2 rounded-md text-sm font-medium"
                              href="#"
                            >
                              Cá nhân
                            </a>
                            <ChevronDownIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {products.map((item) => (
                              <div
                                key={item.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                              >
                                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                  <item.icon
                                    className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="flex-auto">
                                  <a
                                    href={item.href}
                                    className="block font-semibold text-gray-900"
                                  >
                                    {item.name}
                                    <span className="absolute inset-0" />
                                  </a>
                                  <p className="mt-1 text-gray-600">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  )}

                  {userState == null && (
                    <Link href="/login" icon={<LoginOutlined />}>
                      <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Đăng nhập
                      </span>
                    </Link>
                  )}

                  {userState !== null && (
                    <Dropdown overlay={menu} placement="bottomLeft">
                      <div className="ml-3 relative">
                        <div className="flex items-center space-x-4">
                          <a
                            aria-current="page"
                            className="flex items-center justify-between text-white px-3 py-2 rounded-md text-sm font-medium"
                            href="#"
                          >
                            <Avatar
                              size={40}
                              className="bg-white items-center justify-between"
                              icon={<UserOutlined />}
                              src={
                                userState?.image_url ||
                                userState?.metadata?.account?.image_url
                              }
                            />
                            <span className="ml-2 text-white">
                              {userState?.firstName ||
                                userState?.metadata?.account?.firstName}{" "}
                              {userState?.lastName ||
                                userState?.metadata?.account?.lastName}
                            </span>
                          </a>
                        </div>
                      </div>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* collapse */}
        <div className="-mr-2 flex md:hidden">
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between bg-[#4d6d7b]">
                {/* <div className="flex-shrink-0">
                  <Link href="/">
                    <img
                      className="h-36 w-auto object-contain  absolute top-0 mt-[26px] transform -translate-y-1/2 "
                      style={{ left: "1rem" }}
                      src={logo3}
                      alt=""
                    />
                  </Link>
                </div> */}
                <button
                  type="button"
                  className="rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="flow-root px-6 py-6">
                <div className="-my-6 divide-y divide-black">
                  <div className="space-y-2 py-6">
                    {userState !== null && (
                      <Disclosure as="div" className="-mx-3">
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                              <span className="font-bold">{userName}</span>
                              {isAdmin && (
                                <Link href="/admin/courses">( Admin )</Link>
                              )}
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "rotate-180" : "",
                                  "h-5 w-5 flex-none"
                                )}
                                aria-hidden="true"
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="mt-2 space-y-2">
                              <Disclosure.Button
                                as="a"
                                href="/user"
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                <UserOutlined className="h-5 w-5 text-gray-600 mr-2" />
                                Cập nhật thông tin
                              </Disclosure.Button>
                              <Disclosure.Button
                                as="a"
                                href="/user/change-password"
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                <LockOutlined className="h-5 w-5 text-gray-600 mr-2" />
                                Đổi mật khẩu
                              </Disclosure.Button>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                    <div onClick={() => setMobileMenuOpen(false)}>
                      {userState && <UserLinks />}
                    </div>
                  </div>
                  <div className="space-y-2 py-6">
                    <span
                      title="Logout"
                      icon={<LogoutOutlined />}
                      onClick={logout}
                      className="cursor-pointer -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <LogOutIcon className="h-5 w-5 text-gray-600 mr-2" />
                        <a href="/login">Đăng xuất</a>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
