import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, remove, get } from 'firebase/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const { postId, password } = req.body;
      console.log('削除リクエスト受信:', { postId, password });

      if (!postId || !password) {
        console.error('必須フィールド不足:', { postId, password });
        return res.status(400).json({ error: '投稿IDとパスワードは必須です' });
      }

      const postRef = ref(database, `posts/${postId}`);
      console.log('Firebase参照:', postRef.toString());

      const postSnapshot = await get(postRef);
      const post = postSnapshot.val();
      console.log('投稿データ:', post);

      if (!post) {
        console.error('投稿が見つかりません:', postId);
        return res.status(404).json({ error: '投稿が見つかりません' });
      }

      if (post.password !== password) {
        console.error('パスワード不一致:', { 入力: password, 保存: post.password });
        return res.status(403).json({ error: 'パスワードが間違っています' });
      }

      await remove(postRef);
      console.log('投稿削除成功:', postId);
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