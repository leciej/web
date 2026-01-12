import { http } from "./http";

/* ========= DTO ========= */

export interface ProductDto {
  id: string;
  name?: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface CreateProductRequestDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateProductRequestDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

/* ========= ITEMS ========= */

export function getProducts() {
  return http.get<ProductDto[]>("/api/products");
}

export function getProduct(id: string) {
  return http.get<ProductDto>(`/api/products/${id}`);
}

export function createProduct(
  payload: CreateProductRequestDto
) {
  return http.post<ProductDto>(
    "/api/products",
    payload
  );
}

/**
 * ⚠️ BACKEND DLA PRODUKTÓW:
 * [HttpPatch("{id}")]
 */
export function updateProduct(
  id: string,
  payload: UpdateProductRequestDto
) {
  return http.patch<ProductDto>(
    `/api/products/${id}`,
    payload
  );
}

export function deleteProduct(id: string) {
  return http.delete<void>(`/api/products/${id}`);
}
