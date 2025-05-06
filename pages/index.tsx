// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/postCard';
import { Post } from '../types/post';
import Link from 'next/link';
import { PasswordModal } from '../components/PasswordModal';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        // Firebaseのキーを保持したまま投稿一覧を設定
        const postsArray = Object.entries(data).map(([key, post]) => ({
          ...post as Post,
          firebaseKey: key // Firebaseのキーを追加
        }));

        console.log('フィルタリング後の投稿一覧:', postsArray);
        setPosts(postsArray);
      } catch (error) {
        console.error('投稿の取得に失敗しました:', error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPostId('');
  };

  const handleDelete = async (firebaseKey: string, password: string) => {
    try {
      const response = await fetch('/api/delete-post', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firebaseKey, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '投稿の削除に失敗しました');
      }

      const updatedPosts = posts.filter(post => post.firebaseKey !== firebaseKey);
      setPosts(updatedPosts);
      setIsModalOpen(false);
    } catch (error) {
      console.error('削除エラー:', error);
      alert(error instanceof Error ? error.message : '投稿の削除に失敗しました');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">でぃすこーどちゃんねる</h1>
        <div className="space-x-4">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            一覧
          </Link>
          <Link href="/post" className="text-blue-500 hover:text-blue-700">
            投稿
          </Link>
        </div>
      </div>
      <div className="mt-6">
        {posts.length === 0 ? (
          <div>まだ投稿がありません。</div>
        ) : (
          posts
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => (
              <PostCard
                key={post.firebaseKey}
                post={post}
                onDelete={() => handleDeleteClick(post.firebaseKey)}
              />
            ))
        )}
      </div>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDelete={handleDelete}
        firebaseKey={selectedPostId}
      />
    </div>
  );
}
