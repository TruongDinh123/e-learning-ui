import { getAUser, logOut, resetState, setUser, setUserName } from "@/features/User/userSlice";
import {
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Avatar, Menu, Dropdown, message } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Disclosure } from "@headlessui/react";
import { resetStateCourse } from "@/features/Courses/courseSlice";
import { resetStateCategory } from "@/features/categories/categorySlice";
import { resetStateLesson } from "@/features/Lesson/lessonSlice";
import { resetStateQuiz } from "@/features/Quiz/quizSlice";

const logo3 = "/images/logo5.png";

export default function AdminHeader(props) {
  const { setCollapsed, collapsed } = props;
  const userProfile = useSelector((state) => state?.user?.user);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userState = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();

  const id = localStorage.getItem("x-client-id");
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName =
    useSelector((state) => state?.user?.userName) ||
    JSON.parse(localStorage.getItem("userName"));

  useEffect(() => {
    if (!userProfile) {
      getAUsereData();
    } else {
      setData(userProfile);
    }
  }, [userProfile]);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata);
        }
      })
      .catch((error) => {});
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link href={"/admin/users/edit-user-form"}>Cập nhật thông tin</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href={"/admin/users/change-password"}> Đổi mật khẩu</Link>
      </Menu.Item>
      {userState !== null && (
        <Menu.Item onClick={() => handleLogOut()}>
          <span
            title="Logout"
            className="text-red-500"
            loading={isLoading}
            icon={<LogoutOutlined />}
          >
            Đăng xuất
          </span>
        </Menu.Item>
      )}
    </Menu>
  );

  const clearAuthState = () => {
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
    setIsLoading(false);
  };

  const handleLogOut = () => {
    setIsLoading(true);
    dispatch(logOut())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          clearAuthState();
          router.push("/login");
        } else {
          setIsLoading(false);
          message.error(res.message, 2.5);
        }
      })
      .catch((error) => {
        if (
          error.message === "Invalid client id" ||
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          clearAuthState();
          router.push("/login");
        } else {
          setIsLoading(false);
          // Hiển thị thông báo lỗi nếu có
          message.error("Đã có lỗi xảy ra", 2.5);
        }
      });
  };

  return (
    <header className="bg-[#02354B] sticky top-0 z-30" style={{ paddingLeft: collapsed ? "80px" : "280px" }}>
      <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[75px]">
          <div className="flex items-center justify-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: "auto",
                height: "auto",
                color: "#fff",
                backgroundColor: "#1890ff",
                border: "none",
                padding: "10px 20px",
              }}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            >
              Menu
            </Button>
            <div className="flex-shrink-0 mx-5">
              <a href="/">
                <img className="h-36 w-auto" src={logo3} alt="" />
              </a>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
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
                                userProfile?.image_url ||
                                data?.metadata?.account?.image_url ||
                                `https://xsgames.co/randomusers/avatar.php?g=pixel`
                              }
                            />
                            <span className="ml-2 text-white">{userName}</span>
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
                                href="/admin/users/edit-user-form"
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                              >
                                <UserOutlined className="h-5 w-5 text-gray-600 mr-2" />
                                Cập nhật thông tin
                              </Disclosure.Button>
                              <Disclosure.Button
                                as="a"
                                href="/admin/users/change-password"
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
                  </div>
                  <div className="space-y-2 py-6">
                    {userState !== null ? (
                      <span
                        title="Logout"
                        icon={<LogoutOutlined />}
                        onClick={handleLogOut}
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
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
