import { motion } from "motion/react";
import { Music, User } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3秒后自动跳转到登录页
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden cursor-pointer"
      onClick={() => navigate("/login")}
      style={{
        background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)",
      }}
    >
      <BackgroundDecorations />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Logo区域 */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative mb-8">
            {/* 环绕装饰 */}
            <motion.div
              className="absolute -top-8 -left-8"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Music size={32} className="text-[#FFD966]" fill="#FFD966" />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-8"
              animate={{
                y: [0, -8, 0],
                rotate: [0, -15, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Music size={28} className="text-[#4ECDC4]" fill="#4ECDC4" />
            </motion.div>

            {/* 主标题 */}
            <h1
              className="text-6xl mb-2"
              style={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #FFD966 0%, #4ECDC4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              节奏跑酷
            </h1>

            {/* 奔跑小人装饰 */}
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2"
              animate={{
                x: [-20, 20, -20],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <User size={24} className="text-[#FFB7B2]" />
            </motion.div>
          </div>
        </motion.div>

        {/* 加载动画 */}
        <motion.div
          className="mt-20 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#FFD966]"
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* 提示文字 */}
        <motion.div
          className="absolute bottom-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-[#FFB7B2]">点击任意区域进入</p>
        </motion.div>
      </div>
    </div>
  );
}
