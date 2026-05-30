import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser"; // 1. Import EmailJS

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 2. Define your EmailJS configuration credentials
    const SERVICE_ID = 'Fyp';
    const TEMPLATE_ID ='template_tj4jl3f';
    const PUBLIC_KEY ='qMJ1HvG-2yFxXS1cK';

    // 3. Map your form fields to template parameters
    const templateParams = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    };

    try {
      // 4. Send the email using the SDK
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      
      toast.success("Message sent! We'll get back to you soon. 🙌");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Oops! Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "Example@inkwell.dev",
      href: "mailto:Example@inkwell.dev",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Location",
      value: "Open platform — worldwide",
      href: null,
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Response time",
      value: "Within 24 hours",
      href: null,
    },
  ];

  const socials = [
    { icon: <Github className="h-5 w-5" />, label: "GitHub", href: "https://github.com" },
    { icon: <Twitter className="h-5 w-5" />, label: "Twitter", href: "https://twitter.com" },
    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Have a question, suggestion, or just want to say hi? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Contact Information
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We're always open to feedback, collaboration opportunities, or just a good conversation about writing.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Follow us</p>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="rounded-xl border border-border bg-card p-3 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Name <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email <span className="text-destructive">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Subject <span className="text-destructive">*</span></label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback / Suggestion</option>
                    <option value="bug">Bug Report</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message <span className="text-destructive">*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
