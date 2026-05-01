import { Link } from "react-router-dom";
import { Gem, Instagram, Youtube, Twitter, Phone, Mail, MapPin } from "lucide-react";

const links = {
  Company: [
    { to: "/about",    l: "About Us"  },
    { to: "/services", l: "Services"  },
    { to: "/contact",  l: "Contact"   },
  ],
  Shop: [
    { to: "/shop",                      l: "All Jewellery" },
    { to: "/shop?category=rings",       l: "Rings"         },
    { to: "/shop?category=necklaces",   l: "Necklaces"     },
    { to: "/shop?category=earrings",    l: "Earrings"      },
  ],
  Support: [
    { to: "/faqs",          l: "FAQs"               },
    { to: "/legal#terms",   l: "Terms & Conditions" },
    { to: "/legal#privacy", l: "Privacy Policy"     },
    { to: "/legal#returns", l: "Returns"            },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-obsidian-950 text-obsidian-300">
      {/* Top CTA strip */}
      <div className="border-b border-obsidian-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <p className="section-tag text-gold-400">Exclusive Collections</p>
            <h3 className="font-display text-2xl sm:text-3xl text-white">Crafted for every occasion</h3>
          </div>
          <Link to="/shop" className="btn-gold shrink-0 text-sm">Explore the Collection</Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                <Gem className="w-4 h-4 text-obsidian-900" />
              </div>
              <span className="font-display text-xl text-white">
                Savitri <span className="text-gold-400">Jewels</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-obsidian-400 max-w-xs mb-6">
              A family-owned jewellery house with over 50 years of handcrafted tradition.
              Each piece tells a story of heritage, artistry, and timeless elegance.
            </p>
            <div className="space-y-2.5 text-sm">
              {[
                { Icon: Phone,  text: "+91 6207 855 397" },
                { Icon: Mail,   text: "contact@savitrijewels.com" },
                { Icon: MapPin, text: "Buxar, Bihar — Varanasi, UP" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-obsidian-400">
                  <Icon className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-white font-medium mb-4 text-xs uppercase tracking-widest">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(({ to, l }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-obsidian-400 hover:text-gold-400 transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gold-divider mt-10 sm:mt-12" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-obsidian-500 text-center sm:text-left">
            © {new Date().getFullYear()} Savitri Jewellers. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Instagram, Youtube, Twitter].map((Icon, i) => (
              <a key={i} href="#"
                className="w-8 h-8 rounded-full border border-obsidian-700 flex items-center justify-center text-obsidian-400 hover:border-gold-500 hover:text-gold-400 transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
