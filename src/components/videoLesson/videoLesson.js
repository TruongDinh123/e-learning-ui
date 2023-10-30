import { Card, List } from "antd";
import { useEffect, useState } from "react";

const videos = [
  { id: 1, title: 'Video 1', url: 'https://example.com/video1' },
  { id: 2, title: 'Video 2', url: 'https://example.com/video2' },
  { id: 3, title: 'Video 3', url: 'https://example.com/video3' },
  // Thêm các video khác vào đây
];

export default function VideoContent({ selectedLesson }) {
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    if (selectedLesson) {
      setSelectedVideoId(selectedLesson.videoId);
    }
  }, [selectedLesson]);


  const filteredVideos = videos.filter((video) => video.id === selectedVideoId);

  return (
    <div>
      <Card title="Danh sách video">
        <List
          dataSource={videos}
          renderItem={(video) => (
            <List.Item
              onClick={() => handleVideoClick(video)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta title={video.title} />
            </List.Item>
          )}
        />
      </Card>

      {filteredVideos.length > 0 && (
        <div>
          <h2>{filteredVideos[0].title}</h2>
          <video src={filteredVideos[0].url} controls />
        </div>
      )}
    </div>
  );
};