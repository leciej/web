import { http } from './http';

export interface CommentDto {
  id: string;
  author?: string;
  text?: string;
  createdAt: string;
}

export function getProductComments(productId: string) {
  return http.get<CommentDto[]>(
    `/api/products/${productId}/comments`
  );
}

export function addComment(
  productId: string,
  userId: number,
  text: string
) {
  return http.post<CommentDto>(
    `/api/products/${productId}/comments`,
    { userId, text }
  );
}

export const addProductComment = addComment;