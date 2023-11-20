"use client";
import { Button } from "antd";

export default function CustomButton(props) {
  const { title, className, type, shape, onClick , style, disabled} = props;
  return (
    <Button type={type} className={className} onClick={onClick} shape={shape} style={style} disabled={disabled}>
      {title}
    </Button>
  );
}
