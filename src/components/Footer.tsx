import { Link } from "react-router-dom";
import { Github, Mail, Globe, Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: About the Project */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-bold text-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Inkwell
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Inkwell is a modern, full-stack blogging platform developed as a Final Year Project.
              It provides a seamless rich-text writing experience, smart search, personal reading lists,
              and a premium responsive interface.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Features */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Platform Features
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Rich Text & Image Uploads</li>
              <li>Story Search</li>
              <li>Personal Reading List</li>
              <li>Secure Role-Based Auth</li>
              <li>Dark & Light Mode</li>
            </ul>
          </div>

          {/* Column 3: Project Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Key Information
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About the Developers</Link>
              </li>
              <li>
                <span className="cursor-help" title="Frontend: React, Tailwind | Backend: Appwrite">Technology Stack</span>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">FYP Documentation</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Academic References</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Inkwell. Developed as an Academic Final Year Project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
