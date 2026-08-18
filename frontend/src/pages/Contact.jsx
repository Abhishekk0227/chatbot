import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { MapPin, Phone, Mail, Send, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3001"
  : "https://soaring-aerotech-two.vercel.app";

export default function Contact() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", subject: "", message: "",
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/api/forms/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen">
      <SEO 
        title="Contact Us"
        description="Contact Soaring Aerotech Pvt. Ltd. in Indore, Madhya Pradesh. Enquire about our drone courses, corporate training batches, B2B services, or custom UAV designs."
        keywords="contact Soaring Aerotech, drone school contact, Indore drone pilot training phone number, drone quote India"
      />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-[25vh] sm:min-h-[45vh] flex items-center overflow-hidden bg-[#111111]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=1600&h=900&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/85 to-[#111111]/50" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-10 sm:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] sm:text-xs mb-3 sm:mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Indore, Madhya Pradesh · India
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-2xl sm:text-5xl md:text-7xl text-white mb-3 leading-tight">
            Get in <span className="text-primary">Touch</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="text-white/50 text-xs sm:text-lg max-w-xl mx-auto">
            Whether you want to enroll in a course, discuss an enterprise project, or explore academic partnerships — we're ready to talk.
          </motion.p>
        </div>
      </section>

      <section className="py-6 sm:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4 sm:space-y-6">
              <div>
                <div className="section-label mb-4 sm:mb-6">CONTACT INFORMATION</div>
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-[#F5F5F5] border border-border hover:border-primary/20 transition-colors">
                    <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                      <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-base text-foreground mb-0.5 sm:mb-1">Headquarters</h4>
                      <p className="text-muted-foreground text-[11px] sm:text-sm leading-relaxed">
                        AIC-Prestige Inspire Foundation<br />
                        Prestige Vihar, Sector-D, Vijay Nagar, Scheme No 74C<br />
                        Indore, Madhya Pradesh 452010
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-[#F5F5F5] border border-border hover:border-primary/20 transition-colors">
                    <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                      <Phone className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-base text-foreground mb-0.5 sm:mb-1">Phone</h4>
                      <p className="text-muted-foreground text-[11px] sm:text-sm flex flex-col gap-0.5 sm:gap-1">
                        <a href="tel:+917869918736" className="hover:text-primary transition-colors">+91 78699 18736</a>
                        <a href="tel:+917869955418" className="hover:text-primary transition-colors">+91 78699 55418</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-[#F5F5F5] border border-border hover:border-primary/20 transition-colors">
                    <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                      <Mail className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-base text-foreground mb-0.5 sm:mb-1">Email</h4>
                      <p className="text-muted-foreground text-[11px] sm:text-sm">
                        <a href="mailto:info@soaringaerotech.com" className="hover:text-primary transition-colors">info@soaringaerotech.com</a>
                      </p>
                      <p className="text-muted-foreground text-[11px] sm:text-sm">
                        <a href="mailto:business@soaringaerotech.com" className="hover:text-primary transition-colors">business@soaringaerotech.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-36 sm:h-48 md:h-64 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&h=500&fit=crop"
                  alt="Indore, Madhya Pradesh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 sm:gap-2">
                  <MapPin className="w-5 h-5 sm:w-8 sm:h-8 text-primary" />
                  <p className="text-white text-xs sm:text-base font-bold">Indore, Madhya Pradesh</p>
                  <p className="text-white/60 text-[9px] sm:text-xs font-mono">AIC-PRESTIGE INSPIRE FOUNDATION</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-4 sm:p-8 md:p-10 rounded-2xl border border-border shadow-lg">
              <div className="section-label mb-4 sm:mb-6">SEND A MESSAGE</div>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">We've received your message and will get back to you within 24 hours.</p>
                  <Button variant="outline" className="rounded-full mt-2" onClick={() => setStatus("idle")}>Send Another</Button>
                </div>
              ) : (
                <form className="space-y-3.5 sm:space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-foreground">Full Name *</label>
                      <input name="name" type="text" required value={form.name} onChange={handleChange} className="w-full bg-[#F5F5F5] border border-border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-xs sm:text-sm" placeholder="Your name" />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-semibold text-foreground">Phone Number *</label>
                      <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className="w-full bg-[#F5F5F5] border border-border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-xs sm:text-sm" placeholder="+91 78699 18736" />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-foreground">Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-[#F5F5F5] border border-border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-xs sm:text-sm" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-foreground">Subject / Inquiry Type *</label>
                    <select name="subject" required value={form.subject} onChange={handleChange} className="w-full bg-[#F5F5F5] border border-border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none text-xs sm:text-sm">
                      <option value="">Select an option...</option>
                      <option value="training">Drone Training & Courses</option>
                      <option value="services">Enterprise Drone Services</option>
                      <option value="manufacturing">UAV Manufacturing Inquiry</option>
                      <option value="partnership">Partnership & Research</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-foreground">Message *</label>
                    <textarea name="message" required rows={3} value={form.message} onChange={handleChange} placeholder="Tell us about your project or inquiry..." className="w-full bg-[#F5F5F5] border border-border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none text-xs sm:text-sm" />
                  </div>
                  {status === "error" && (
                    <p className="text-red-500 text-xs sm:text-sm">Something went wrong. Please try again or call us directly.</p>
                  )}
                  <div className="flex flex-row gap-2 sm:gap-3 pt-1">
                    <Button type="submit" disabled={status === "loading"} className="flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold gap-2 flex items-center justify-center">
                      {status === "loading" ? "Sending..." : <><Send className="w-3.5 h-3.5 shrink-0" /> Send Message</>}
                    </Button>
                    <a href="https://wa.me/917869918736" target="_blank" rel="noopener noreferrer" className="flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#1ebe57] text-white transition-colors gap-2 flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" /> WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Visual CTA strip ─────────────────────── */}
      <section className="relative py-10 sm:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&h=500&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Response Time</p>
              <h3 className="font-display text-2xl text-white">We respond within <span className="text-primary">24 hours</span></h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+917869918736">
                <Button variant="outline" className="rounded-full px-5 h-12 text-sm font-semibold border-white/20 text-white hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-2" /> +91 78699 18736
                </Button>
              </a>
              <a href="tel:+917869955418">
                <Button variant="outline" className="rounded-full px-5 h-12 text-sm font-semibold border-white/20 text-white hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-2" /> +91 78699 55418
                </Button>
              </a>
              <a href="mailto:info@soaringaerotech.com">
                <Button className="rounded-full px-6 h-12 font-semibold">
                  <Mail className="w-4 h-4 mr-2" /> Email Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
