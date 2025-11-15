export interface PostData {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author_username: string;
  created_at: Date;
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: PostData;
}

export interface PostsListResponse {
  success: boolean;
  message: string;
  data: {
    posts: PostData[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
}