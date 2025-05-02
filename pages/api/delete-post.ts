import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, remove } from 'firebase/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { postId, password } = req.body;
      const postRef = ref(database, `posts/${postId}`);
      
      // パスワードの検証（必要に応じて実装）
      // const post = await get(postRef);
      // if (post.val().password !== password) {
      //   return res.status(403).json({ error: 'パスワードが間違っています' });
      // }

      await remove(postRef);
      res.status(200).json({ message: '投稿を削除しました' });
    } catch (error) {
      res.status(500).json({ error: '投稿の削除に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 