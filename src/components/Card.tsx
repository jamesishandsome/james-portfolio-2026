import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const Card = ({
  title,
  subtitle,
  type,
  imageColor,
  description,
  link,
  logo,
}: {
  title: string;
  subtitle: string;
  type: "work" | "project";
  imageColor: string;
  description?: string;
  link?: string;
  logo?: string;
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (link) {
      if (link.startsWith("http")) {
        window.open(link, "_blank");
      } else {
        navigate(link);
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors duration-300 cursor-pointer group relative min-h-[280px] flex flex-col"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div
        className={`h-40 ${imageColor} rounded-md mb-4 shadow-lg relative overflow-hidden flex items-center justify-center shrink-0`}
      >
        {logo && !imgError ? (
          <img
            src={logo}
            alt={title}
            className="w-20 h-20 object-contain drop-shadow-lg"
            onError={() => setImgError(true)}
          />
        ) : type === "work" ? (
          <span className="text-4xl drop-shadow-lg filter">💼</span>
        ) : (
          <span className="text-4xl drop-shadow-lg filter">🚀</span>
        )}

        {/* Play Button Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-2 right-2 bg-[#1DB954] text-black rounded-full p-3 shadow-xl"
        >
          <Play fill="black" className="w-5 h-5 ml-0.5" />
        </motion.div>
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg mb-1 truncate" title={title}>
          {title}
        </h3>
        <p className="text-[#A7A7A7] text-sm font-medium mb-2">{subtitle}</p>
        {description && (
          <p className="text-[#A7A7A7] text-xs line-clamp-3 mt-auto">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
