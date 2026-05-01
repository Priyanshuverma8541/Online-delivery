import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Truck, RefreshCw } from "lucide-react";
import { Section } from "../ui";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
});

const categories = [
  { name: "Rings",     img: "https://cdn.augrav.com/online/jewels/2025/08/04103420/1-1-680x680.jpg",   slug: "rings" },
  { name: "Necklaces", img: "https://cdn.quicksell.co/-MJFwWnWKT0Tg2Lb63Bv/products/-OAHvhgnqdrU9aQu7Eog.jpg", slug: "necklaces" },
  { name: "Earrings",  img: "https://cdn.augrav.com/online/jewels/2022/11/28105859/2-11.jpg",          slug: "earrings" },
  { name: "Bangles",   img: "https://bangarurani.com/cdn/shop/files/processed-5_1_cd177966-6954-46c1-956a-023191cb26cb.png?v=1720278224", slug: "bangles" },
];

const testimonials = [
  { name: "Priya Sharma", rating: 5, text: "Absolutely stunning craftsmanship. The gold necklace exceeded every expectation. Will definitely be back!" },
  { name: "Anjali Mehta",  rating: 5, text: "Savitri Jewels made my wedding unforgettable. The bridal set was everything I dreamed of." },
  { name: "Ravi Kapoor",   rating: 5, text: "Top-notch quality and timely delivery. My wife's birthday gift was perfect!" },
];

const features = [
  { Icon: Shield,    title: "Certified Purity", desc: "All gold and diamond pieces carry hallmark certification." },
  { Icon: Truck,     title: "Free Delivery",    desc: "Complimentary shipping on orders above ₹5,000 across India." },
  { Icon: RefreshCw, title: "Easy Returns",     desc: "Hassle-free 7-day returns. Your satisfaction is guaranteed." },
  { Icon: Star,      title: "Lifetime Service", desc: "Free cleaning and re-polishing for all our jewellery." },
];

const heroImages = [
  "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80",
  "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=800&q=80",
];

export default function Home() {
  return (
    <div className="overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-obsidian-950 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] bg-gold-500/10 rounded-full blur-[80px] lg:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 lg:w-[400px] h-48 sm:h-80 lg:h-[400px] bg-gold-600/8 rounded-full blur-[60px] lg:blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 lg:gap-16 items-center py-20 sm:py-28 w-full">
          {/* Text */}
          <div className="text-center md:text-left">
            <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-6 sm:mb-8 justify-center md:justify-start">
              <div className="h-px w-8 sm:w-12 bg-gold-500" />
              <span className="text-gold-400 font-mono text-xs tracking-[0.2em] uppercase">Est. 1975 · Buxar, India</span>
            </motion.div>

            <motion.h1 {...fadeUp(0.1)}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.05] mb-6 sm:mb-8">
              Where Gold<br />
              <em className="text-gold-400 not-italic">Meets Soul</em>
            </motion.h1>

            <motion.p {...fadeUp(0.2)}
              className="text-obsidian-300 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-md mx-auto md:mx-0">
              Fifty years of heritage craftsmanship. Every ring, necklace, and bangle
              handcrafted to carry your story for generations.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
              <Link to="/shop" className="btn-gold text-base px-8 py-3.5 sm:px-9 sm:py-4 justify-center">
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about"
                className="flex items-center justify-center gap-2 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full text-base font-medium text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-all">
                Our Story
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.4)}
              className="flex items-center gap-6 sm:gap-8 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-obsidian-800 justify-center md:justify-start">
              {[["2K+","Happy Customers"],["500+","Unique Designs"],["50+","Years of Craft"]].map(([num, label]) => (
                <div key={label} className="text-center md:text-left">
                  <p className="font-display text-2xl sm:text-3xl text-gold-400">{num}</p>
                  <p className="text-[10px] sm:text-xs text-obsidian-400 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Images collage – hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:grid grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-3 lg:space-y-4">
              <div className="img-zoom rounded-2xl overflow-hidden h-48 lg:h-64">
                <img src={heroImages[0]} alt="jewellery" className="w-full h-full object-cover" />
              </div>
              <div className="img-zoom rounded-2xl overflow-hidden h-32 lg:h-40">
                <img src={heroImages[1]} alt="jewellery" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="mt-8 lg:mt-10">
              <div className="img-zoom rounded-2xl overflow-hidden h-56 lg:h-72">
                <img src={heroImages[2]} alt="jewellery" className="w-full h-full object-cover" />
              </div>
              <div className="mt-3 lg:mt-4 p-3 lg:p-4 rounded-2xl bg-obsidian-900 border border-obsidian-700">
                <p className="font-mono text-xs text-gold-400 mb-0.5">Featured</p>
                <p className="font-display text-white text-base lg:text-lg">Bridal Collection '25</p>
                <p className="text-obsidian-400 text-xs mt-0.5">Starting from ₹12,999</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES BAR ─────────────────────────────────── */}
      <div className="bg-gold-gradient py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-obsidian-900/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-obsidian-900" />
              </div>
              <div>
                <p className="font-medium text-obsidian-900 text-xs sm:text-sm">{title}</p>
                <p className="text-obsidian-700 text-xs leading-snug mt-0.5 hidden sm:block">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <Section tag="Collections" title="Shop by Category" className="bg-cream">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {categories.map(({ name, img, slug }, i) => (
            <motion.div key={name} {...fadeUp(i * 0.1)}>
              <Link to={`/shop?category=${slug}`} className="group block">
                <div className="img-zoom rounded-xl sm:rounded-2xl overflow-hidden aspect-[3/4] shadow-card mb-2 sm:mb-3">
                  <img src={img} alt={name} className="w-full h-full object-cover group-hover:brightness-105 transition-all" />
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="font-display text-base sm:text-xl text-obsidian-800">{name}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-500 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── MARQUEE ──────────────────────────────────────── */}
      <div className="bg-obsidian-950 py-4 sm:py-5 overflow-hidden border-y border-obsidian-800">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 sm:gap-12 whitespace-nowrap">
          {Array(4).fill(["Gold Rings ✦","Diamond Necklaces ✦","Bridal Sets ✦","Silver Bangles ✦","Ear Studs ✦","Pendants ✦"]).flat().map((t, i) => (
            <span key={i} className="font-display text-base sm:text-lg text-obsidian-400 tracking-wide">{t}</span>
          ))}
        </motion.div>
      </div>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <Section tag="Reviews" title="Loved by thousands" className="bg-ivory">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map(({ name, rating, text }, i) => (
            <motion.div key={name} {...fadeUp(i * 0.1)} className="card p-5 sm:p-7">
              <div className="flex gap-1 mb-3 sm:mb-4">
                {Array(rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-obsidian-600 leading-relaxed mb-4 sm:mb-5 text-sm">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 text-xs font-bold shrink-0">
                  {name[0]}
                </div>
                <span className="font-medium text-sm text-obsidian-800">{name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="bg-obsidian-950 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.p {...fadeUp(0)} className="section-tag text-gold-400 mb-3">Begin your journey</motion.p>
          <motion.h2 {...fadeUp(0.1)} className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-4 sm:mb-6">
            Find your perfect piece
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-obsidian-400 mb-8 sm:mb-10 text-base sm:text-lg">
            Explore our full catalogue of handcrafted gold, diamond, and silver jewellery.
          </motion.p>
          <motion.div {...fadeUp(0.3)}>
            <Link to="/shop" className="btn-gold text-base px-8 sm:px-10 py-3.5 sm:py-4">
              Shop All Jewellery <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
