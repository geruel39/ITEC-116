export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: Date;
  author_username?: string;
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: Post | null;
}

export interface PostsListResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
}