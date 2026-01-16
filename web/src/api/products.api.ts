import { http } from './http';

export interface ProductDto {
  id: string;
  name?: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface CreateProductRequestDto {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export function getProducts() {
  return http.get<ProductDto[]>('/api/products');
}

export function getProduct(id: string) {
  return http.get<ProductDto>(`/api/products/${id}`);
}

export function createProduct(
  dto: CreateProductRequestDto
) {
  return http.post<ProductDto>('/api/products', dto);
}

export function updateProduct(
  id: string,
  dto: CreateProductRequestDto
) {
  return http.put<void>(`/api/products/${id}`, dto);
}

export function deleteProduct(id: string) {
  return http.delete<void>(`/api/products/${id}`);
}