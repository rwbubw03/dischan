import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, push, set } from 'firebase/database';
import { Post } from '../../types/post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { discordId, comment, location, gender, password, timestamp } = req.body;

      // 必須フィールドのチェック
      if (!discordId || !gender || !password) {
        return res.status(400).json({ error: '必須フィールドが不足しています' });
      }

      const postsRef = ref(database, 'posts');
      const newPostRef = await push(postsRef);
      const postId = newPostRef.key;

      if (!postId) {
        throw new Error('投稿IDの生成に失敗しました');
      }

      const postData = {
        id: postId,
        discordId,
        comment: comment || '',
        location: location || '',
        gender,
        password,
        timestamp: timestamp || Date.now()
      };

      await set(newPostRef, postData);
      res.status(201).json({ id: postId });
    } catch (error) {
      console.error('Firebaseエラー:', error);
      res.status(500).json({ error: '投稿の作成に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 