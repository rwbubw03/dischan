// components/PostCard.tsx
import { Post } from '../types/post';
import React from 'react';

export const PostCard = ({ post }: { post: Post }) => {
  const bgColor = post.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100';

  return (
    <div className={`p-4 rounded-md mb-4 ${bgColor}`}>
      <div className="font-bold">{post.gender === 'male' ? '男' : '女'}</div>
      <div>Discord ID: {post.discordId}</div>
      <div>居住地: {post.location}</div>
      <div>コメント: {post.comment}</div>
    </div>
  );
};
