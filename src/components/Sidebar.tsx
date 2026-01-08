import { Home, Briefcase, Code, PlusSquare, Heart, Award } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { skills } from "../data/resume";
import { useNavigate, useLocation } from "react-router-dom";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { targetId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-64 bg-black h-full flex flex-col gap-2 pt-6">
      <div className="px-6 mb-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => handleNavigation("hero")}
          className="flex items-center gap-2 mb-6 cursor-pointer"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-black text-xl">J</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">James Hu</span>
        </motion.div>

        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          <motion.div
            variants={itemVariants}
            onClick={() => handleNavigation("hero")}
            className="flex items-center gap-4 text-[#B3B3B3] hover:text-white transition-colors group cursor-pointer"
          >
            <Home className="w-6 h-6" />
            <span className="font-bold">Home</span>
          </motion.div>
          <motion.div
            variants={itemVariants}
            onClick={() => handleNavigation("experience")}
            className="flex items-center gap-4 text-[#B3B3B3] hover:text-white transition-colors group cursor-pointer"
          >
            <Briefcase className="w-6 h-6" />
            <span className="font-bold">Experience</span>
          </motion.div>
          <motion.div
            variants={itemVariants}
            onClick={() => handleNavigation("playground")}
            className="flex items-center gap-4 text-[#B3B3B3] hover:text-white transition-colors group cursor-pointer"
          >
            <Code className="w-6 h-6" />
            <span className="font-bold">Playground</span>
          </motion.div>
          <motion.div
            variants={itemVariants}
            onClick={() => handleNavigation("skills")}
            className="flex items-center gap-4 text-[#B3B3B3] hover:text-white transition-colors group cursor-pointer"
          >
            <Award className="w-6 h-6" />
            <span className="font-bold">Skills</span>
          </motion.div>
        </motion.nav>
      </div>

      <div className="mt-2 pt-2 px-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 px-4"
        >
          <div
            onClick={() => handleNavigation("contact")}
            className="flex items-center gap-4 text-[#B3B3B3] hover:text-white transition-colors group cursor-pointer"
          >
            <div className="bg-white/10 p-1 rounded-sm group-hover:bg-white group-hover:text-black transition-colors">
              <PlusSquare className="w-6 h-6" />
            </div>
            <span className="font-bold">Contact</span>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 mt-4 scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border-t border-[#282828] pt-4 flex flex-col gap-3"
        >
          <p className="text-xs text-[#B3B3B3] font-bold tracking-widest uppercase mb-2">
            My Stack
          </p>
          {[...skills.frontend, ...skills.backend].slice(0, 8).map((skill) => (
            <span
              key={skill}
              className="text-[#B3B3B3] text-sm hover:text-white cursor-pointer transition-colors truncate"
              title={skill}
            >
              {skill}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
