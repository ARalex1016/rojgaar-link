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
          hover: { scale: 1.05 },
          tap: { scale: 0.9 },
        }}
        whileHover="hover"
        whileTap="tap"
        onClick={handleShare}
        className="text-red.80 bg-neutral/80 rounded-full fixed bottom-menuHeight right-2 z-30 p-2 hover:text-red hover:bg-neutral"
      >
        <Share2 size={18} />
      </motion.button>
    </>
  );
};
