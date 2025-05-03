// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/postCard';
import { Post } from '../types/post';
import Link from 'next/link';
import { PasswordModal } from '../components/PasswordModal';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('投稿の取得に失敗しました');
        }
        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('無効なデータ形式です');
        }
        const postsArray = Object.values(data).filter((post): post is Post => {
          return (
            typeof post === 'object' &&
            post !== null &&
            'id' in post &&
            'discordId' in post &&
            'gender' in post
          );
        });
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
    setSelectedPostId(null);
  };

  const handleDelete = async (postId: string, password: string) => {
    try {
      console.log('削除リクエスト:', { postId, password });
      
      const response = await fetch('/api/delete-post', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, password }),
      });

      const data = await response.json();
      console.log('APIレスポンス:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || '投稿の削除に失敗しました');
      }

      // 削除成功後、投稿一覧を更新
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      setIsModalOpen(false);
    } catch (error) {
      console.error('削除エラー:', error);
      alert(error instanceof Error ? error.message : '投稿の削除に失敗しました');
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
              onDelete={() => handleDeleteClick(post.id)}
            />
          ))
        )}
      </div>
      <PasswordModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleDelete}
        postId={selectedPostId || ''}
      />
    </div>
  );
}
