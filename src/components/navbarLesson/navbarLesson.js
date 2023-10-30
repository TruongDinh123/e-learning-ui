'use client'

import { Menu } from 'antd';
import { useState } from 'react';

const lessons = [
  { id: 1, title: 'Bài học 1', videoId: 1 },
  { id: 2, title: 'Bài học 2', videoId: 2 },
  { id: 3, title: 'Bài học 3', videoId: 3 },
  // Thêm các bài học khác vào đây
];

const NavbarLeson = ({ setSelectedVideoId }) => {
  const handleLessonClick = (lesson) => {
    setSelectedVideoId(lesson.videoId);
  };

  return (
    <Menu mode="vertical">
      {lessons.map((lesson) => (
        <Menu.Item key={lesson.id} onClick={() => handleLessonClick(lesson)}>
          {lesson.title}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default NavbarLeson;