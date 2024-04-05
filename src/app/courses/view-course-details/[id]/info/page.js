import { Spin } from "antd";
import { useSelector } from "react-redux";

export default function InfoCourse() {
  const { metadata, isLoading } = useSelector((state) => ({
    metadata: state?.course?.getACourse?.metadata,
    isLoading: state?.course?.isLoading,
  }));

  return (
    <header
      className="flex items-center space-x-4 pt-20 pb-3 lg:pt-0 lg:mt-4"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <img
            src={metadata?.image_url || logodefault}
            className="h-16 w-16 lg:h-24 lg:w-24 object-cover"
            style={{
              aspectRatio: "1 / 1",
            }}
          />
          <h1
            className="text-2xl lg:text-4xl font-bold text-center"
            style={{
              color: "#002c6a",
            }}
          >
            {metadata?.nameCenter || metadata?.name}
          </h1>
        </>
      )}
    </header>
  );
}
