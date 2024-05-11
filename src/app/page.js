"use client";

import React from "react";
import "pure-react-carousel/dist/react-carousel.es.css";
import "react-quill/dist/quill.snow.css";
import ExempleOnline from "@/app/user/exem-online/[id]/page";

export default function Home1() {
  const paramForExam = {
    id: "6634fc03bf25515f1e563504"
  }

  return (
      <div>
        <ExempleOnline params={paramForExam} />
      </div>
  );
}
