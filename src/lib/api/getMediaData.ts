import { Media as MediaType } from "@/payload-types"

/**
 * Fetches media data by ID from the API
 * @param id - ID of the media to fetch
 * @returns Promise with media data
 * @throws Error if URL is not set or request fails
 */

const API_PARAMS = {
  DEPTH: 1,
  DRAFT: false,
  LOCALE: 'undefined'
} as const

export async function getMediaData(id: number): Promise<MediaType> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not set in .env file");
  }

  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${id}?depth=${API_PARAMS.DEPTH}&draft=${API_PARAMS.DRAFT}&locale=${API_PARAMS.LOCALE}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Data fetch failed with status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    throw new Error(
      `Error fetching media: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
