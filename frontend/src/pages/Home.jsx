import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import SEO from "@/components/SEO";
import {
  Tractor,
  Shield,
  Map,
  Sun,
  Building2,
  HardHat,
  Building,
  Zap,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Wrench,
  Lightbulb,
  Factory,
  ArrowDown,
  MapPin,
  Award,
  Quote,
  Phone,
  Newspaper,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import photoHimanshu from "@/assets/himanshu.jpeg";
import photoManoj from "@/assets/manoj.png";
import logoNhai from "@/assets/nhai-logo.png";
import logoMprdc from "@/assets/mprdc-logo.png";
import logoMpeb from "@/assets/mpeb-logo.png";
import logoIitIndore from "@/assets/iit-indore-logo.png";
import logoIitGandhinagar from "@/assets/iit-gandhinagar-logo.png";
import logoDgca from "@/assets/dgca-logo.png";
import logoDpiit from "@/assets/dpiit-logo.png";
import logoAic from "@/assets/aic-logo.png";

// New Gallery Image Imports
import imgNflTraining from "@/assets/nfl-training.jpg";
import imgDroneFieldDemo from "@/assets/drone-field-demo.jpg";
import imgDroneDidiGroup from "@/assets/drone-didi-group.jpg";
import imgNewsTearGas from "@/assets/news-tear-gas.png";
import imgNewsForestSecurity from "@/assets/news-forest-security.png";
import videoDroneDescending from "@/assets/drone_descending.mp4";
import imgManufacturing from "@/assets/uav-manufacturing.jpg";

import imgSurveillance from "@/assets/surveillance-project.png";
import imgHighway from "@/assets/nhai-project.png";
import imgMprdcProject from "@/assets/mprdc-project.png";
import imgAgriculture from "@/assets/agriculture-project.png";
import imgSolar from "@/assets/solar-project.png";
import imgSolarThermalInspection from "@/assets/solar-thermal-inspection.jpg";
import imgSimulationLab from "@/assets/simulation-lab-project.jpg";
import imgDidiInitiative from "@/assets/didi-initiative.jpg";
import imgPilotAwareness from "@/assets/pilot-awareness.jpg";
import imgWomenEmpowerment from "@/assets/women-empowerment.jpg";
import imgSkilledWorkforce from "@/assets/skilled-workforce.jpg";
import imgExhibitionBooth from "@/assets/exhibition-booth.jpg";
import imgStudentTraining from "@/assets/student-training.jpg";
import imgSimulatorTraining2 from "@/assets/simulator-training-2.jpg";
import imgFieldTraining3 from "@/assets/field-training-3.jpg";
import imgPoliceTraining from "@/assets/police-training.jpg";
import imgDroneSolutions from "@/assets/drone-services-pillar.png";
import imgRdInnovation from "@/assets/rd-innovation.jpg";
import imgTechAdoption from "@/assets/tech-adoption.jpg";
import imgCmVisit1 from "@/assets/cm-exhibition-visit-1.jpg";
import imgCmVisit2 from "@/assets/cm-exhibition-visit-2.jpg";
import imgIndustryAgriculture from "@/assets/industry-agriculture.jpg";
import imgIndustryDefence from "@/assets/industry-defence.png";
import imgIndustrySurvey from "@/assets/industry-survey-construction.jpg";
import imgInnovationLab from "@/assets/rd-innovation.jpg";
import imgIndustryConstruction from "@/assets/industry-construction.png";
import imgIndustryGovt from "@/assets/industry-govt.png";
import imgAboutTrainPillar from "@/assets/about-train-pillar.jpg";
import imgAboutInnovatePillar from "@/assets/rd-lab-drone.jpg";
import imgIndustryEducation from "@/assets/industry-education.jpg";
import imgIndustryLogistics from "@/assets/industry-logistics.png";
import imgMpebInspection from "@/assets/mpeb-inspection.jpg";


const galleryRow1 = [
  {
    src: imgNflTraining,
    label: "NFL Corporate Training",
  },
  {
    src: imgHighway,
    label: "Highway Survey Ops",
  },
  {
    src: imgDroneFieldDemo,
    label: "Field Demonstration",
  },
  {
    src: imgAgriculture,
    label: "Precision Agriculture",
  },
  {
    src: imgExhibitionBooth,
    label: "National Exhibition Booth",
  },
  {
    src: imgNewsTearGas,
    label: "Media: Patrika News",
  },
  {
    src: imgStudentTraining,
    label: "Student Training Session",
  },
  {
    src: imgCmVisit1,
    label: "Hon'ble CM Dr. Mohan Yadav Inspecting UAV Tech",
  },
];

const galleryRow2 = [
  {
    src: imgSkilledWorkforce,
    label: "DGCA Certified Pilots",
  },
  {
    src: imgDroneDidiGroup,
    label: "Drone Didi Program",
  },
  {
    src: imgSolarThermalInspection,
    label: "Solar Plant Inspection",
  },
  {
    src: imgSimulationLab,
    label: "UAV R&D Simulation Lab",
  },
  {
    src: imgNewsForestSecurity,
    label: "Media: Forest Security",
  },
  {
    src: imgSimulatorTraining2,
    label: "Simulator Training Room",
  },
  {
    src: imgFieldTraining3,
    label: "Field Training",
  },
  {
    src: imgPoliceTraining,
    label: "Police & Security Training",
  },
  {
    src: imgCmVisit2,
    label: "Hon'ble CM Dr. Mohan Yadav at Soaring Aerotech Booth",
  },
];

function Marquee({
  items,
  reverse = false,
}) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 35, ease: "linear", repeat: Infinity }}
        className="flex gap-4 w-max"
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="relative w-72 h-48 rounded-2xl overflow-hidden shrink-0 group"
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[#111111]/0 group-hover:bg-[#111111]/40 transition-colors duration-300" />
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xs font-semibold font-mono bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {img.label}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return (
    <div ref={ref}>
      {count}
      {suffix}
    </div>
  );
}

