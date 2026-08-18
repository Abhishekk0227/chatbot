import { Link } from "wouter";
import { Facebook, Instagram, LinkedinIcon, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111111] pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-6" data-testid="link-footer-logo">
              <img src="/logo.png" alt="Soaring Aerotech" className="h-14 w-auto" />
            </Link>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              India's premier drone technology ecosystem company. We build, innovate, and train the future of aerospace.
            </p>
            <div className="text-xs font-mono text-white/60">
              DGCA Approved | Startup India | Registered Pvt. Ltd.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 font-sans tracking-wide">QUICK LINKS</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Drone Training", href: "/training" },
                { name: "Drone Services", href: "/services" },
                { name: "Case Projects", href: "/projects" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-primary transition-colors text-sm" data-testid={`link-footer-${link.name.toLowerCase().replace(" ", "-")}`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6 font-sans tracking-wide">RESOURCES</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: "Industries", href: "/industries" },
                { name: "Media & PR", href: "/media" },
                { name: "Blog", href: "/blog" },
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 hover:text-primary transition-colors text-sm" data-testid={`link-footer-resource-${link.name.toLowerCase().replace(" ", "-")}`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 font-sans tracking-wide">CONTACT</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  AIC-Prestige Inspire Foundation<br />
                  Prestige Vihar, Sector-D, Vijay Nagar, Scheme No 74C<br />
                  Indore, Madhya Pradesh 452010
                </span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+917869918736" className="hover:text-primary transition-colors">+91 78699 18736</a>
                  <a href="tel:+917869955418" className="hover:text-primary transition-colors">+91 78699 55418</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="mailto:info@soaringaerotech.com" className="hover:text-primary transition-colors">info@soaringaerotech.com</a>
                  <a href="mailto:business@soaringaerotech.com" className="hover:text-primary transition-colors">business@soaringaerotech.com</a>
                </div>
              </li>
            </ul>

            <div className="flex items-center gap-4 mt-8">
              <a href="https://www.facebook.com/profile.php?id=61554855101815&sk=about_places" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-primary hover:border-primary transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/soaring_aerotech" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-primary hover:border-primary transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/soaring-aerotech/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-primary hover:border-primary transition-all">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Soaring Aerotech Pvt. Ltd. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
