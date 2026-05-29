import { useState, useEffect } from "react";

const STORAGE_KEY = "inkwell_bookmarks";

export interface BookmarkedPost {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  userId?: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (post: BookmarkedPost) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === post.id)) return prev;
      return [post, ...prev];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const isBookmarked = (id: string) => bookmarks.some((b) => b.id === id);

  const toggleBookmark = (post: BookmarkedPost) => {
    if (isBookmarked(post.id)) {
      removeBookmark(post.id);
    } else {
      addBookmark(post);
    }
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark };
}
