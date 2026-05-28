import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, User, ImageIcon } from "lucide-react";

// 1. Define the Interface for your props
interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  featuredImage?: string | null;
  userId?: string;
  createdAt?: string | number | Date;
  index?: number;
  status?: string;
}

const stripHtml = (html: string) => {
  // Check for window to avoid SSR errors
  if (typeof window === "undefined") return html; 
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const getReadingTime = (content: string) => {
  if (!content) return 1;
  const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  return Math.ceil(wordCount / 200);
};

const BlogCard = ({ 
  id, 
  title, 
  content, 
  featuredImage, 
  userId, 
  createdAt, 
  index = 0,
  status
}: BlogCardProps) => { // 2. Apply the interface here
  const excerpt = stripHtml(content).slice(0, 160) + "...";
  const readingTime = getReadingTime(content);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link 
        to={`/post/${id}`} 
        className="block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
      >
        <div className="aspect-video overflow-hidden">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {status === "featured" && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-medium border border-amber-500/20 uppercase tracking-wider">
                Featured
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
              {readingTime} min read
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
            {excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {userId && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {userId.slice(0, 8)}
              </span>
            )}
            {createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {new Date(createdAt).toLocaleDateString("en-US", { 
                  month: "short", 
                  day: "numeric", 
                  year: "numeric" 
                })}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;