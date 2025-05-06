// components/PostCard.tsx
import { Post } from '../types/post';
import React from 'react';

interface PostCardProps {
  post: Post & { firebaseKey: string };
  onDelete: (firebaseKey: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const bgColor = post.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100';

  return (
    <div className={`p-4 rounded-md mb-4 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div>Discord ID: {post.discordId}</div>
          {post.location && <div>居住地: {post.location}</div>}
          {post.comment && <div>コメント: {post.comment}</div>}
        </div>
        <button
          onClick={() => onDelete(post.firebaseKey)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  );
}
