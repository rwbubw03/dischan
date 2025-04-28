// pages/post.tsx
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Post, Gender } from '../types/post';

export default function PostPage() {
  const router = useRouter();
  const [discordId, setDiscordId] = useState('');
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPost: Post = {
      id: crypto.randomUUID(),
      discordId,
      comment,
      location,
      gender,
    };

    // 一旦localStorageに保存
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    router.push('/');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規投稿</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Discord ID（必須）</label>
          <input
            type="text"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label>一言コメント</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>居住地</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>性別</label>
          <div className="flex gap-4 mt-2">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              男
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              女
            </label>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          投稿する
        </button>
      </form>
    </div>
  );
}
