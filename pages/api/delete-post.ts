import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, remove, get } from 'firebase/database';
import { Post } from '../../types/post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const { firebaseKey, password } = req.body;
  if (!firebaseKey || !password) {
    return res.status(400).json({ error: '投稿IDとパスワードは必須です' });
  }

  try {
    // 投稿の存在確認
    const postRef = ref(database, `posts/${firebaseKey}`);
    const postSnapshot = await get(postRef);
    const post = postSnapshot.val();

    if (!post) {
      console.error('投稿が見つかりませんでした');
      return res.status(404).json({ error: '投稿が見つかりません' });
    }

    console.log('見つかった投稿:', post);

    if (post.password !== password) {
      console.error('パスワードが間違っています');
      return res.status(403).json({ error: 'パスワードが間違っています' });
    }

    // 投稿を削除
      await remove(postRef);
    return res.status(200).json({ message: '投稿を削除しました' });
    } catch (error) {
    console.error('削除エラー:', error);
    return res.status(500).json({ error: '投稿の削除に失敗しました' });
  }
} 