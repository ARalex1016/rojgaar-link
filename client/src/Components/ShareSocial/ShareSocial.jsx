import { motion } from "framer-motion";

// Lucide Icons
import { Share2 } from "lucide-react";

export const ShareSocial = ({ metadata }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: metadata?.title,
          text: metadata?.text,
          image: metadata?.image,
          url: metadata?.url,
        });
        console.log("Content shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.log("Web Share API not supported.");
    }
  };

  return (
    <>
      <motion.button
        variants={{
          initial: { scale: 0 },
          hover: { scale: 1.1 },
          tap: { scale: 0.9 },
        }}
        whileHover="hover"
        whileTap="tap"
        transition={{
          duration: 0.1,
          ease: "easeInOut",
        }}
        onClick={handleShare}
        className="text-blue-700 bg-neutral rounded-full border-2 border-transparent shadow-sm shadow-blue-700 fixed bottom-menuHeight right-2 z-30 p-2 transition-all duration-300 hover:bg-neutral hover:border-blue-700"
      >
        <Share2 size={18} />
      </motion.button>
    </>
  );
};
