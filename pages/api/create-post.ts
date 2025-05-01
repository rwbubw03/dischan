import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, push } from 'firebase/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { discordId, comment, location, gender } = req.body;
      const postsRef = ref(database, 'posts');
      const newPostRef = await push(postsRef, {
        discordId,
        comment,
        location,
        gender,
        createdAt: new Date().toISOString()
      });
      res.status(201).json({ id: newPostRef.key });
    } catch (error) {
      res.status(500).json({ error: '投稿の作成に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 