const pillars = [
  {
    icon: <GraduationCap className="w-7 h-7" />,
    tag: "TRAIN",
    title: "DGCA Pilot Training",
    desc: "India's premier DGCA-approved RPTO offering 8 specialized drone pilot programs. Get your Remote Pilot Certificate and fly commercially.",
    points: [
      "DGCA Certified RPTO",
      "8 Specialized Programs",
      "RPC Certification",
      "Corporate Batches",
    ],
    img: imgAboutTrainPillar,
    link: "/training",
  },
  {
    icon: <Wrench className="w-7 h-7" />,
    tag: "SERVE",
    title: "Drone Services",
    desc: "End-to-end aerial solutions for government, enterprise, and defence. Survey, map, inspect, and surveil with precision-grade UAVs.",
    points: [
      "Survey & Mapping",
      "AI Surveillance",
      "Solar Inspection",
      "Agricultural Missions",
    ],
    img: imgDroneSolutions,
    link: "/services",
  },
  {
    icon: <Lightbulb className="w-7 h-7" />,
    tag: "INNOVATE",
    title: "R&D & Innovation",
    desc: "Cutting-edge research into disaster UAVs, AI/ML drone systems, tethered platforms, and advanced payload engineering.",
    points: [
      "Disaster UAVs",
      "AI/ML Systems",
      "Tethered Drones",
      "Quantum Research",
    ],
    img: imgAboutInnovatePillar,
    link: "/innovation-lab",
  },
  {
    icon: <Factory className="w-7 h-7" />,
    tag: "BUILD",
    title: "UAV Manufacturing",
    desc: "50,000 sq ft state-of-the-art facility producing indigenous defence drones, logistics UAVs, and custom platforms for national projects.",
    points: [
      "50,000 sq ft Facility",
      "Defence Drones",
      "Logistics UAVs",
      "International Collabs",
    ],
    img: imgManufacturing,
    link: "/about",
  },
];

const stats = [
  { target: 100, suffix: "+", label: "Pilots Trained", sub: "DGCA Certified" },
  {
    target: 50,
    suffix: "K sqft",
    label: "Manufacturing",
    sub: "State-of-the-Art Facility",
  },
  {
    target: 1000,
    suffix: "+",
    label: "Missions Completed",
    sub: "Pan India Deployments",
  },
  { target: 20, suffix: "+", label: "States Covered", sub: "National Footprint" },
];

