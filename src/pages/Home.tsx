import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";
import databaseService from "../lib/databaseService";
import { Query } from "appwrite";
import { ImageIcon } from "lucide-react";
import heroPattern from "../assets/hero-pattern.jpg";

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const postsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [featuredResult, latestResult] = await Promise.all([
          databaseService.getPosts([Query.equal("status", "featured")]),
          databaseService.getPosts([
            Query.equal("status", "active"),
            Query.orderDesc("$createdAt"),
            Query.limit(6),
          ]),
        ]);

        if (featuredResult) setFeaturedPosts(featuredResult.documents);
        if (latestResult) setLatestPosts(latestResult.documents);
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

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 opacity-10">
          <img src={heroPattern} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-background/80 to-background" />
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 
              className="font-bold text-foreground mb-4 text-5xl md:text-6xl"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Stories worth reading.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Inkwell is an open blogging platform for curious minds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={scrollToPosts}
                className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors"
              >
                Start Reading
              </button>
              <Link 
                to="/create"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium transition-colors"
              >
                Write a Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Post Section */}
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
            {featuredPosts.map((post) => (
              <motion.article 
                key={post.$id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
              >
                <Link to={`/post/${post.$id}`} className="w-full md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden">
                  {post.featuredimage ? (
                    <img
                      src={String(databaseService.getFileView(post.featuredimage))}
                      alt={post.Title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-muted to-muted/50">
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
            ))}
          </div>
        </section>
      )}

      {/* 3. Latest Posts Grid */}
      <section ref={postsRef} className="container mx-auto px-4 py-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-foreground mb-8"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Latest Posts
        </motion.h2>

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
                featuredImage={post.featuredimage ? String(databaseService.getFileView(post.featuredimage)) : undefined}
                userId={post.userId}
                createdAt={post.$createdAt}
                index={index}
                // We assume BlogCard will be modified in Wave 3 to show reading time and featured badge
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
            <p className="text-sm text-muted-foreground/70 mt-2">Check back later for new content.</p>
          </motion.div>
        )}
      </section>

      {/* 4. Bottom CTA Strip */}
      <section className="container mx-auto px-4 py-12 mb-12">
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
            className="inline-block px-8 py-3 rounded-lg bg-background text-foreground font-semibold hover:bg-secondary transition-colors shadow-sm"
          >
            Start Writing
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
