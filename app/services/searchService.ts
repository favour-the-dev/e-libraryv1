import { searchBookByIsbnResponse } from "@/types/types";

export const searchBookByISBN = async (
  isbn: number
): Promise<searchBookByIsbnResponse | null> => {
  try {
    const res = await fetch(`/api/search?isbn=${isbn}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch book data");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
