export type Gender = 'male' | 'female';

export interface Post {
  id: string;
  discordId: string;
  comment: string;
  location: string;
  gender: Gender;
}
