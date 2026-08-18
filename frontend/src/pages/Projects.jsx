import { motion } from "framer-motion";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import imgSurveillance from "@/assets/surveillance-project.png";
import imgHighway from "@/assets/nhai-project.png";
import imgAgriculture from "@/assets/agriculture-project.png";
import imgSolar from "@/assets/solar-project.png";
import imgSolarThermalInspection from "@/assets/solar-thermal-inspection.jpg";
import imgSimulationLab from "@/assets/simulation-lab-project.jpg";

export default function Projects() {
  const projects = [
    {
      title: "Industrial Facility Drone Surveillance",
      category: "Surveillance & Security",
      img: imgSurveillance,
      challenge: "A large industrial facility required continuous security monitoring across a wide perimeter, but deploying adequate ground-based security was cost-prohibitive and left significant blind spots.",
      solution: "Deployed a fleet of surveillance drones on automated patrol routes, providing 24/7 aerial monitoring with live feeds transmitted to the facility's security command center.",
    },
    {
      title: "Highway Corridor Survey & Mapping",
      category: "Survey & Mapping",
      img: imgHighway,
      challenge: "A major road expansion project required accurate topographic data across a 50km stretch, but heavy traffic made traditional surveying hazardous and time-consuming.",
      solution: "Deployed fixed-wing VTOL drones with PPK GNSS modules to capture high-resolution imagery, producing centimeter-accurate orthomosaics and elevation models without disrupting traffic.",
    },
    {
      title: "Precision Agriculture — Cotton Farms",
      category: "Agriculture Mapping",
      img: imgAgriculture,
      challenge: "A large cotton farm in Madhya Pradesh faced unexplained yield drops. Manual field inspection across 1000+ acres was physically impossible at the required scale and frequency.",
      solution: "Weekly multispectral drone flights generating NDVI and NDWI maps identified exact zones of water stress, soil variation, and early-stage pest infestation — enabling targeted intervention.",
    },
    {
      title: "Solar Plant Thermal Inspection",
      category: "Solar Inspection",
      img: imgSolarThermalInspection,
      challenge: "Manual inspection of a 200MW solar section was taking months, allowing faulty panels to continue generating energy losses without being identified or repaired.",
      solution: "Automated thermal drone mapping covered the entire installation in two days — identifying hotspots, string failures, diode faults, and soiling with precise GPS coordinates for repair teams.",
    },
    {
      title: "High-Altitude UAV Development & Testing",
      category: "UAV Manufacturing",
      img: imgSimulationLab,
      challenge: "Developing UAVs capable of reliable operation at high altitudes requires extensive field testing in low-pressure, low-temperature conditions that are difficult and expensive to simulate.",
      solution: "Soaring Aerotech's R&D team conducted high-altitude drone testing missions, validating airframe performance, motor efficiency, and electronics reliability for future defense and surveillance applications.",
    },
    {
      title: "Infrastructure Tower Inspection",
      category: "Infrastructure Inspection",
      img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&h=600&fit=crop",
      challenge: "Routine inspection of telecom and power transmission towers in mountainous terrain was dangerous for climbing crews and required expensive access equipment.",
      solution: "High-zoom payload drones flew systematic inspection routes along tower structures, detecting corrosion, loose hardware, and insulator damage from safe distances with GPS-tagged photographic evidence.",

    },
  ];

  return (
    <main className="min-h-screen pt-16 sm:pt-20">
      <SEO
        title="Case Studies & Projects"
        description="Explore Soaring Aerotech's real-world UAV deployments and projects. Read about our highway mapping surveys, solar inspections, surveillance operations, and drone agriculture missions."
        keywords="UAV case studies, drone projects, highway survey results, solar panel thermal scans, drone security deployments"
      />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="bg-[#F5F5F5] border-b border-border py-8 sm:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">REAL DEPLOYMENTS · MEASURABLE IMPACT</div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-4">
              Mission <span className="text-primary">Archives</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              From industrial surveillance and agricultural mapping to high-altitude UAV development — our field results speak for themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Projects ─────────────────────────────── */}
      <section className="py-6 sm:py-16 md:py-24 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-6 sm:space-y-12">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-border group hover:shadow-xl transition-shadow"
              >
                <div className={`relative h-48 sm:h-64 md:h-80 lg:h-auto lg:min-h-[320px] overflow-hidden ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <img src={project.img} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 to-transparent" />
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                    <span className="inline-flex px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white text-foreground font-mono text-[10px] sm:text-xs font-bold shadow-md">
                      {project.category.toUpperCase()}
                    </span>
                  </div>
                  {/* Result pills on image */}
                  <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex flex-wrap gap-1.5 sm:gap-2">
                    {(project.results ?? []).map((res, j) => (
                      <div key={j} className="bg-primary/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
                        {res.label}: {res.value}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-12 flex flex-col justify-center">
                  <h2 className="font-display text-lg sm:text-2xl md:text-3xl text-foreground mb-4 sm:mb-6">{project.title}</h2>
                  <div className="space-y-4 sm:space-y-5 mb-5 sm:mb-6">
                    <div>
                      <div className="section-label mb-1.5">THE CHALLENGE</div>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{project.challenge}</p>
                    </div>
                    <div>
                      <div className="section-label mb-1.5 mt-3 sm:mt-4">OUR SOLUTION</div>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{project.solution}</p>
                    </div>
                  </div>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm group/link">
                    Discuss Similar Project <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=500&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-3">Have a Complex Project?</h2>
          <p className="text-white/50 mb-6 max-w-lg mx-auto text-sm">
            Whether it's surveillance, mapping, inspection, or a custom UAV solution — contact our team to discuss your specific challenge.
          </p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full h-12 px-8 text-base font-semibold">Start a Conversation</Button>
          </Link>
        </div>
      </section>

    </main>
  );
}
