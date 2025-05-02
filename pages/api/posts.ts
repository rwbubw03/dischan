import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import { Post } from '../../types/post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const postsRef = ref(database, 'posts');
      const snapshot = await get(postsRef);
      const posts = snapshot.val() || {};
      
      // データの型チェック
      const validPosts: { [key: string]: Post } = {};
      Object.entries(posts).forEach(([key, value]) => {
        if (
          value &&
          typeof value === 'object' &&
          'id' in value &&
          'discordId' in value &&
          'gender' in value
        ) {
          validPosts[key] = value as Post;
        }
      });

      res.status(200).json(validPosts);
    } catch (error) {
      console.error('Firebaseエラー:', error);
      res.status(500).json({ error: '投稿の取得に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 