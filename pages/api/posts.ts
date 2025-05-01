import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const postsRef = ref(database, 'posts');
      const snapshot = await get(postsRef);
      const posts = snapshot.val() || {};
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: '投稿の取得に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 