import { motion } from "framer-motion";
import { Section } from "../ui";
import { Gem, Heart, Award, Users, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

const fadeUp = (delay=0) => ({ initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.7,delay} });

// ── ABOUT ────────────────────────────────────────────────────────────────────
export function About() {
  const team = [
    { name:"Savitri Devi",     role:"Founder & Master Artisan", initials:"SD" },
    { name:"Rajesh Verma",     role:"Gold Specialist",           initials:"RV" },
    { name:"Priyanshu Verma",  role:"Design Director",           initials:"PV" },
  ];
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="bg-obsidian-950 py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.p {...fadeUp(0)} className="section-tag text-gold-400 mb-3">Our Story</motion.p>
          <motion.h1 {...fadeUp(0.1)} className="font-display text-6xl text-white mb-6">Fifty Years of<br /><em className="text-gold-400">Pure Craft</em></motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-obsidian-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Founded in 1975 in Buxar, Bihar, Savitri Jewellers began as a small family workshop.
            Today we serve customers across India with the same passion, precision, and personal touch.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <Section tag="Our Values" title="What drives us" className="bg-cream">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { Icon: Gem,   title: "Purity",    desc: "Every piece hallmark-certified." },
            { Icon: Heart, title: "Heritage",  desc: "Rooted in 50 years of craft." },
            { Icon: Award, title: "Quality",   desc: "No compromise, ever." },
            { Icon: Users, title: "Community", desc: "Built on lasting relationships." },
          ].map(({ Icon, title, desc }, i) => (
            <motion.div key={title} {...fadeUp(i*0.1)} className="card p-6 text-center">
              <div className="w-12 h-12 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-display text-xl mb-2">{title}</h3>
              <p className="text-obsidian-500 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section tag="The Team" title="Meet our artisans" className="bg-ivory">
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map(({ name, role, initials }, i) => (
            <motion.div key={name} {...fadeUp(i*0.1)} className="card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 font-display text-2xl mx-auto mb-4 shadow-gold">
                {initials}
              </div>
              <h3 className="font-display text-xl">{name}</h3>
              <p className="text-obsidian-400 text-sm mt-1">{role}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── SERVICES ─────────────────────────────────────────────────────────────────
export function Services() {
  const services = [
    { title:"Custom Design",        desc:"Work with our artisans to create a bespoke piece tailored to your vision, metal choice, and budget." },
    { title:"Jewellery Repair",      desc:"Expert repair of broken clasps, missing stones, bent bands, and more. Quick turnaround guaranteed." },
    { title:"Gold Exchange",         desc:"Trade-in your old gold jewellery for its current market value, applied towards your new purchase." },
    { title:"Hallmarking & Sizing",  desc:"Certified hallmarking and precise resizing for rings, bangles, and necklaces." },
    { title:"Cleaning & Polishing",  desc:"Restore the original brilliance of your jewellery with our professional ultrasonic cleaning." },
    { title:"Gift Wrapping",         desc:"Complimentary luxury gift wrapping and personalised message cards for every order." },
  ];
  return (
    <div className="overflow-hidden">
      <section className="bg-obsidian-950 py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.p {...fadeUp(0)} className="section-tag text-gold-400 mb-3">What We Offer</motion.p>
          <motion.h1 {...fadeUp(0.1)} className="font-display text-6xl text-white">Our Services</motion.h1>
        </div>
      </section>
      <Section tag="Services" title="Everything you need" className="bg-cream">
        <div className="grid md:grid-cols-3 gap-5">
          {services.map(({ title, desc }, i) => (
            <motion.div key={title} {...fadeUp(i*0.08)} className="card p-7">
              <div className="w-2 h-2 rounded-full bg-gold-500 mb-4" />
              <h3 className="font-display text-2xl mb-3">{title}</h3>
              <p className="text-obsidian-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── CONTACT ──────────────────────────────────────────────────────────────────
export function Contact() {
  const branches = [
    { city:"Buxar, Bihar",          address:"Main Road, Near City Centre", phone:"+91 6207 855 397" },
    { city:"Varanasi, Uttar Pradesh", address:"Lanka Road, Near BHU Gate", phone:"+91 6207 855 397" },
  ];
  return (
    <div className="overflow-hidden">
      <section className="bg-obsidian-950 py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.p {...fadeUp(0)} className="section-tag text-gold-400 mb-3">Get in Touch</motion.p>
          <motion.h1 {...fadeUp(0.1)} className="font-display text-6xl text-white">Contact Us</motion.h1>
        </div>
      </section>
      <Section className="bg-cream">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {branches.map(({ city, address, phone }, i) => (
            <motion.div key={city} {...fadeUp(i*0.1)} className="card p-8">
              <h3 className="font-display text-2xl mb-5">{city}</h3>
              <div className="space-y-3 text-sm text-obsidian-600">
                <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" /><span>{address}</span></div>
                <div className="flex items-center gap-3"><Phone  className="w-4 h-4 text-gold-500 shrink-0" /><a href={`tel:${phone}`} className="hover:text-gold-600 transition-colors">{phone}</a></div>
                <div className="flex items-center gap-3"><Mail   className="w-4 h-4 text-gold-500 shrink-0" /><a href="mailto:contact@savitrijewels.com" className="hover:text-gold-600 transition-colors">contact@savitrijewels.com</a></div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── FAQS ─────────────────────────────────────────────────────────────────────
export function FAQs() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"Are all your products hallmark certified?", a:"Yes, every gold piece carries a BIS hallmark certificate guaranteeing purity." },
    { q:"Can I customise a piece?",                  a:"Absolutely. Visit any of our stores or contact us online to start a custom order." },
    { q:"How long does shipping take?",              a:"5–7 business days within India. Express delivery available for select cities." },
    { q:"What is your return policy?",               a:"7-day hassle-free returns on all items in original condition and packaging." },
    { q:"Do you offer EMI options?",                 a:"Yes, no-cost EMI available on orders above ₹10,000 via major credit cards." },
    { q:"How do I track my order?",                  a:"Log in to your account and visit 'My Orders' for real-time tracking updates." },
  ];
  return (
    <div className="overflow-hidden">
      <section className="bg-obsidian-950 py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.p {...fadeUp(0)} className="section-tag text-gold-400 mb-3">Help Centre</motion.p>
          <motion.h1 {...fadeUp(0.1)} className="font-display text-6xl text-white">FAQs</motion.h1>
        </div>
      </section>
      <Section className="bg-cream">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div key={q} {...fadeUp(i*0.05)} className="card overflow-hidden">
              <button className="w-full flex items-center justify-between p-6 text-left" onClick={() => setOpen(open===i?null:i)}>
                <span className="font-medium text-obsidian-800 pr-4">{q}</span>
                <ChevronDown className={`w-4 h-4 text-gold-500 shrink-0 transition-transform ${open===i?"rotate-180":""}`} />
              </button>
              {open === i && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} className="px-6 pb-6">
                  <p className="text-obsidian-500 text-sm leading-relaxed border-t border-obsidian-100 pt-4">{a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── LEGAL ────────────────────────────────────────────────────────────────────
export function Legal() {
  const sections = [
    { id:"terms",   title:"Terms & Conditions", body:"By using our website or placing an order, you agree to our terms. All content, designs, and images are proprietary to Savitri Jewellers. Unauthorised reproduction is strictly prohibited." },
    { id:"privacy", title:"Privacy Policy",      body:"We collect only the information necessary to process your order. Your personal data is never sold or shared with third parties. All transactions are secured with 256-bit SSL encryption." },
    { id:"cookies", title:"Cookies",             body:"We use cookies to enhance your browsing experience and understand user behaviour. You may manage or disable cookies through your browser settings at any time." },
    { id:"returns", title:"Returns & Refunds",   body:"We accept returns within 7 days of delivery for unused items in original packaging. Custom-made pieces are non-refundable. Refunds are processed within 5–7 business days." },
    { id:"report",  title:"Report an Issue",     body:"Found a problem with an order or our website? Email us at support@savitrijewels.com and we'll respond within 24 hours." },
  ];
  return (
    <div className="min-h-screen bg-cream py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="section-tag mb-2">Legal</p>
        <h1 className="font-display text-5xl text-obsidian-900 mb-10">Policies & Legal</h1>
        <div className="space-y-6">
          {sections.map(({ id, title, body }) => (
            <div key={id} id={id} className="card p-8 scroll-mt-28">
              <h2 className="font-display text-3xl mb-4">{title}</h2>
              <div className="gold-divider mb-4" />
              <p className="text-obsidian-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
