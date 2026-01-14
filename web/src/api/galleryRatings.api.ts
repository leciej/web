import { http } from "./http";

/* ================= TYPES ================= */

export type GalleryRatingSummaryDto = {
  average: number;
  votes: number;
  myRating: number | null;
};

/* ================= helpers ================= */

const getCurrentUserId = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    return typeof user.id === "number" ? user.id : null;
  } catch {
    return null;
  }
};

/* ================= API ================= */

export const GalleryRatingsApi = {
  getByGalleryItemId: async (
    galleryItemId: string
  ): Promise<GalleryRatingSummaryDto> => {
    return await http.get<GalleryRatingSummaryDto>(
      `/gallery/${galleryItemId}/ratings`
    );
  },

  create: async (
    galleryItemId: string,
    value: number
  ): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("User not logged in");

    await http.post(
      `/gallery/${galleryItemId}/ratings`,
      {
        userId,
        value,
      }
    );
  },
};
