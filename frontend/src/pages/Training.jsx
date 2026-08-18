import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import {
  ChevronRight,
  Clock,
  Map,
  Cpu,
  Brain,
  Wrench,
  Tractor,
  TrendingUp,
  Target,
  MapPin,
  Phone,
  FileText,
  User,
  Calendar,
  IndianRupee,
  BadgeCheck,
  ChevronLeft,
  CheckCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import imgField1 from "@/assets/training-field-1.jpg";
import imgField2 from "@/assets/training-field-2.jpg";
import imgSimulator from "@/assets/training-simulator.jpg";
import imgGroup1 from "@/assets/training-group-1.jpg";
import imgGroup2 from "@/assets/training-group-2.jpg";

// Local asset imports for skill development courses
import imgHighway from "@/assets/nhai-project.png";
import imgDroneFieldDemo from "@/assets/drone-field-demo.jpg";

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3001"
  : "https://soaring-aerotech-two.vercel.app";
import imgSolar from "@/assets/solar-project.png";
import imgThermalInspection from "@/assets/thermal-inspection.jpg";
import imgSimulationLab from "@/assets/simulation-lab-project.jpg";
import imgAgriculture from "@/assets/agriculture-project.png";
import imgTechAdoption from "@/assets/tech-adoption.jpg";
import imgManufacturing from "@/assets/uav-manufacturing.jpg";
import imgExhibitionBooth from "@/assets/exhibition-booth.jpg";

const programs = [
  { tag: "SKILL COURSE", title: "Mapping & Surveying", icon: <Map className="w-7 h-7" />, duration: "3–5 Days", img: imgHighway, topics: ["Aerial Land Survey", "2D/3D Mapping", "RTK/PPK GNSS", "Pix4D / DroneDeploy", "Client Deliverables", "GIS Outputs"] },
  { tag: "SKILL COURSE", title: "GIS & Geospatial", icon: <Target className="w-7 h-7" />, duration: "3–5 Days", img: imgDroneFieldDemo, topics: ["GIS Fundamentals", "Land Record Mapping", "Urban Planning", "ArcGIS / QGIS", "Spatial Analysis", "Gov Applications"] },
  { tag: "SKILL COURSE", title: "Thermal & Multispectral", icon: <Cpu className="w-7 h-7" />, duration: "3–4 Days", img: imgThermalInspection, topics: ["Thermal Camera Ops", "NDVI / NDWI", "Solar Inspection", "Power Line Audit", "Crop Imaging", "Report Generation"] },
  { tag: "ADVANCED", title: "AI/ML for Drones", icon: <Brain className="w-7 h-7" />, duration: "5–7 Days", img: imgSimulationLab, topics: ["Computer Vision", "Object Detection", "Autonomous Flight", "Edge Computing", "Mission AI", "Surveillance AI"] },
  { tag: "SKILL COURSE", title: "Precision Agriculture", icon: <Tractor className="w-7 h-7" />, duration: "3–4 Days", img: imgAgriculture, topics: ["Crop Health Mapping", "Precision Spraying", "Irrigation Analysis", "Yield Estimation", "NDVI Reports", "Farm Ops"] },
  { tag: "SKILL COURSE", title: "Assembly & Maintenance", icon: <Wrench className="w-7 h-7" />, duration: "3–5 Days", img: imgManufacturing, topics: ["Frame Assembly", "Flight Controller", "ESC Calibration", "Battery Management", "Pre-flight Checks", "Field Repair"] },
  { tag: "ENTREPRENEURSHIP", title: "Drone Entrepreneurship", icon: <TrendingUp className="w-7 h-7" />, duration: "2–3 Days", img: imgExhibitionBooth, topics: ["DGCA Compliance", "Business Models", "Client Acquisition", "Pricing", "Government Tenders", "Scaling"] },
];

const steps = [
  { n: "01", title: "Registration", desc: "Submit documents & pay fees via online banking / RTGS" },
  { n: "02", title: "Theory Classes", desc: "2 days — online or offline, UAS training summary provided" },
  { n: "03", title: "Theory Test", desc: "Conducted after ground school session" },
  { n: "04", title: "Simulator & Assembly", desc: "3 days at flying site — Indore City SAPL" },
  { n: "05", title: "RPC Issued", desc: "Upto 10-year certificate issued by Soaring Aerotech" },
];

const docs = [
  { icon: <FileText className="w-4 h-4" />, label: "Aadhar / Voter Card / Driving Licence / Passport (Original)" },
  { icon: <FileText className="w-4 h-4" />, label: "10th Certificate or ITI Equivalent (Copy)" },
  { icon: <FileText className="w-4 h-4" />, label: "Medical Certificate of Fitness — from certified MBBS Doctor" },
  { icon: <User className="w-4 h-4" />, label: "4 Passport-sized photos (white background)" },
];

function CourseSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = programs.length;
  const intervalRef = useRef(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % total);
    }, 3200);
  };

  useEffect(() => {
    if (!paused) startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  const go = (dir) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent((p) => (p + dir + total) % total);
    if (!paused) startTimer();
  };

  const getVisible = () => {
    const indices = [];
    for (let i = 0; i < 4; i++) {
      indices.push((current + i) % total);
    }
    return indices;
  };

  return (
    <div>
      {/* Mobile Horizontal Scroll View */}
      <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 -mx-4 px-4">
        {programs.map((p, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] shrink-0 w-[60vw] max-w-[220px] snap-center"
            onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
          >
            <img
              src={p.img}
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                {p.tag}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">

              <h3 className="font-display text-lg text-white leading-tight mb-3">{p.title}</h3>
              <div className="flex items-center gap-1.5 text-white/60 text-sm">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Slider View */}
      <div
        className="hidden sm:block relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {getVisible().map((idx) => {
              const p = programs[idx];
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4]"
                  onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                      {p.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-lg text-white leading-tight mb-3">{p.title}</h3>
                    <div className="flex items-center gap-1.5 text-white/60 text-sm">
                      Learn more <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1.5">
            {programs.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-foreground/20"
                  }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(-1)}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Training() {
  const [enrollForm, setEnrollForm] = useState({
    name: "", phone: "", email: "", program: "DGCA RPC — Small Class (₹20,000)", message: "",
  });
  const [enrollStatus, setEnrollStatus] = useState("idle");

  const handleEnrollChange = (e) => {
    setEnrollForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setEnrollStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/api/forms/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "enrollment", ...enrollForm }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrollStatus("success");
        setEnrollForm({ name: "", phone: "", email: "", program: "DGCA RPC — Small Class (₹20,000)", message: "" });
      } else {
        setEnrollStatus("error");
      }
    } catch {
      setEnrollStatus("error");
    }
  };

  return (
    <main className="min-h-screen pt-16 sm:pt-20">
      <SEO
        title="DGCA Drone Training & Certification"
        description="Become a certified drone pilot in India. Join Soaring Aerotech's DGCA-approved RPTO in Indore. 5-day professional pilot training, RPC valid upto 10 years, and advanced skill courses."
        keywords="DGCA drone training, remote pilot certificate, RPTO Indore, drone license India, drone mapping course, drone pilot salary India, multirotor certification"
      />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="bg-[#F5F5F5] border-b border-border py-8 sm:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="section-label">DGCA APPROVED RPTO · INDORE, MP</div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-4">
                DGCA Drone Training<br /><span className="text-primary">Get Certified.</span>
              </h1>
              <ul className="space-y-2.5 mb-6 max-w-lg text-muted-foreground text-base">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>Small & Medium Class</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>Category - Rotorcraft</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>Condition - VLOS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">Indore's first DGCA-approved RPTO.</span>
                </li>
              </ul>

              {/* DGCA Authorization Callout Box */}
              <div className="mb-6 bg-white border-l-4 border-primary rounded-r-xl p-4 shadow-sm max-w-lg border border-border border-y-border border-r-border">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">DGCA Authorization Details</div>
                    <div className="text-sm md:text-base font-bold text-foreground">
                      RPTO Authorisation Number: <span className="text-primary font-mono font-bold">40/2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 max-w-2xl">
                <Button size="lg" className="rounded-full h-12 px-7 font-bold w-full sm:w-auto shrink-0" onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}>
                  Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:flex-row sm:gap-3">
                  <a href="tel:+917869918736" className="w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="rounded-full h-12 px-4 text-xs sm:text-sm font-semibold border-border text-foreground hover:bg-slate-50 w-full flex items-center justify-center whitespace-nowrap">
                      <Phone className="w-3.5 h-3.5 mr-2 shrink-0" /> +91 78699 18736
                    </Button>
                  </a>
                  <a href="tel:+917869955418" className="w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="rounded-full h-12 px-4 text-xs sm:text-sm font-semibold border-border text-foreground hover:bg-slate-50 w-full flex items-center justify-center whitespace-nowrap">
                      <Phone className="w-3.5 h-3.5 mr-2 shrink-0" /> +91 78699 55418
                    </Button>
                  </a>
                </div>
              </div>
              <div className="flex gap-6">
                {[{ v: "Upto 10 Yrs", l: "RPC Validity" }, { v: "5-7 Days", l: "Duration" }].map((s, i) => (
                  <div key={i}>
                    <div className="font-display text-2xl text-foreground font-black">{s.v}</div>
                    <div className="text-muted-foreground text-xs">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] mt-8 lg:mt-0 block"
            >
              <img src={imgField1} alt="Drone pilot training" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ────────────────────────── */}
      <section className="py-10 sm:py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-label">DGCA CERTIFIED PROGRAM</div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-8">Remote Pilot Certificate (RPC)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border-2 border-primary overflow-hidden shadow-sm">
              <div className="relative h-40 overflow-hidden">
                <img src={imgField1} alt="Small Class" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#111111]/75" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-xs font-bold font-mono text-primary uppercase tracking-widest mb-1">Small</span>
                  <h3 className="font-display text-2xl text-white">Small Class — Rotorcraft</h3>
                  <p className="text-white/40 text-xs mt-1">VLOS · Class: Small · Category: Rotorcraft</p>
                </div>
              </div>
              <div className="p-6 bg-[#F5F5F5]">
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-display text-4xl text-foreground">₹20,000</span>
                  <span className="text-sm text-muted-foreground mb-1">+ GST / candidate</span>
                </div>
                <p className="text-xs text-muted-foreground mb-5">Fooding & accommodation extra</p>
                <Button className="w-full rounded-xl h-11 font-bold" onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}>Enquire — Small Class</Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="relative h-40 overflow-hidden">
                <img src={imgGroup1} alt="Multirotor" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#111111]/75" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-xs font-bold font-mono text-white/40 uppercase tracking-widest mb-1">Advanced</span>
                  <h3 className="font-display text-2xl text-white">Multirotor — DGCA</h3>
                  <p className="text-white/40 text-xs mt-1">DGCA-Certified Multirotor Training</p>
                </div>
              </div>
              <div className="p-6 bg-[#F5F5F5]">
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-display text-4xl text-foreground">₹25,000</span>
                  <span className="text-sm text-muted-foreground mb-1">+ GST / candidate</span>
                </div>
                <p className="text-xs text-muted-foreground mb-5">Fooding & accommodation extra</p>
                <Button variant="outline" className="w-full rounded-xl h-11 font-bold" onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}>Enquire — Multirotor</Button>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <Clock className="w-4 h-4 text-primary" />, label: "Duration", value: "5-7 Days" },
              { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Location", value: "Indore, M.P." },
              { icon: <BadgeCheck className="w-4 h-4 text-primary" />, label: "RPC Validity", value: "Upto 10 Years" },
              { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Eligibility", value: "18-65 yrs, 10th/ITI equivalent" },
            ].map((f, i) => (
              <div key={i} className="bg-[#F5F5F5] border border-border rounded-xl p-4 flex gap-3 items-start">
                <div className="mt-0.5 shrink-0">{f.icon}</div>
                <div>
                  <div className="text-xs text-muted-foreground">{f.label}</div>
                  <div className="font-bold text-sm text-foreground mt-0.5">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course structure ─────────────────────── */}
      <section className="py-10 sm:py-20 bg-[#F5F5F5] border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-label mb-8">COURSE STRUCTURE</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <img src={imgSimulator} alt="Theory Classes" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#111111]/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-display font-bold text-white text-lg mx-auto mb-2">1</div>
                    <div className="text-white font-bold">Theory Classes</div>
                    <div className="text-white/50 text-xs font-mono">02 DAYS</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {["Online or Offline mode available", "Aviation regulations & NPNT", "Meteorology & airspace rules", "UAS Training Summary provided", "Theory test conducted after session"].map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <img src={imgField2} alt="Practical Flying" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#111111]/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-display font-bold text-white text-lg mx-auto mb-2">2</div>
                    <div className="text-white font-bold">Simulator & Practical</div>
                    <div className="text-white/50 text-xs font-mono">03 DAYS · AT FLYING SITE</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {["Simulator training & drills", "Drone assembly & components", "Practical flying — VLOS", "Dual-control with instructors", "Final evaluation by DGCA norms"].map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Process timeline ─────────────────────── */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-label mb-10">HOW IT WORKS</div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-border z-0" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {steps.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F5F5F5] border-2 border-border flex items-center justify-center font-display text-sm text-foreground mb-4 hover:border-primary hover:text-primary transition-colors">{s.n}</div>
                  <div className="font-bold text-sm text-foreground mb-1">{s.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Skill Development Courses Slider ─────── */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label">MORE PROGRAMS</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">Skill Development Courses</h2>
            </div>
            <button
              onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden md:inline-flex items-center gap-2 text-primary font-bold text-sm"
            >
              Enquire Now <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <CourseSlider />
        </div>
      </section>

      {/* ── Corporate ────────────────────────────── */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src={imgGroup2} alt="Corporate Training" className="w-full h-72 object-cover rounded-3xl shadow-xl" />
              <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-2xl p-5 shadow-xl">
                <div className="font-display text-3xl font-black">30+</div>
                <div className="text-sm font-semibold opacity-90">Corporate Batches</div>
              </div>
            </div>
            <div>
              <div className="section-label">CORPORATE & INSTITUTIONAL</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">Training for Organizations</h2>
              <p className="text-muted-foreground mb-6 text-sm">Custom DGCA-aligned batch programs for government bodies, defence, police, and institutions — on-site or at our Indore facility.</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Government", "Army & Defence", "Police Forces", "Universities", "Smart Cities", "Corporates"].map((o, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-[#F5F5F5] border border-border text-sm font-medium">{o}</span>
                ))}
              </div>
              <Link href="/contact"><Button className="rounded-full px-8 h-12 font-bold">Request Corporate Proposal</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Eligibility & Docs ───────────────────── */}
      <section className="py-10 sm:py-20 bg-[#F5F5F5] border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl border border-border p-7">
              <div className="section-label mb-5">ELIGIBILITY</div>
              <div className="space-y-4">
                {[
                  { icon: <User className="w-4 h-4 text-primary" />, label: "Age", value: "18 to 65 years" },
                  { icon: <FileText className="w-4 h-4 text-primary" />, label: "Education", value: "10th Pass or ITI equivalent" },
                  { icon: <BadgeCheck className="w-4 h-4 text-primary" />, label: "Medical", value: "Fitness certificate from MBBS Doctor" },
                  { icon: <IndianRupee className="w-4 h-4 text-primary" />, label: "Payment", value: "Full fees before registration date" },
                ].map((e, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">{e.icon}</div>
                    <div>
                      <div className="text-xs text-muted-foreground">{e.label}</div>
                      <div className="font-semibold text-sm text-foreground mt-0.5">{e.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-border p-7">
              <div className="section-label mb-5">DOCUMENTS REQUIRED</div>
              <ul className="space-y-3">
                {docs.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#F5F5F5] border border-border flex items-center justify-center shrink-0 text-foreground/40 mt-0.5">{d.icon}</div>
                    <span className="text-sm text-foreground/75 leading-snug">{d.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Payment Mode:</span> Online Banking or RTGS. Training certificate issued only after receipt of payment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Training Gallery Section ──────────────── */}
      <section className="py-20 bg-[#F5F5F5] border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-label">RPTO IN ACTION</div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-8">Training Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group shadow-sm border border-border">
              <img src={imgField1} alt="Field training session" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">Flight Field Training</div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group shadow-sm border border-border">
              <img src={imgSimulator} alt="Simulator training room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">Drone Simulator Lab</div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group shadow-sm border border-border">
              <img src={imgField2} alt="Practical training session" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">Practical Flight Controls</div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group shadow-sm border border-border lg:col-span-2">
              <img src={imgGroup1} alt="Training batch group" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">Training Batch Group</div>
            </div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group shadow-sm border border-border">
              <img src={imgGroup2} alt="Instructors and pilots group" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">RPTO Certified Instructors</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Enroll form ──────────────────────────── */}
      <section id="enroll" className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-lg border-t-4 border-primary border border-border">
              <h2 className="font-display text-2xl text-foreground mb-1 text-center">Enrollment Enquiry</h2>
              <p className="text-xs text-muted-foreground text-center mb-7">Our training coordinator will contact you within 24 hours.</p>

              {enrollStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl text-foreground">Enquiry Submitted!</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">Our training coordinator will reach out within 24 hours.</p>
                  <Button variant="outline" className="rounded-full mt-1" onClick={() => setEnrollStatus("idle")}>Submit Another</Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleEnrollSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">Full Name *</label>
                      <input name="name" type="text" required value={enrollForm.name} onChange={handleEnrollChange} className="w-full bg-[#F5F5F5] border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">Phone *</label>
                      <input name="phone" type="tel" required value={enrollForm.phone} onChange={handleEnrollChange} className="w-full bg-[#F5F5F5] border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="+91 78699 18736" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">Email</label>
                    <input name="email" type="email" value={enrollForm.email} onChange={handleEnrollChange} className="w-full bg-[#F5F5F5] border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">Program</label>
                    <select name="program" value={enrollForm.program} onChange={handleEnrollChange} className="w-full bg-[#F5F5F5] border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none">
                      <option>DGCA RPC — Small Class (₹20,000)</option>
                      <option>DGCA Multirotor (₹25,000)</option>
                      <option>Mapping & Surveying</option>
                      <option>GIS & Geospatial</option>
                      <option>Thermal & Multispectral</option>
                      <option>AI/ML for Drones</option>
                      <option>Precision Agriculture</option>
                      <option>Assembly & Maintenance</option>
                      <option>Drone Entrepreneurship</option>
                      <option>Corporate Batch Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">Message (optional)</label>
                    <textarea name="message" rows={3} value={enrollForm.message} onChange={handleEnrollChange} className="w-full bg-[#F5F5F5] border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Any specific requirements or questions..." />
                  </div>
                  {enrollStatus === "error" && (
                    <p className="text-red-500 text-xs">Something went wrong. Please try again or call us directly.</p>
                  )}
                  <Button type="submit" disabled={enrollStatus === "loading"} className="w-full h-12 rounded-xl font-bold gap-2">
                    {enrollStatus === "loading" ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Enquiry</>}
                  </Button>
                  <p className="text-[10px] text-muted-foreground text-center">
                    By submitting you agree to be contacted by our training team.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
