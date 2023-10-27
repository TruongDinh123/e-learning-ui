"use client";
import { Avatar, Card, Skeleton } from "antd";
import { GrView } from "react-icons/gr";
import { AiOutlineHeart } from "react-icons/ai";
const { Meta } = Card;

export default function CustomCard(props) {
  return (
    <Card
      style={{
        width: 300,
        marginTop: 16,
      }}
      actions={[
        <AiOutlineHeart className="fs-4" key="wishlist" />,
        <GrView key="view" />,
      ]}
    >
      <Skeleton loading={false} avatar active>
        <Meta
          avatar={
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
          }
          title="Card title"
          description="This is the description"
        />
      </Skeleton>
    </Card>
  );
}
