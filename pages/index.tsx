// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/postCard';
import { Post } from '../types/post';
import Link from 'next/link';
import { database } from '../lib/firebase';
import { ref, onValue, remove } from 'firebase/database';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    const postsRef = ref(database, 'posts');
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postsArray = Object.entries(data).map(([key, value]) => ({
          ...value as Post,
          id: key
        }));
        const sortedPosts = postsArray.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(sortedPosts);
      } else {
        setPosts([]);
      }
    });
  }, []);

  const handleDelete = async (post: Post) => {
    setPostToDelete(post);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    if (deletePassword === postToDelete.password) {
      try {
        const postRef = ref(database, `posts/${postToDelete.id}`);
        await remove(postRef);
        setPostToDelete(null);
        setDeletePassword('');
        alert('投稿を削除しました');
      } catch (error) {
        console.error('削除に失敗しました:', error);
        alert('削除に失敗しました');
      }
    } else {
      alert('パスワードが間違っています');
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
              onDelete={() => handleDelete(post)}
            />
          ))
        )}
      </div>

      {/* 削除確認モーダル */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="削除用パスワード"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setPostToDelete(null);
                  setDeletePassword('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
