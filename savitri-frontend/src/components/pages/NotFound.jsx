import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gem } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
        <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-6">
          <Gem className="w-10 h-10 text-gold-500" />
        </div>
        <h1 className="font-display text-8xl text-gold-400 mb-2">404</h1>
        <h2 className="font-display text-3xl text-obsidian-900 mb-4">Page Not Found</h2>
        <p className="text-obsidian-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-gold">Back to Home</Link>
      </motion.div>
    </div>
  );
}
