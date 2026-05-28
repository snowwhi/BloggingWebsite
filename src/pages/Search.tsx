import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import databaseService from "../lib/databaseService";
import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";
import { Query } from "appwrite";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setSearchParams({ q });
    setLoading(true);
    setSearched(true);
    try {
      const result = await databaseService.getPosts([
        Query.equal("status", "active"),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ]);
      if (result) {
        const lower = q.toLowerCase();
        const filtered = result.documents.filter(
          (p: any) =>
            p.Title?.toLowerCase().includes(lower) ||
            p.Content?.replace(/<[^>]*>/g, "").toLowerCase().includes(lower)
        );
        setPosts(filtered);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, []);

  const clearSearch = () => {
    setQuery("");
    setPosts([]);
    setSearched(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-3xl font-bold text-foreground mb-8"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Search Stories
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="relative mb-10"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or content…"
              className="w-full rounded-xl border border-input bg-card pl-12 pr-28 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          {loading && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && searched && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border border-dashed border-border rounded-2xl bg-card"
            >
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl text-muted-foreground mb-2">
                No results for "{searchParams.get("q")}"
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Try a different keyword or check the spelling.
              </p>
            </motion.div>
          )}

          {!loading && posts.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-muted-foreground mb-6">
                {posts.length} result{posts.length !== 1 ? "s" : ""} for "
                {searchParams.get("q")}"
              </p>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: any, i: number) => (
                  <BlogCard
                    key={post.$id}
                    id={post.$id}
                    title={post.Title}
                    content={post.Content}
                    featuredImage={
                      post.featuredimage
                        ? String(databaseService.getFileView(post.featuredimage))
                        : undefined
                    }
                    userId={post.userId}
                    createdAt={post.$createdAt}
                    index={i}
                    status={post.status}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {!searched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-muted-foreground"
            >
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Start typing to search through all stories.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;
