import { motion } from "framer-motion";
import { Play, Github, Mail, Phone, MapPin, Award } from "lucide-react";
import { experience, projects, skills, profile } from "../data/resume";
import Card from "../components/Card";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.targetId) {
      const element = document.getElementById(location.state.targetId);
      if (element) {
        // Add a small delay to ensure the element is rendered and layout is stable
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      // Clear the state so it doesn't scroll again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <>
      {/* Hero Section */}
      <motion.div
        id="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative -mx-8 -mt-8 mb-8 p-8 pb-12 bg-gradient-to-b from-indigo-900/80 to-[#121212]"
      >
        <div className="flex flex-col gap-6 pt-10">
          <div className="flex items-end gap-6 flex-wrap">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-52 h-52 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-8xl rounded-sm shrink-0"
            >
              👨‍💻
            </motion.div>
            <div className="flex flex-col gap-2 mb-2">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="uppercase text-xs font-bold tracking-wider text-white"
              >
                Profile
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter shadow-lg"
              >
                {profile.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/90 text-sm font-medium mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" /> {profile.title}
                </span>
                <span className="hidden md:inline w-1 h-1 bg-white rounded-full"></span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-6 mb-10"
      >
        <motion.a
          whileHover={{ scale: 1.05, borderColor: "white", color: "white" }}
          whileTap={{ scale: 0.95 }}
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A7A7A7] border border-[#727272] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <Github className="w-5 h-5" />
          GitHub
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05, borderColor: "white", color: "white" }}
          whileTap={{ scale: 0.95 }}
          href={`mailto:${profile.email}`}
          className="text-[#A7A7A7] border border-[#727272] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          Contact Me
        </motion.a>
      </motion.div>

      <div className="space-y-12">
        {/* Experience Section */}
        <section id="experience">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
              Working Experience
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {experience.map((job) => (
              <Card
                key={job.id}
                title={job.role}
                subtitle={`${job.company} • ${job.period.split(" - ")[0]}`}
                description={job.description}
                type="work"
                imageColor={job.color}
                logo={job.logo}
              />
            ))}
          </motion.div>
        </section>

        {/* Playground Section */}
        <section id="playground">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
              Playground
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {projects.map((project) => (
              <Card
                key={project.id}
                title={project.title}
                subtitle={project.description}
                type="project"
                imageColor={project.color}
                link={project.link}
              />
            ))}
          </motion.div>
        </section>

        {/* Skills & Certifications Section */}
        <section id="skills">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Skills & Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#181818] p-6 rounded-lg">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  Technical Skills
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#B3B3B3] text-sm mb-2">Frontend</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.frontend.map((s) => (
                        <span key={s} className="bg-[#282828] text-white text-xs px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[#B3B3B3] text-sm mb-2">Backend</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.backend.map((s) => (
                        <span key={s} className="bg-[#282828] text-white text-xs px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[#B3B3B3] text-sm mb-2">Cloud & DB</p>
                    <div className="flex flex-wrap gap-2">
                      {[...skills.cloud, ...skills.database].map((s) => (
                        <span key={s} className="bg-[#282828] text-white text-xs px-2 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#181818] p-6 rounded-lg">
                <h3 className="text-white font-bold mb-4">Certifications & Education</h3>
                <div className="space-y-4">
                  {skills.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#1DB954]" />
                      <span className="text-white text-sm">{cert}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#282828] pt-4 mt-4">
                    <p className="text-[#B3B3B3] text-xs uppercase tracking-widest mb-1">
                      Education
                    </p>
                    <p className="text-white font-medium">{profile.education}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="pb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white mb-6"
          >
            Contact
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="bg-[#181818] p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-[#282828] transition-colors group"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white">Let's work together</h3>
              <p className="text-[#A7A7A7]">
                I'm always open to discussing new projects, creative ideas or opportunities to be
                part of your visions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${profile.email}`}
                className="bg-white text-black font-bold px-8 py-3 rounded-full flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Me
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, borderColor: "white" }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="border border-[#727272] text-white font-bold px-8 py-3 rounded-full flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub
              </motion.a>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}

export default Home;
