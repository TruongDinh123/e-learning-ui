import dynamic from "next/dynamic";

const ClientSideControls = dynamic(
  () => {
    return import("../components/agoraclientside");
  },
  { ssr: false }
);