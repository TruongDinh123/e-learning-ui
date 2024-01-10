import { Col, Row } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "react-bootstrap";

export default function CustomFooter() {
  const pathname = usePathname();

  if (pathname.includes("/courses/lessons/")) {
    return null;
  }
  return (
    <footer className="bg-[#111111] text-white bottom-0">
      <div className="max-w-[105rem] mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-bold mb-4 text-[#C89F65]">VỀ CHÚNG TÔI</h5>
            <ul className="space-y-2">
              <li>
                <a className="hover:underline" href="#">
                  Điều khoản
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-[#C89F65]">CỘNG ĐỒNG</h5>
            <ul className="space-y-2">
              <li>
                <a className="hover:underline" href="#">
                  Chăm sóc khách hàng
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  Blog
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#">
                  Danh mục
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-[#C89F65]">ĐỊA CHỈ</h5>
            <ul className="space-y-2">
              <li>
                <span className="hover:underline">
                  Công ty TNHH Công Nghệ Giáo Dục Topica Việt Nam
                </span>
              </li>
              <li>
                <span className="hover:underline">
                  MST: 0109475876
                </span>
              </li>
              <li>
                <span className="hover:underline">
                  Địa chỉ: Tầng 6, Tòa nhà Kim Khí Thăng Long, Số 1 Lương Yên,
                  Phường Bạch Đằng, Quận Hai Bà Trưng, Thành phố Hà Nội, Việt
                  Nam
                </span>
              </li>
              <li>
                <span className="hover:underline">
                  Email: trogiup@edumall.vn
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 text-[#C89F65]">TẢI APP EDUMALL:</h5>
            <div className="flex space-x-2">
              <a className="block" href="#">
                <img
                  alt="App Store"
                  height="40"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "120/40",
                    objectFit: "cover",
                  }}
                  width="120"
                />
              </a>
              <a className="block" href="#">
                <img
                  alt="Google Play"
                  height="40"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "120/40",
                    objectFit: "cover",
                  }}
                  width="120"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 border-t border-gray-700 pt-4">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img
              alt="Registered"
              height="40"
              src="/placeholder.svg"
              style={{
                aspectRatio: "40/40",
                objectFit: "cover",
              }}
              width="40"
            />
            <span>Đã đăng ký Bộ Công Thương</span>
          </div>
          <div className="flex space-x-4">
            <FacebookIcon className="h-6 w-6" />
            <YoutubeIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-center mt-8">
          © 2022 Công ty TNHH Công Nghệ Giáo Dục Topica Việt Nam
        </p>
      </div>
    </footer>
  );
}

function FacebookIcon(props) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon(props) {
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
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}
