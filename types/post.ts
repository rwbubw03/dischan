export type Gender = 'male' | 'female';

export interface Post {
  id: string;
  discordId: string;
  comment: string;
  location: string;
  gender: Gender;
  timestamp: number; // 投稿日時（Unixタイムスタンプ）
  password: string; // 削除用パスワード
}
