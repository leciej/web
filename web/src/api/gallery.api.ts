import { http } from "./http";

/* ========= DTO ========= */

export interface GalleryItemDto {
  id: string;
  title?: string;
  artist?: string;
  price: number;
  imageUrl?: string;
}

export interface GalleryRatingSummaryDto {
  average: number;
  votes: number;
  myRating?: number | null;
}

/* ========= CREATE / UPDATE DTO ========= */

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

export function updateGalleryItem(
  id: string,
  payload: UpdateGalleryItemRequestDto
) {
  return http.patch<GalleryItemDto>(   // ← TU JEST FIX
    `/api/gallery/${id}`,
    payload
  );
}

/* ========= RATINGS ========= */

export function getGalleryRating(
  id: string,
  userId?: number
) {
  return http.get<GalleryRatingSummaryDto>(
    `/api/gallery/${id}/ratings`,
    userId ? { userId } : undefined
  );
}

export function rateGalleryItem(
  id: string,
  userId: number,
  value: number
) {
  return http.post<void>(
    `/api/gallery/${id}/ratings`,
    { userId, value }
  );
}
