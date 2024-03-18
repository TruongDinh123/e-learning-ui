'use client'
import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);
if (typeof window !== "undefined") {
    window.katex = katex;
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorHtml: props.value || "",
      theme: "snow",
      placeholder: "Write something...",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Kiểm tra nếu giá trị prop 'value' thay đổi và cập nhật state
    if (prevProps.value !== this.props.value) {
      this.setState({ editorHtml: this.props.value || "" });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Cập nhật state nếu props 'value' thay đổi
    if (nextProps.value !== prevState.editorHtml) {
      return { editorHtml: nextProps.value };
    }
    return null;
  }

  handleChange(html) {
    // console.log(html);
    this.setState({ editorHtml: html });
    if (this.props.onChange) {
      this.props.onChange(html);
    }
  }

  handleThemeChange(newTheme) {
    if (newTheme === "core") newTheme = null;
    this.setState({ theme: newTheme });
  }

  render() {
    return (
      <div>
        <ReactQuill
          theme={this.state.theme}
          onChange={this.handleChange}
          value={this.state.editorHtml}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={".app"}
          placeholder={this.state.placeholder}
          className="bg-white"
        />
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  /*toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video', 'formula'],
    ['clean']
  ],*/
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    ["formula"], // math formula

    [
      {
        size: ["small", false, "large", "huge"],
      },
    ], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }], // text align

    ["clean"], // remove formatting button
  ],
  // clipboard: {
  //   // toggle to add extra line breaks when pasting HTML:
  //   matchVisual: false,
  // },
};

export default Editor;
