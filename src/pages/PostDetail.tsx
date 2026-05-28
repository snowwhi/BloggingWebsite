import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import parse from "html-react-parser";
import { Query } from "appwrite";
import databaseService from "../lib/databaseService";
import { PostDetailSkeleton } from "../components/BlogSkeleton";
import BlogCard from "../components/BlogCard";
import { ArrowLeft, Clock, Share2, Pencil, Trash2, ImageIcon, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useBookmarks } from "../hooks/useBookmarks";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const isOwner =
    !!user &&
    !!post &&
    Array.isArray(post.$permissions) &&
    post.$permissions.some(
      (permission: string) => permission === `update("user:${user.$id}")`
    );

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await databaseService.getPost(id);
        setPost(result);

        const recentResult = await databaseService.getPosts([
          Query.equal("status", "active"),
          Query.orderDesc("$createdAt"),
          Query.limit(4),
        ]);

        if (recentResult) {
          const filtered = recentResult.documents
            .filter((p) => p.$id !== id)
            .slice(0, 3);
          setRecentPosts(filtered);
        }
      } catch {
        toast.error("Failed to load story");
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
    window.scrollTo(0, 0);
  }, [id]);

  const getReadingTime = (content: string) => {
    if (!content) return 1;
    const wordCount = content.replace(/<[^>]*>?/gm, "").split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied to clipboard! 🔗", { autoClose: 2000 });
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    setDeleting(true);
    try {
      await databaseService.deletePost(post.$id);
      if (post.featuredimage) await databaseService.deleteFile(post.featuredimage);
      toast.success("Story deleted!");
      navigate("/");
    } catch {
      toast.error("Failed to delete story");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PostDetailSkeleton />;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1
            className="font-display text-3xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Story Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            This story may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = post.featuredimage
    ? String(databaseService.getFileView(post.featuredimage))
    : null;

  const bookmarked = isBookmarked(post.$id);
  const bookmarkPost = () =>
    toggleBookmark({
      id: post.$id,
      title: post.Title,
      content: post.Content,
      featuredImage: imageUrl ?? undefined,
      createdAt: post.$createdAt,
      userId: post.userId,
    });

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-start justify-between gap-4 mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {post.Title}
            </motion.h1>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleShare}
              className="shrink-0 rounded-full bg-secondary p-3 text-secondary-foreground transition-colors hover:bg-secondary/80 mt-2"
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4"
          >
            {post.$createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(post.$createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {getReadingTime(post.Content)} min read
            </span>
          </motion.div>

          {/* Actions row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            <button
              onClick={bookmarkPost}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors
                ${bookmarked
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              title={bookmarked ? "Saved to reading list" : "Save to reading list"}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-3.5 w-3.5" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
              {bookmarked ? "Saved" : "Save"}
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/edit/${post.$id}`}
                  className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 rounded-full bg-destructive px-3 py-2 text-xs font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                >
                  {deleting ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </motion.div>

          {/* Featured Image */}
          {imageUrl ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              src={imageUrl}
              alt={post.Title}
              className="w-full rounded-xl mb-12 object-cover max-h-[500px]"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex aspect-video w-full items-center justify-center rounded-xl mb-12 bg-gradient-to-br from-muted to-muted/50"
            >
              <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="blog-content text-foreground text-lg"
          >
            {parse(post.Content || "")}
          </motion.div>

          {/* More from Inkwell */}
          {recentPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 pt-10 border-t border-border"
            >
              <h3
                className="text-2xl font-bold text-foreground mb-6"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                More from Inkwell
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recentPosts.map((rp, i) => (
                  <BlogCard
                    key={rp.$id}
                    id={rp.$id}
                    title={rp.Title}
                    content={rp.Content}
                    featuredImage={
                      rp.featuredimage
                        ? String(databaseService.getFileView(rp.featuredimage))
                        : undefined
                    }
                    userId={rp.userId}
                    createdAt={rp.$createdAt}
                    index={i}
                    status={rp.status}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PostDetail;
