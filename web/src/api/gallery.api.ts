import { http } from "./http";

/* ========= DTO ========= */

export interface GalleryItemDto {
  id: string;
  title?: string;
  artist?: string;
  price: number;
  imageUrl?: string;
}

export interface CreateGalleryItemRequestDto {
  title: string;
  artist: string;
  price: number;
  imageUrl?: string;
}

export interface UpdateGalleryItemRequestDto {
  title: string;
  artist: string;
  price: number;
  imageUrl?: string;
}

/* ========= ITEMS ========= */

export function getGallery() {
  return http.get<GalleryItemDto[]>("/api/gallery");
}

export function getGalleryItem(id: string) {
  return http.get<GalleryItemDto>(`/api/gallery/${id}`);
}

export function createGalleryItem(
  payload: CreateGalleryItemRequestDto
) {
  return http.post<GalleryItemDto>(
    "/api/gallery",
    payload
  );
}

/**
 * ✅ BACKEND: PUT /api/gallery/{id}
 */
export function updateGalleryItem(
  id: string,
  payload: UpdateGalleryItemRequestDto
) {
  return http.put<GalleryItemDto>(
    `/api/gallery/${id}`,
    payload
  );
}

/**
 * ✅ BACKEND: DELETE /api/gallery/{id}
 */
export function deleteGalleryItem(id: string) {
  return http.delete<void>(
    `/api/gallery/${id}`
  );
}
