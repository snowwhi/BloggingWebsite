import { motion } from "framer-motion";
import {
  Pencil,
  Cloud,
  Volume2,
  ImageIcon,
  Shield,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Pencil,
    title: "Rich Text Editor",
    desc: "Write with a full-featured TinyMCE editor supporting formatting, images, and code blocks.",
  },
  {
    icon: Cloud,
    title: "Cloud Storage & Auth",
    desc: "Secure authentication and file storage powered by Appwrite's backend-as-a-service.",
  },
  {
    icon: Volume2,
    title: "Text-to-Speech",
    desc: "Listen to any article with built-in browser speech synthesis for accessibility.",
  },
  {
    icon: ImageIcon,
    title: "Featured Image Support",
    desc: "Upload cover images stored in Appwrite cloud storage with automatic CDN delivery.",
  },
  {
    icon: Shield,
    title: "Secure Post Ownership",
    desc: "Permission-based access control ensures only post owners can edit or delete their content.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    desc: "Fully responsive layout that looks great on mobile, tablet, and desktop devices.",
  },
];

const techStack = [
  { tech: "React + TypeScript", description: "Frontend UI with type safety" },
  { tech: "Vite", description: "Lightning-fast build tool and dev server" },
  { tech: "Tailwind CSS", description: "Utility-first CSS framework" },
  {
    tech: "Framer Motion",
    description: "Smooth animations and page transitions",
  },
  {
    tech: "Appwrite",
    description: "Backend services — Auth, Database, Storage",
  },
  { tech: "TinyMCE", description: "Rich text editing (GPL, self-hosted)" },
];

const team = [
  { name: "Team Member 1", role: "Full-Stack Developer", color: "bg-primary" },
  { name: "Team Member 2", role: "Frontend Developer", color: "bg-accent" },
  { name: "Team Member 3", role: "Backend Developer", color: "bg-secondary" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* ── Section 1: Project Overview ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            About Inkwell
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Inkwell is a full-stack blogging platform built as a Final Year
            Project, designed to provide a clean, modern writing and reading
            experience. It combines powerful features with an intuitive
            interface, enabling users to create, publish, and discover blog posts
            with ease.
          </p>
        </motion.section>

        {/* ── Section 2: Features Grid ── */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-foreground text-center mb-10"
          >
            Features
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Section 3: Tech Stack Table ── */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-foreground text-center mb-10"
          >
            Tech Stack
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-xl border"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-sm font-semibold text-foreground">
                    Technology
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {techStack.map((row, index) => (
                  <tr
                    key={row.tech}
                    className={
                      index % 2 === 0 ? "bg-card" : "bg-muted/50"
                    }
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {row.tech}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* ── Section 4: Team Section ── */}
        {/* 4. Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center" style={{ fontFamily: "'DM Serif Display', serif" }}>
            The Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sakina", role: "Full-Stack Developer", color: "bg-primary" },
              { name: "Tahrim", role: "Frontend Developer", color: "bg-accent" },
              { name: "Team Member 3", role: "Backend Developer", color: "bg-secondary" },
            ].map((member, i) => (
              <motion.div 
                key={i}
                variants={cardVariants}
                className="bg-card rounded-2xl border border-border p-8 text-center hover:shadow-lg transition-all"
              >
                <div className={`w-24 h-24 mx-auto rounded-full ${member.color} mb-4 flex items-center justify-center text-white text-3xl font-bold`}>
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
