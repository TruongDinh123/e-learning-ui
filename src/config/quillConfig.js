'use client'
import 'katex/dist/katex.min.css';
import { Quill } from 'react-quill';
import katex from 'katex';

const Inline = Quill.import('blots/inline');

class FormulaBlot extends Inline {
  static create(value) {
    let node = super.create();
    katex.render(value, node, {
      throwOnError: false,
      errorColor: '#ff0000',
    });
    return node;
  }

  static value(node) {
    return node.innerText;
  }
}

FormulaBlot.blotName = 'formula';
FormulaBlot.tagName = 'SPAN';
FormulaBlot.className = 'ql-formula';

Quill.register('formats/formula', FormulaBlot);

// Cấu hình modules cho ReactQuill
export const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    ['formula'], // math formula
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }], // text align
    ["clean"], // remove formatting button
  ],
};