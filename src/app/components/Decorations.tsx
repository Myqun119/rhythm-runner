import { motion } from "motion/react";
import { Music, Cloud, Circle } from "lucide-react";

export function FloatingMusic() {
  return (
    <>
      <motion.div
        className="absolute top-[10%] left-[10%] text-[#FFD966] opacity-60"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Music size={24} fill="#FFD966" />
      </motion.div>
      <motion.div
        className="absolute top-[25%] right-[15%] text-[#4ECDC4] opacity-60"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Music size={20} fill="#4ECDC4" />
      </motion.div>
      <motion.div
        className="absolute bottom-[30%] left-[20%] text-[#FFB7B2] opacity-60"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Music size={18} fill="#FFB7B2" />
      </motion.div>
      <motion.div
        className="absolute bottom-[15%] right-[25%] text-[#FFD966] opacity-60"
        animate={{
          y: [0, -22, 0],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Music size={22} fill="#FFD966" />
      </motion.div>
    </>
  );
}

export function FloatingClouds() {
  return (
    <>
      <motion.div
        className="absolute top-[5%] right-[20%] text-white opacity-50"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Cloud size={60} fill="white" strokeWidth={0} />
      </motion.div>
      <motion.div
        className="absolute top-[60%] left-[5%] text-white opacity-40"
        animate={{
          x: [0, -15, 0],
          y: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Cloud size={50} fill="white" strokeWidth={0} />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] right-[10%] text-white opacity-45"
        animate={{
          x: [0, 18, 0],
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Cloud size={55} fill="white" strokeWidth={0} />
      </motion.div>
    </>
  );
}

export function FloatingDots() {
  return (
    <>
      <motion.div
        className="absolute top-[15%] left-[15%] text-[#FFB7B2] opacity-50"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Circle size={12} fill="#FFB7B2" />
      </motion.div>
      <motion.div
        className="absolute top-[40%] right-[20%] text-[#4ECDC4] opacity-50"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Circle size={10} fill="#4ECDC4" />
      </motion.div>
      <motion.div
        className="absolute bottom-[35%] left-[25%] text-[#FFD966] opacity-50"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Circle size={14} fill="#FFD966" />
      </motion.div>
      <motion.div
        className="absolute bottom-[10%] right-[30%] text-[#FFB7B2] opacity-50"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Circle size={11} fill="#FFB7B2" />
      </motion.div>
    </>
  );
}

export function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingClouds />
      <FloatingMusic />
      <FloatingDots />
    </div>
  );
}
