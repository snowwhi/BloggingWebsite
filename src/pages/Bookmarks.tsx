import { motion } from "framer-motion";
import { Bookmark, BookmarkX, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { useBookmarks } from "../hooks/useBookmarks";

const BookmarksPage = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="h-7 w-7 text-primary fill-primary" />
            <h1
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Reading List
            </h1>
          </div>
          <p className="text-muted-foreground mb-8">Stories you have saved to read later.</p>

          {bookmarks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border border-dashed border-border rounded-2xl bg-card"
            >
              <Bookmark className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl text-muted-foreground mb-2">
                Your reading list is empty
              </h3>
              <p className="text-sm text-muted-foreground/70 mb-6">
                Hit the bookmark icon on any story to save it here for later.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Browse Stories
              </Link>
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {bookmarks.length} saved stor{bookmarks.length !== 1 ? "ies" : "y"}
              </p>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((post, i) => (
                  <div key={post.id} className="relative group/card">
                    <BlogCard
                      id={post.id}
                      title={post.title}
                      content={post.content}
                      userId={post.userId}
                      createdAt={post.createdAt}
                      index={i}
                    />
                    <button
                      onClick={() => removeBookmark(post.id)}
                      title="Remove from reading list"
                      className="absolute top-3 right-3 z-10 rounded-full bg-background/90 backdrop-blur p-1.5 text-destructive opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-destructive/10 shadow-sm"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookmarksPage;
