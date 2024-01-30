// import { Footer } from "antd/es/layout/layout";
// import React from "react";
// import { useMediaQuery } from "react-responsive";

// function AdminFooter(props) {
//   const { sidebarCollapsed } = props;
//   const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

//   return (
//     !isMobile &&
//     !sidebarCollapsed && (
//       <div className="bottom-0">
//         <footer
//           style={{
//             backgroundColor: "#111111",
//             bottom: 0,
//             width: "100%",
//             height: "auto",
//           }}
//         >
//           <div className="max-w-[105rem] mx-auto pt-10 sm:px-6 lg:px-8 text-white">
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
//               <div>
//                 <h5 className="font-bold mb-4 text-[#C89F65]">VỀ CHÚNG TÔI</h5>
//                 <ul className="space-y-2">
//                   <li className="">
//                     <a className="" href="#">
//                       Điều khoản
//                     </a>
//                   </li>
//                   <li>
//                     <a href="#">Chính sách bảo mật</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h5 className="font-bold mb-4 text-[#C89F65]">CỘNG ĐỒNG</h5>
//                 <ul className="space-y-2">
//                   <li>
//                     <a href="#">Chăm sóc khách hàng</a>
//                   </li>
//                   <li>
//                     <a href="#">Blog</a>
//                   </li>
//                   <li>
//                     <a href="#">Danh mục</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h5 className="font-bold mb-4 text-[#C89F65]">ĐỊA CHỈ</h5>
//                 <ul className="space-y-2">
//                   <li>
//                     <span>95IDEAL TECHNOLOGY SOLUTIONS</span>
//                   </li>
//                   <li>
//                     <span>MST: 12345678</span>
//                   </li>
//                   <li>
//                     <span>Địa chỉ: Hồ Chí Minh</span>
//                   </li>
//                   <li>
//                     <span>Email: customerservice.95lab@gmail.com</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-4">
//               <div className="flex items-center space-x-4 mb-4 md:mb-0">
//                 <span>Đã đăng ký Bộ Công Thương</span>
//               </div>
//               <div className="flex space-x-4">
//                 <FacebookIcon className="h-6 w-6" />
//                 <YoutubeIcon className="h-6 w-6" />
//               </div>
//             </div>
//             <p className="text-center">© 2024 95IDEAL TECHNOLOGY SOLUTIONS</p>
//           </div>
//         </footer>
//       </div>
//     )
//   );

//   function FacebookIcon(props) {
//     return (
//       <svg
//         {...props}
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//       </svg>
//     );
//   }

//   function YoutubeIcon(props) {
//     return (
//       <svg
//         {...props}
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
//         <path d="m10 15 5-3-5-3z" />
//       </svg>
//     );
//   }
// }

// export default AdminFooter;

import { Footer } from "antd/es/layout/layout";
import React from "react";
import { useMediaQuery } from "react-responsive";

function AdminFooter() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    !isMobile && (
      <Footer
        style={{
          backgroundColor: "#111111",
          color: "#C89F65",
          textAlign: "center",
          position: "fixed",
          bottom: "0",
          width: "100%",
          justifyContent: "center",
        }}
      >
        95Elearning {new Date().getFullYear()} created by 95IDEAL
      </Footer>
    )
  );
}

export default AdminFooter;
