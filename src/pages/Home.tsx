import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";
import databaseService from "../lib/databaseService";
import { Query } from "appwrite";
import { ImageIcon, BookOpen, PenLine, Users, Sparkles, ArrowRight, Mail } from "lucide-react";
import heroPattern from "../assets/hero-pattern.jpg";
import { toast } from "react-toastify";

const TOPICS = [
  { label: "Technology", emoji: "💻", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { label: "Design", emoji: "🎨", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { label: "Science", emoji: "🔬", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  { label: "Culture", emoji: "🌍", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  { label: "Business", emoji: "📈", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  { label: "Health", emoji: "🧠", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  { label: "Travel", emoji: "✈️", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { label: "Food", emoji: "🍜", color: "bg-pink-500/10 text-pink-600 border-pink-500/20" },
];

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [email, setEmail] = useState("");
  const [featuredImgErrors, setFeaturedImgErrors] = useState<Record<string, boolean>>({});
  const postsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [featuredResult, latestResult, allResult] = await Promise.all([
          databaseService.getPosts([Query.equal("status", "featured")]),
          databaseService.getPosts([
            Query.equal("status", "active"),
            Query.orderDesc("$createdAt"),
            Query.limit(6),
          ]),
          databaseService.getPosts([Query.orderDesc("$createdAt"), Query.limit(100)]),
        ]);

        if (featuredResult) setFeaturedPosts(featuredResult.documents);
        if (latestResult) setLatestPosts(latestResult.documents);
        if (allResult) setTotalPosts(allResult.total ?? allResult.documents.length);
      } catch (error) {
        console.log("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const scrollToPosts = () => {
    postsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getReadingTime = (content: string) => {
    if (!content) return 1;
    const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're subscribed! Welcome to Inkwell. 🎉");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 opacity-10">
          <img src={heroPattern} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-background/80 to-background" />
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            
            <h1
              className="font-bold text-foreground mb-5 text-5xl md:text-7xl leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Stories worth
              <br />
              <span className="text-primary">reading.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover thoughtful writing from passionate authors. Share your ideas with the world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={scrollToPosts}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors"
              >
                <BookOpen className="h-4 w-4" /> Start Reading
              </button>
              <Link
                to="/create"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium transition-colors"
              >
                <PenLine className="h-4 w-4" /> Write a Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Bar */}
      {!loading && (
        <section className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
              {[
                { icon: <BookOpen className="h-5 w-5" />, value: totalPosts > 0 ? `${totalPosts}+` : "0", label: "Stories Published" },
                { icon: <Users className="h-5 w-5" />, value: "Open", label: "Platform" },
                { icon: <PenLine className="h-5 w-5" />, value: "Free", label: "Forever" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="text-primary mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Post Section */}
      {!loading && featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-foreground mb-6"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Featured
          </motion.h2>
          <div className="flex flex-col gap-6">
            {featuredPosts.map((post) => {
              const imgUrl = post.featuredimage ? databaseService.getFileView(post.featuredimage) : null;
              const hasImgError = featuredImgErrors[post.$id];
              return (
                <motion.article
                  key={post.$id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
                >
                  <Link to={`/post/${post.$id}`} className="w-full md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden min-h-[220px]">
                    {imgUrl && !hasImgError ? (
                      <img
                        src={imgUrl}
                        alt={post.Title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setFeaturedImgErrors(prev => ({ ...prev, [post.$id]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </Link>
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium border border-amber-500/20">
                        Featured
                      </span>
                      <span className="text-xs text-muted-foreground">{getReadingTime(post.Content)} min read</span>
                    </div>
                    <Link to={`/post/${post.$id}`}>
                      <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        {post.Title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                      {stripHtml(post.Content).slice(0, 200)}...
                    </p>
                    <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                      <span>{post.userId?.slice(0, 8) || 'Unknown Author'}</span>
                      <span>{new Date(post.$createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      )}
      {/* 5. Latest Posts Grid */}
      <section ref={postsRef} className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Latest Stories
          </h2>
          <Link
            to="/search"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => (
              <BlogCard
                key={post.$id}
                id={post.$id}
                title={post.Title}
                content={post.Content}
                featuredImage={post.featuredimage ? databaseService.getFileView(post.featuredimage) : undefined}
                userId={post.userId}
                createdAt={post.$createdAt}
                index={index}
                status={post.status}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-card rounded-2xl border border-dashed border-border"
          >
            <ImageIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl text-muted-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>No stories yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-2 mb-6">Be the first to share something.</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <PenLine className="h-4 w-4" /> Write a Story
            </Link>
          </motion.div>
        )}
      </section>

      {/* 6. Newsletter Section */}
      <section className="container mx-auto px-4 py-12 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-10 md:p-14 text-center"
        >
          <div className="mx-auto max-w-xl">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Stay in the loop
            </h2>
            <p className="text-muted-foreground mb-8">
              Get the best stories delivered straight to your inbox. Join 2,400+ readers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">No spam, ever. Unsubscribe at any time.</p>
          </div>
        </motion.div>
      </section>

      {/* 7. Bottom CTA Strip */}
      <section className="container mx-auto px-4 py-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary text-primary-foreground rounded-2xl p-10 md:p-16 text-center shadow-lg"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Have something to say?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Share your stories with the world. Join our community of writers and readers today.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-background text-foreground font-semibold hover:bg-secondary transition-colors shadow-sm"
          >
            <PenLine className="h-4 w-4" /> Start Writing
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
