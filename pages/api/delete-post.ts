import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, remove, get } from 'firebase/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { postId, password } = req.body;

      if (!postId || !password) {
        return res.status(400).json({ error: '投稿IDとパスワードは必須です' });
      }

      const postRef = ref(database, `posts/${postId}`);
      const postSnapshot = await get(postRef);
      const post = postSnapshot.val();

      if (!post) {
        return res.status(404).json({ error: '投稿が見つかりません' });
      }

      if (post.password !== password) {
        return res.status(403).json({ error: 'パスワードが間違っています' });
      }

      await remove(postRef);
      res.status(200).json({ message: '投稿を削除しました' });
    } catch (error) {
      console.error('Firebaseエラー:', error);
      res.status(500).json({ error: '投稿の削除に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 