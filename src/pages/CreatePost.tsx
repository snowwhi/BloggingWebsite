import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Editor } from "@tinymce/tinymce-react";
import databaseService from "../lib/databaseService";
import { ID } from "appwrite";
import { Send, ArrowLeft } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import appwriteConfig from '../lib/appwriteConfig'

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in first");
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      const slug = ID.unique();
      await databaseService.createPost({
        title,
        slug,
        content,
        status: "active",
        userId: user.$id,
      });

      toast.success("Story published! 📝");
      navigate(`/post/${slug}`);
    } catch (error) {
      toast.error(error?.message || "Failed to publish story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Write a Story</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-0 border-b-2 border-border bg-transparent pb-3 font-display text-2xl font-bold text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                placeholder="Your story title..."
                required
              />
            </div>

            {/* TinyMCE Editor */}
            <div className="rounded-xl border border-border overflow-hidden">
              <Editor
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                onInit={(_evt, editor) => (editorRef.current = editor)}
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  base_url: '/tinymce',
                  promotion: false,
                  height: 450,
                  menubar: true,
                  skin: theme === "dark" ? "oxide-dark" : "oxide",
                  content_css: theme === "dark" ? "dark" : "default",
                  plugins: [
                    "advlist", "autolink", "lists", "link",
                    "charmap", "preview", "anchor", "searchreplace",
                    "visualblocks", "code", "fullscreen", "insertdatetime",
                    "media", "table", "code", "help", "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                  content_style:
                    "body { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.7; }",
                }}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? "Publishing..." : "Publish Story"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;
