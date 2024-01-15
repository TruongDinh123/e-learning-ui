"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  ChevronRightIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "@heroicons/react";
import Link from "next/link";
import { Avatar, Button, Dropdown, Menu, message } from "antd";
import {
  DownOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getAUser, resetState, setUserName } from "@/features/User/userSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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
  {
    name: "Tạo phòng học",
    description: "Tạo phòng học để học tập cùng bạn bè",
    href: "/web-rtc/lobby",
    icon: FingerPrintIcon,
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
      <Link href="/web-rtc/lobby">
        <div className="flex items-center">
          <CameraIcon className="h-5 w-5 text-gray-600 mr-2" />
          <span className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
            Tạo phòng họp
          </span>
        </div>
      </Link>
    </>
  );
};
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
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

function CameraIcon(props) {
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
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
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

function FlagIcon(props) {
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
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
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

function PanelTopCloseIcon(props) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <path d="m9 16 3-3 3 3" />
    </svg>
  );
}

function LayoutGridIcon(props) {
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
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
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

function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function Header() {
  const userState = useSelector((state) => state.user?.user);
  const userProfile = useSelector((state) => state.user.profile);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName =
    useSelector((state) => state.user.userName) ||
    JSON.parse(localStorage.getItem("userName"));

  const router = useRouter();
  const dispatch = useDispatch();

  const id = localStorage.getItem("x-client-id");
  const [user, setUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUser(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {});
  };

  // useEffect(() => {
  //   if (!userState) {
  //     router.push("/login");
  //   }
  // }, [userState, router]);

  useEffect(() => {
    if (userState) {
      getAUsereData();
    }
  }, [getAUser, userName, userState]);

  const logout = useCallback(() => {
    router.push("/");
    localStorage.clear();
    Cookies.remove("Bearer");
    dispatch(resetState());
    dispatch(setUserName(null));
    dispatch(setUser(null));
  }, [dispatch, router]);

  const menu = (
    <Menu>
      <Menu.Item>
        <Link href="/user">Cập nhật thông tin</Link>
      </Menu.Item>
      <Menu.Item>
        {(userState?.roles?.includes("Admin") ||
          userState?.roles?.includes("Mentor")) && (
          <Link href="/admin/courses">Quản trị viên</Link>
        )}
      </Menu.Item>
      <Menu.Item>
        <Link href="/user/change-password">Đổi mật khẩu</Link>
      </Menu.Item>
      <Menu.Item>
        {(userState?.roles?.includes("Admin") ||
          userState?.roles?.includes("Mentor")) && (
          <Link href="/admin/courses">Quản trị viên</Link>
        )}
      </Menu.Item>
      <Menu.Item>
        {userState !== null && (
          <span
            title="Logout"
            className="text-red-500"
            onClick={logout}
            icon={<LogoutOutlined />}
          >
            Đăng xuất
          </span>
        )}
      </Menu.Item>
    </Menu>
  );

  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      name: "Ngoại Ngữ",
      courses: {
        "Tiếng Anh": [
          "Học Tiếng Anh Theo Chủ Đề",
          "Tiếng Anh Giao Tiếp",
          "Tiếng Anh Thương Mại",
          "Phương Pháp Học Tiếng Anh",
          "Từ Vựng Tiếng Anh",
          "Luyện Thi Tiếng Anh",
          "IELTS",
          "Phát Âm Tiếng Anh",
          "Ngữ Pháp Tiếng Anh",
          "TOEIC",
        ],
        "Tiếng Trung": ["Tiếng Trung Giao Tiếp", "Chứng Chỉ Tiếng Trung"],
        "Tiếng Nhật": ["Chứng Chỉ Tiếng Nhật", "Tiếng Nhật Cơ Bản"],
        "Tiếng Hàn": ["Tự Học Tiếng Hàn", "Chứng Chỉ Tiếng Hàn"],
        "Ngôn Ngữ Khác": [],
      },
    },
    {
      name: "Lập Trình - CNTT",
      courses: {
        "Tiếng Anh": [
          "Học Tiếng Anh Theo Chủ Đề",
          "Tiếng Anh Giao Tiếp",
          "Tiếng Anh Thương Mại",
          "Phương Pháp Học Tiếng Anh",
          "Từ Vựng Tiếng Anh",
          "Luyện Thi Tiếng Anh",
          "IELTS",
          "Phát Âm Tiếng Anh",
          "Ngữ Pháp Tiếng Anh",
          "TOEIC",
        ],
        "Tiếng Trung": ["Tiếng Trung Giao Tiếp", "Chứng Chỉ Tiếng Trung"],
        "Tiếng Nhật": ["Chứng Chỉ Tiếng Nhật", "Tiếng Nhật Cơ Bản"],
        "Tiếng Hàn": ["Tự Học Tiếng Hàn", "Chứng Chỉ Tiếng Hàn"],
        "Ngôn Ngữ Khác": [],
      },
    },
    {
      name: "Phát triển bản thân",
      courses: {
        "Tiếng Anh": [
          "Học Tiếng Anh Theo Chủ Đề",
          "Tiếng Anh Giao Tiếp",
          "Tiếng Anh Thương Mại",
          "Phương Pháp Học Tiếng Anh",
          "Từ Vựng Tiếng Anh",
          "Luyện Thi Tiếng Anh",
          "IELTS",
          "Phát Âm Tiếng Anh",
          "Ngữ Pháp Tiếng Anh",
          "TOEIC",
        ],
        "Tiếng Trung": ["Tiếng Trung Giao Tiếp", "Chứng Chỉ Tiếng Trung"],
        "Tiếng Nhật": ["Chứng Chỉ Tiếng Nhật", "Tiếng Nhật Cơ Bản"],
        "Tiếng Hàn": ["Tự Học Tiếng Hàn", "Chứng Chỉ Tiếng Hàn"],
        "Ngôn Ngữ Khác": [],
      },
    },
  ];
  return (
    <header className="bg-[#02354B] sticky top-0 z-20">
      {contextHolder}
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[75px]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <img className="h-36 w-auto" src={logo3} alt="" />
              </Link>
            </div>
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
                      <div className="p-1">
                        <div className="flex space-x-6 p-6 bg-white">
                          <nav aria-label="Main navigation" className="w-3/6">
                            <ul className="space-y-1">
                              {categories.map((category) => (
                                <li key={category.name}>
                                  <a
                                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedCategory(category);
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
                              <>
                                <h2 className="text-xl font-semibold mb-4">
                                  {selectedCategory.name}
                                </h2>
                                {Object.entries(selectedCategory.courses).map(
                                  ([language, courses]) => (
                                    <div key={language} className="mb-6">
                                      <h3 className="text-lg text-[#C89F65] font-medium mb-2">
                                        {language}
                                      </h3>
                                      <div className="flex flex-wrap -mx-2">
                                        {courses.map((course) => (
                                          <div
                                            key={course}
                                            className="px-2 w-1/2"
                                          >
                                            <a
                                              className="hover:text-blue-600 block mb-2"
                                              href="#"
                                            >
                                              {course}
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                )}
                                <div className="mt-4">
                                  <a
                                    className="text-blue-600 hover:underline"
                                    href="#"
                                  >
                                    Tất cả &quot;{selectedCategory.name}&quot;
                                  </a>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>

                {/* search */}
                <div className="relative">
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:border-white focus:ring-white sm:text-sm"
                    id="search"
                    placeholder="Tìm kiếm khóa học"
                    type="text"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
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
                              src={userProfile?.image_url || user?.image_url}
                            />
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
              <div className="flex items-center justify-between bg-[#02354B]">
                <div className="flex-shrink-0">
                  <Link href="/">
                    <img
                      className="h-36 w-auto object-contain  absolute top-0 mt-[26px] transform -translate-y-1/2 "
                      style={{ left: "1rem" }}
                      src={logo3}
                      alt=""
                    />
                  </Link>
                </div>
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
                              {(userState?.roles?.includes("Admin") ||
                                userState?.roles?.includes("Mentor")) && (
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
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )}
                    {userState && <UserLinks />}
                  </div>
                  <div className="space-y-2 py-6">
                    {userState !== null ? (
                      <span
                        title="Logout"
                        onClick={logout}
                        icon={<LogoutOutlined />}
                        className="cursor-pointer -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <LogOutIcon className="h-5 w-5 text-gray-600 mr-2" />
                          <span>Đăng xuất</span>
                        </div>
                      </span>
                    ) : (
                      <Link href="/login" icon={<LoginOutlined />}>
                        <span className="cursor-pointer -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Đăng nhập
                        </span>
                      </Link>
                    )}
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
