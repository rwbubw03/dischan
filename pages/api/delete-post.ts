import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, remove, get } from 'firebase/database';
import { Post } from '../../types/post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const { postId, password } = req.body;
  if (!postId || !password) {
    return res.status(400).json({ error: '投稿IDとパスワードは必須です' });
  }

  try {
    // 投稿の存在確認
    const postsRef = ref(database, 'posts');
    const postsSnapshot = await get(postsRef);
    const posts = postsSnapshot.val() || {};

    // 投稿を検索
    let targetPost: Post | null = null;
    let targetPostKey: string | null = null;

    for (const [key, post] of Object.entries(posts)) {
      if (post && typeof post === 'object' && 'id' in post && post.id === postId) {
        targetPost = post as Post;
        targetPostKey = key;
        break;
      }
    }

    if (!targetPost) {
      return res.status(404).json({ error: '投稿が見つかりません' });
    }

    if (targetPost.password !== password) {
      return res.status(403).json({ error: 'パスワードが間違っています' });
    }

    // 投稿を削除
    await remove(ref(database, `posts/${targetPostKey}`));
    return res.status(200).json({ message: '投稿を削除しました' });
  } catch (error) {
    console.error('削除エラー:', error);
    return res.status(500).json({ error: '投稿の削除に失敗しました' });
  }
} 