const partners = [
  {
    name: "NHAI",
    full: "National Highways Authority of India",
    type: "Client",
    logo: logoNhai,
  },
  {
    name: "MPRDC",
    full: "MP Road Development Corporation",
    type: "Client",
    logo: logoMprdc,
  },
  {
    name: "MPEB",
    full: "MP Electricity Board",
    type: "Client",
    logo: logoMpeb,
  },
  {
    name: "IIT Indore",
    full: "Indian Institute of Technology, Indore",
    type: "Academic",
    logo: logoIitIndore,
  },
  {
    name: "IIT Gandhinagar",
    full: "Indian Institute of Technology, Gandhinagar",
    type: "Academic",
    logo: logoIitGandhinagar,
  },
  {
    name: "MP Police",
    full: "Madhya Pradesh Police",
    type: "Govt.",
  },
  {
    name: "Smart City",
    full: "Smart Cities Mission, Govt. of India",
    type: "Govt.",
  },
  {
    name: "DRDO",
    full: "Defence R&D Organisation",
    type: "Defence",
  },
  {
    name: "DGCA",
    full: "Directorate General of Civil Aviation",
    type: "Regulator",
    logo: logoDgca,
  },
  {
    name: "AIC Prestige",
    full: "Atal Incubation Centre — NITI Aayog",
    type: "Incubator",
    logo: logoAic,
  },
  {
    name: "Startup India",
    full: "Govt. of India Initiative",
    type: "Government",
    logo: logoDpiit,
  },
];

const projects = [
  {
    cat: "NHAI · SURVEY & MAPPING",
    title: "NHAI Highway Corridor Mapping",
    result: "200+ km mapped with ±2cm accuracy",
    img: imgHighway,
  },
  {
    cat: "MPRDC · ROAD SURVEY",
    title: "MPRDC State Highway Survey",
    result: "GIS-ready outputs delivered on schedule",
    img: imgMprdcProject,
  },
  {
    cat: "MPEB · INSPECTION",
    title: "MPEB Power Grid Inspection",
    result: "Fault detection without line shutdown",
    img: imgMpebInspection,
  },
  {
    cat: "GOVT. INITIATIVE",
    title: "Drone Didi — Women Pilot Program",
    result: "Rural women trained & deployed",
    img: imgDidiInitiative,
  },
  {
    cat: "SMART CITY · SURVEY",
    title: "Smart City Urban Survey",
    result: "3D city model for urban planning",
    img: imgSurveillance,
  },
];

const directors = [
  {
    name: "Mr. Himanshu Jain",
    role: "Director",
    quote:
      "We are building a complete drone innovation ecosystem — from R&D to manufacturing to defence applications.",
    img: photoHimanshu,
  },
  {
    name: "Dr Manojkumar Deshpande",
    role: "Director",
    quote:
      "Our 50,000 sq ft facility and active defence UAV R&D positions Soaring Aerotech as a full-cycle drone technology company.",
    img: photoManoj,
  },
];

const testimonials = [
  {
    name: "Rahul Verma",
    role: "DGCA Certified Pilot",
    text: "Cleared RPC in first attempt. Now flying commercially full-time in MP.",
    span: "md:col-span-2",
  },
  {
    name: "Sneha Patil",
    role: "Agricultural Drone Operator",
    text: "Connected my farming background with drone technology.",
    span: "",
  },
  {
    name: "Amit Kumar",
    role: "Engineering Graduate",
    text: "Real defence drone hardware access — nowhere else in Central India.",
    span: "",
  },
  {
    name: "Priya Desai",
    role: "GIS Analyst",
    text: "The mapping & GIS course gave me a career shift I didn't expect.",
    span: "md:col-span-2",
  },
];

const homeIndustries = [
  {
    label: "Agriculture & Farming",
    img: imgIndustryAgriculture,
    icon: <Tractor className="w-7 h-7" />,
  },
  {
    label: "Defence & Security",
    img: imgIndustryDefence,
    icon: <Shield className="w-7 h-7" />,
  },
  {
    label: "Survey & Mapping",
    img: imgIndustrySurvey,
    icon: <Map className="w-7 h-7" />,
  },
  {
    label: "Solar & Energy",
    img: imgSolarThermalInspection,
    icon: <Sun className="w-7 h-7" />,
  },
  {
    label: "Infrastructure",
    img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=1000&fit=crop",
    icon: <Building2 className="w-7 h-7" />,
  },
  {
    label: "Construction",
    img: imgIndustryConstruction,
    icon: <HardHat className="w-7 h-7" />,
  },
  {
    label: "Government & Smart Cities",
    img: imgIndustryGovt,
    icon: <Building className="w-7 h-7" />,
  },
  {
    label: "Power & Utilities",
    img: imgMpebInspection,
    icon: <Zap className="w-7 h-7" />,
  },
];

function IndustriesSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-12 sm:py-20 bg-white border-b border-border">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="text-center md:text-left mb-6 md:mb-12">
          <div className="section-label">WHO WE SERVE</div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-foreground">
            Industries We Power
          </h2>
        </div>

        {/* Mobile View: Compact circular selector and details */}
        <div className="block md:hidden overflow-hidden">
          {/* Horizontal scrollable row of circles */}
          <div className="flex overflow-x-auto gap-5 pb-4 px-1 scrollbar-none snap-x snap-mandatory mb-4">
            {homeIndustries.map((ind, i) => {
              const isActive = active === i;
              return (
                <div
                  key={i}
                  onClick={() => setActive(i)}
                  className="flex-shrink-0 w-20 flex flex-col items-center snap-center cursor-pointer"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 relative ${isActive
                      ? "border-primary bg-primary/8 text-primary shadow-lg shadow-primary/15 scale-105"
                      : "border-border bg-slate-50 text-foreground/50"
                      }`}
                  >
                    {isActive && (
                      <span className="absolute -inset-1 rounded-full border border-primary/20 animate-ping pointer-events-none" />
                    )}
                    <div className="scale-90">
                      {ind.icon}
                    </div>
                  </div>
                  <span
                    className={`text-center text-[10px] font-display font-semibold mt-2 leading-tight tracking-tight max-w-[75px] transition-colors duration-200 line-clamp-2 ${isActive ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                  >
                    {ind.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Compact Mobile Active Industry Card */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-50 border border-border rounded-2xl p-4 shadow-sm"
          >
            <div className="flex flex-row items-center gap-4">
              <img
                src={homeIndustries[active].img}
                alt={homeIndustries[active].label}
                className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
              />
              <div>
                <h3 className="font-display text-base text-foreground font-bold leading-tight">
                  {homeIndustries[active].label}
                </h3>
                <span className="text-[10px] text-primary/75 font-mono uppercase tracking-widest mt-1 block">
                  Sector {String(active + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-muted-foreground text-xs leading-relaxed">
                Empowering the {homeIndustries[active].label} sector through advanced, mission-specific UAV hardware, high-resolution geospatial analytics, and professional training solutions.
              </p>
              <Link href="/industries" className="w-full">
                <Button size="sm" className="w-full rounded-xl text-xs font-bold gap-2">
                  Explore Sector <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Desktop/Tablet View: Two-column layout (Numbered List + Image) */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-start">
          {/* Left: numbered list */}
          <div>
            <div className="divide-y divide-border">
              {homeIndustries.map((ind, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center justify-between py-4 text-left transition-colors ${active === i ? "text-foreground" : "text-foreground/35 hover:text-foreground/65"
                    }`}
                >
                  <div className="flex items-center gap-5">
                    <span
                      className={`text-xs font-mono tabular-nums ${active === i ? "text-primary" : "text-foreground/20"
                        }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-lg leading-tight ${active === i ? "font-semibold" : "font-normal"
                        }`}
                    >
                      {ind.label}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-opacity ${active === i ? "text-primary opacity-100" : "opacity-0"
                      }`}
                  />
                </button>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border">
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm"
              >
                View All 12 Industries <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: active image card */}
          <div className="sticky top-24">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl aspect-[4/3]"
            >
              <img
                src={homeIndustries[active].img}
                alt={homeIndustries[active].label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
              <div className="absolute top-5 left-5">
                <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                  INDUSTRY
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-3xl text-white leading-tight">
                  {homeIndustries[active].label}
                </h3>
                <p className="text-white/50 text-sm mt-2">
                  UAV intelligence solutions
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}

function UAVRadarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates for interactive parallax
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = ((e.clientY - rect.top) / height) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // UAV Targets
    const targets = [
      { id: "SA-HEXA MAPPING", x: -0.25, y: -0.2, alt: 120, speed: 12.5, active: true },
      { id: "SA-QUAD PATROL", x: 0.3, y: -0.25, alt: 85, speed: 8.2, active: true },
      { id: "RPTO INDORE", x: -0.35, y: 0.15, alt: 150, speed: 0, active: true },
      { id: "SA-LOGISTICS", x: 0.2, y: 0.2, alt: 210, speed: 22.4, active: true }
    ];

    let sweepAngle = 0;

    const draw = () => {
      // Smooth interpolation for mouse movement
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.38;

      // Parallax shift offsets
      const offsetX = mouse.x * 20;
      const offsetY = mouse.y * 20;

      // Draw Grid Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = offsetX % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Radar Concentric Circles
      ctx.strokeStyle = "rgba(239, 68, 68, 0.04)";
      ctx.lineWidth = 1;
      const circleCount = 3;
      for (let i = 1; i <= circleCount; i++) {
        const r = (maxRadius / circleCount) * i;
        ctx.beginPath();
        ctx.arc(centerX + offsetX * (i * 0.15), centerY + offsetY * (i * 0.15), r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.font = "8px 'Space Mono', monospace";
        ctx.fillText(`${(i * 100).toFixed(0)}m`, centerX + r + offsetX * (i * 0.15) + 5, centerY + offsetY * (i * 0.15) + 3);
      }

      // Sweep angle update
      sweepAngle = (sweepAngle + 0.007) % (Math.PI * 2);

      // Draw Radar Sweep Glow
      const sweepGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      sweepGrad.addColorStop(0, "rgba(239, 68, 68, 0.06)");
      sweepGrad.addColorStop(1, "rgba(239, 68, 68, 0.0)");

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle - 0.3, sweepAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Sweeping line pointer
      const sweepX = centerX + Math.cos(sweepAngle) * maxRadius;
      const sweepY = centerY + Math.sin(sweepAngle) * maxRadius;
      ctx.strokeStyle = "rgba(239, 68, 68, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Draw UAV Targets on Radar screen
      targets.forEach((target, index) => {
        const tX = centerX + target.x * maxRadius + offsetX * 0.4;
        const tY = centerY + target.y * maxRadius + offsetY * 0.4;

        // Angle of target relative to sweep line
        const targetAngle = Math.atan2(target.y * maxRadius, target.x * maxRadius);
        let normalizedTargetAngle = targetAngle < 0 ? targetAngle + Math.PI * 2 : targetAngle;

        let angleDiff = sweepAngle - normalizedTargetAngle;
        if (angleDiff < 0) angleDiff += Math.PI * 2;

        // Target glow effect fades as sweep moves away
        let opacity = 0;
        if (angleDiff < Math.PI / 2) {
          opacity = 1 - (angleDiff / (Math.PI / 2));
        } else {
          opacity = 0.12;
        }

        if (opacity > 0.05) {
          ctx.save();
          ctx.translate(tX, tY);

          // Draw target bounding box
          ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(-4, -4, 8, 8);

          // Center blinking dot
          const blink = Math.sin(Date.now() * 0.004 + index) > 0;
          ctx.fillStyle = blink ? `rgba(239, 68, 68, ${opacity * 0.9})` : `rgba(239, 68, 68, ${opacity * 0.3})`;
          ctx.fillRect(-1, -1, 2, 2);

          // Data labels
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.65})`;
          ctx.font = "8px 'Space Mono', monospace";
          ctx.fillText(target.id, 8, -1);

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.35})`;
          ctx.font = "7px 'Space Mono', monospace";
          ctx.fillText(`ALT: ${target.alt}m  SPD: ${target.speed}m/s`, 8, 7);

          ctx.restore();
        }
      });

      // Outer Compass Ring
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius + 12, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function Home() {
  const [telemetry, setTelemetry] = useState({
    altitude: 120.4,
    velocity: 14.8,
    lat: 22.7196,
    lng: 75.8577,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => ({
        altitude: parseFloat((120.0 + Math.sin(Date.now() / 1500) * 4.2).toFixed(1)),
        velocity: parseFloat((14.0 + Math.cos(Date.now() / 2000) * 1.5).toFixed(1)),
        lat: parseFloat((22.7196 + Math.sin(Date.now() / 5000) * 0.0005).toFixed(4)),
        lng: parseFloat((75.8577 + Math.cos(Date.now() / 6000) * 0.0005).toFixed(4)),
      }));
    }, 250);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#030712]">
      <SEO
        title="Home"
        description="Soaring Aerotech Pvt. Ltd. is India's leading DGCA-approved drone technology ecosystem, specializing in drone pilot training, aerospace manufacturing, and commercial UAV services."
        keywords="drone pilot training, DGCA approved, UAV services, drone manufacturer, agricultural drone, power grid inspection, highway mapping, Central India drone training"
      />
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-[75vh] sm:min-h-screen flex flex-col justify-center items-center pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden bg-[#030712] text-white">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-99"
        >
          <source src={videoDroneDescending} type="video/mp4" />
        </video>

        {/* Dark overlay to blend video with background and keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-[#030712]/80 to-[#030712] pointer-events-none z-0" />

        {/* Interactive Radar Background Canvas */}
        {/* <UAVRadarCanvas /> */}

        {/* Ambient lighting glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:60px_60px] opacity-40" />

          {/* Radial color backlights */}
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] opacity-40" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] opacity-30" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center max-w-6xl">

          {/* Live Operational Status Tag */}


          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight max-w-5xl mb-6 text-white"
          >
            Driving Drone{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-300 to-rose-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.15)]">
              Innovation, Training & Solutions
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-400 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed mb-6 sm:mb-12 font-medium tracking-wide uppercase font-mono"
          >
           Training - DGCA Approved • Research & Development • Manufacturing • Industry Drone Services
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-row items-center justify-center gap-3 mb-8 sm:mb-20 relative z-20 w-full max-w-sm sm:max-w-none mx-auto"
          >
            <Link href="/services" className="flex-1 sm:w-auto sm:flex-initial">
              <Button
                size="lg"
                className="w-full sm:w-auto h-11 sm:h-12 px-3 sm:px-8 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-primary text-white hover:bg-primary/95 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] transition-all duration-300 group flex items-center justify-center"
              >
                Explore Services{""}
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/training" className="flex-1 sm:w-auto sm:flex-initial">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-12 px-3 sm:px-8 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider border-white/10 text-white bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                Apply for Training
              </Button>
            </Link>
          </motion.div>

          {/* Futuristic Telemetry HUD Grid (Four Glassmorphic Stats Panels) */}


        </div>

        {/* Down Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-slate-500 hidden sm:block"
        >
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </motion.div>

      </section>

      {/* ── Trust bar marquee ────────────────────── */}
      <section className="py-3 bg-white border-b border-border overflow-hidden">
        <div
          className="flex w-max"
          style={{ animation: "trustMarquee 20s linear infinite" }}
        >
          {[...Array(4)].map((_, copy) => (
            <div key={copy} className="flex items-center shrink-0">
              {[
                "DGCA Approved RPTO",
                "Startup India Recognised",
                "AIC Prestige Incubated",
                "50,000 sq ft Facility",
                "Indore, Madhya Pradesh",
              ].map((label, i) => (
                <div key={i} className="flex items-center">
                  <span className="px-7 text-[11px] font-bold text-foreground/50 tracking-widest uppercase whitespace-nowrap">
                    {label}
                  </span>
                  <span className="text-primary text-xs select-none">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes trustMarquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── Stats ────────────────────────────────── */}
      <section className="bg-[#111111]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/8">
            {stats.map((s, i) => (
              <div
                key={i}
                className="py-8 px-2 sm:py-14 sm:px-8 text-center group hover:bg-white/5 transition-colors"
              >
                <div className="font-display text-3xl sm:text-5xl md:text-6xl text-white mb-2 group-hover:text-primary transition-colors">
                  <Counter target={s.target} suffix={s.suffix} />
                </div>
                <div className="text-white/60 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider md:tracking-widest">
                  {s.label}
                </div>
                <div className="text-white/25 text-[9px] sm:text-xs mt-1 leading-tight">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 Pillars ────────────────────────────── */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label">WHAT WE DO</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
                Four Pillars of Excellence
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                A complete drone ecosystem — training, services, R&D, and
                manufacturing under one roof.
              </p>
            </div>
          </div>
          <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((s, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] shrink-0 w-[80vw] max-w-[320px] sm:w-auto sm:max-w-none snap-center"
              >
                <img
                  src={s.img}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/10" />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                    {s.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">

                  <h3 className="font-display text-xl text-white leading-tight mb-2">
                    {s.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">
                    {s.desc}
                  </p>
                  <Link
                    href={s.link}
                    className="inline-flex items-center gap-1.5 text-white/70 text-sm hover:text-white transition-colors"
                  >
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manufacturing Showcase ────────────────── */}
      {/* <section className="py-20 bg-white border-y border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label">UAV MANUFACTURING</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-5">
                50,000 sq ft. Indigenous. Defence-Grade.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Soaring Aerotech isn't just a training company — we manufacture
                UAVs. Our facility produces indigenous logistics drones,
                surveillance UAVs, and custom defence platforms, with active R&D
                partnerships with DRDO and international collaborators.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-7">
                {[
                  { label: "Logistics Drones", val: "Long-range cargo UAVs" },
                  { label: "Defence Drones", val: "Surveillance & recon" },
                  { label: "Custom UAVs", val: "Payload-specific builds" },
                  { label: "Intl. Collabs", val: "Global partnerships" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-muted/30 hover:bg-muted/60 transition-colors rounded-2xl p-5 border border-border/80 shadow-sm"
                  >
                    <div className="text-xs text-primary font-mono font-bold uppercase tracking-wider mb-1">
                      {item.label}
                    </div>
                    <div className="text-sm text-foreground font-semibold">
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/about">
                <Button className="rounded-full px-8 h-12 font-bold">
                  See Our Facility <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                imgManufacturing,
                imgSimulationLab,
                imgExhibitionBooth,
                imgRdInnovation,
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative overflow-hidden rounded-2xl aspect-square"
                >
                  <img
                    src={img}
                    alt="Manufacturing"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* ── R&D Innovation ───────────────────────── */}
      <section className="py-20 bg-[#111111] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={imgInnovationLab}
                alt="R&D Lab"
                className="w-full h-56 sm:h-80 object-cover rounded-3xl"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            </div>
            <div>
              <div
                className="section-label"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                INNOVATION LAB
              </div>
              <h2 className="font-display text-xl sm:text-3xl md:text-4xl text-white mb-4">
                Building Next-Generation Drone Technologies
              </h2>
              <p className="text-white/50 leading-relaxed text-xs sm:text-sm mb-6">
                We build next-generation drone technology. Our Innovation Lab drives active research in disaster-response UAVs, AI/ML systems, and persistent platforms.
              </p>
              <div className="space-y-2 mb-6">
                {[
                  {
                    title: "Disaster Management UAVs",
                    desc: "Rapid deployment systems for flood, fire & search ops",
                  },
                  {
                    title: "AI/ML Autonomous Drones",
                    desc: "Computer vision & edge-AI for autonomous missions",
                  },
                  {
                    title: "Tethered Drone Platforms",
                    desc: "Persistent surveillance with unlimited flight time",
                  },
                  {
                    title: "Defence Payload Engineering",
                    desc: "Custom payloads for military & police applications",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-white/8 hover:border-primary/30 hover:bg-white/5 transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <div className="text-white/85 text-xs sm:text-sm font-bold">
                        {item.title}
                      </div>
                      <div className="text-white/40 text-[10px] sm:text-xs mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/innovation-lab">
                <Button className="rounded-full px-8 h-12 font-bold">
                  Explore Lab & R&D <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Project Case Studies ──────────────────── */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label">CASE STUDIES</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
                Real Missions. Real Impact.
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 text-primary font-bold text-sm"
            >
              All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border hover:shadow-xl transition-all hover:-translate-y-1 shrink-0 w-[80vw] max-w-[320px] sm:w-auto sm:max-w-none snap-center"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-base text-white leading-tight mb-1">
                      {p.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/projects">
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 font-bold"
              >
                View All Case Studies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Clients & Collaborations ─────────────── */}
      <section className="py-12 sm:py-20 bg-white border-b border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 mb-10">
          <div className="text-center">
            <div className="section-label justify-center">
              CLIENTS & COLLABORATIONS
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">
              Trusted by Government, Defence & Academia
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              From national highway authorities to IITs — India's most important
              organisations fly with Soaring Aerotech.
            </p>
          </div>
        </div>

        {/* Marquee Slider */}
        <div className="relative w-full overflow-hidden">
          {/* Side Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-4 w-max py-2"
            style={{ animation: "partnersMarquee 28s linear infinite" }}
          >
            {[...Array(3)].map((_, copy) => (
              <div key={copy} className="flex gap-4 shrink-0">
                {partners.map((p, i) => (
                  <div
                    key={i}
                    className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all cursor-default w-40 sm:w-44 min-h-[160px] shrink-0"
                  >
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 overflow-hidden">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#111111] flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                          <span className="text-white font-display text-[9px] font-black tracking-tight text-center leading-tight px-1">
                            {p.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center flex flex-col justify-between flex-1">
                      <div className="text-[10px] font-bold text-foreground/65 leading-snug">
                        {p.full}
                      </div>
                      <div className="text-[9px] font-mono text-primary/60 uppercase tracking-widest mt-1">
                        {p.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes partnersMarquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}</style>
      </section>

      {/* ── Industries we serve ───────────────────── */}
      <IndustriesSection />

      {/* ── Gallery marquee ──────────────────────── */}
      <section className="py-16 bg-slate-50 overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 md:px-6 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="section-label">GALLERY</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
                In Action
              </h2>
            </div>
            <Link
              href="/media"
              className="text-sm font-semibold text-primary hover:underline hidden md:block"
            >
              View all →
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <Marquee items={galleryRow1} />
          <Marquee items={galleryRow2} reverse />
        </div>
      </section>

      {/* ── Leadership ───────────────────────────── */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div>
              <div className="section-label">LEADERSHIP</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-4">
                The Visionaries Behind Soaring
              </h2>
              <p className="text-muted-foreground text-sm">
                Built by entrepreneurs who understand drone technology, Indian
                industry, and the future of autonomous systems.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
              {directors.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-muted/40 rounded-3xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1 w-full max-w-[320px] mx-auto md:ml-auto md:mr-0"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="font-display font-bold text-white text-base">
                        {d.name}
                      </div>
                      <div className="text-primary text-xs font-mono tracking-wide">
                        {d.role}, SOARING AEROTECH PVT. LTD.
                      </div>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="py-20 bg-slate-50 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="section-label mb-4">STUDENT SUCCESS</div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-10">
            What Our Pilots Say
          </h2>
          <div className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`${t.span} bg-white rounded-2xl p-7 border border-border relative overflow-hidden group hover:border-foreground/20 transition-colors hover:shadow-md shrink-0 w-[80vw] max-w-[320px] md:w-auto md:max-w-none snap-center`}
              >
                <div className="absolute top-4 right-6 font-display text-7xl text-foreground/5 leading-none select-none">
                  "
                </div>
                <Award className="w-5 h-5 text-primary mb-4 opacity-70" />
                <p className="text-foreground font-medium mb-5 leading-relaxed relative z-10">
                  "{t.text}"
                </p>
                <div className="font-bold text-sm text-foreground">
                  {t.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Recognition ────────────────────── */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label">MEDIA & PRESS</div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground">
                In the News
              </h2>
            </div>
            <Link
              href="/media"
              className="hidden md:inline-flex items-center gap-2 text-primary font-bold text-sm"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                outlet: "City Bhaskar",
                type: "Print Media",
                headline:
                  "Indore startup training India's drone pilots with DGCA approval",
                icon: <Newspaper className="w-5 h-5" />,
              },
              {
                outlet: "Yash Bharat",
                type: "News Channel",
                headline:
                  "Soaring Aerotech — Central India's drone technology pioneer",
                icon: <Tv className="w-5 h-5" />,
              },
              {
                outlet: "Dainik Bhaskar",
                type: "Print Media",
                headline:
                  "Drone Didi: Women trained as professional drone pilots in MP",
                icon: <Newspaper className="w-5 h-5" />,
              },
              {
                outlet: "TV Coverage",
                type: "Television",
                headline:
                  "Defence-grade UAV manufacturing facility launched in Indore",
                icon: <Tv className="w-5 h-5" />,
              },
            ].map((m, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border/85 bg-muted/40 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shrink-0 w-[80vw] max-w-[320px] sm:w-auto sm:max-w-none snap-center"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#111111] group-hover:bg-primary transition-colors flex items-center justify-center text-white shrink-0">
                    {m.icon}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">
                      {m.outlet}
                    </div>
                    <div className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">
                      {m.type}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground/65 leading-relaxed italic">
                  "{m.headline}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="relative py-14 sm:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571701374025-3eb9abc53de2?w=1800&h=700&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#111111]/90" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-3">
                Ready to Join
                <br />
                <span className="text-primary">India's Drone</span>
                <br />
                Revolution?
              </h2>
              <p className="text-white/40 text-sm max-w-sm">
                1000+ certified pilots. 1000+ missions. Defence-grade
                manufacturing. All from Central India.
              </p>
            </div>
            <div className="flex flex-row gap-3 w-full sm:w-auto max-w-sm">
              <Link href="/training" className="flex-1 sm:w-auto sm:flex-initial">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-14 px-4 sm:px-8 rounded-full text-sm sm:text-base font-bold flex items-center justify-center"
                >
                  Enroll Now
                </Button>
              </Link>
              <Link href="/contact" className="flex-1 sm:w-auto sm:flex-initial">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-14 px-4 sm:px-8 rounded-full text-sm sm:text-base font-semibold border-white/20 text-white hover:bg-white/10 flex items-center justify-center"
                >
                  Talk to Expert
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-6">
            {[
              {
                icon: <MapPin className="w-4 h-4 text-primary shrink-0" />,
                text: "AIC-Prestige Inspire Foundation, Prestige Vihar, Sector-D, Vijay Nagar, Scheme No 74C, Indore, Madhya Pradesh 452010",
              },
              {
                icon: <Phone className="w-4 h-4 text-primary shrink-0" />,
                text: "+91 78699 18736 / +91 78699 55418",
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-primary shrink-0" />,
                text: "DGCA Approved RPTO · Startup India · AIC Prestige",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-white/35 text-sm"
              >
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
