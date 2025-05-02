// pages/post.tsx
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Post, Gender } from '../types/post';
import { ref, push } from 'firebase/database';
import { database } from '../lib/firebase';

export default function PostPage() {
  // ルーターの初期化（ページ遷移に使用）
  const router = useRouter();

  // フォームの状態管理
  const [discordId, setDiscordId] = useState('');      // Discord IDの入力値
  const [comment, setComment] = useState('');          // コメントの入力値
  const [location, setLocation] = useState('');        // 居住地の入力値
  const [gender, setGender] = useState<Gender>('male'); // 性別の選択値（デフォルトは男性）
  const [password, setPassword] = useState(''); // パスワードの状態を追加

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discordId,
          comment,
          location,
          gender,
          password,
          timestamp: Date.now()
        }),
      });

      if (!response.ok) {
        throw new Error('投稿の作成に失敗しました');
      }

      router.push('/');
    } catch (error) {
      console.error('エラー:', error);
      alert('投稿の作成に失敗しました');
    }
  };

  // フォームのレンダリング
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">新規投稿</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Discord ID入力フィールド */}
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

        {/* コメント入力フィールド */}
        <div>
          <label>一言コメント</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* 居住地入力フィールド */}
        <div>
          <label>居住地</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* 性別選択フィールド */}
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

        {/* パスワード入力欄を追加 */}
        <div>
          <label>削除用パスワード（必須）</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
            placeholder="投稿削除時に必要なパスワード"
          />
        </div>

        {/* 送信ボタン */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          投稿する
        </button>
      </form>
    </div>
  );
}
