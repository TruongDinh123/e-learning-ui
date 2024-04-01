"use client";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Button, Result } from "antd";

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);
export default function InfoCourse() {
  return (
    <main className="bg-white text-black overflow-auto">
      {/* <ReactQuill
        theme="snow"
        placeholder="Thêm mô tả"
        className="bg-white"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],

            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],

            [
              {
                size: ["small", false, "large", "huge"],
              },
            ],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],

            ["clean"],
          ],
        }}
      /> */}
      <Result
        status="403"
        title="403"
        subTitle="Đang cập nhật..."
        extra={<Button className="custom-button" type="primary">Quay về trang chủ</Button>}
      />
    </main>
  );
}
