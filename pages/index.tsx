// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/postCard';
import { Post } from '../types/post';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(Object.values(data));
      } catch (error) {
        console.error('投稿の取得に失敗しました:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch('/api/delete-post', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error('投稿の削除に失敗しました');
      }

      // 投稿一覧を更新
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">でぃすこーどちゃんねる</h1>
      <Link href="/post" className="bg-green-500 text-white px-4 py-2 rounded mb-6 inline-block">
        投稿する
      </Link>
      <div className="mt-6">
        {posts.length === 0 ? (
          <div>まだ投稿がありません。</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={() => handleDelete(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
