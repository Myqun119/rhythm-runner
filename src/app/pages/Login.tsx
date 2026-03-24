import { motion } from "motion/react";
import { Music, User, Lock } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)",
      }}
    >
      <BackgroundDecorations />

      <div className="relative z-10 flex flex-col items-center h-full px-8 py-12">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Music size={28} className="text-[#FFD966]" fill="#FFD966" />
          <h2
            className="text-3xl"
            style={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #FFD966 0%, #4ECDC4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            节奏跑酷
          </h2>
        </motion.div>

        {/* 输入框区域 */}
        <motion.div
          className="w-full space-y-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* 账号输入框 */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#FFF8E7",
              border: "2px solid #FFB7B2",
              boxShadow: "0 4px 12px rgba(255, 183, 178, 0.2)",
            }}
          >
            <User size={20} className="text-[#4ECDC4]" />
            <input
              type="text"
              placeholder="请输入账号"
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>

          {/* 密码输入框 */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#FFF8E7",
              border: "2px solid #FFB7B2",
              boxShadow: "0 4px 12px rgba(255, 183, 178, 0.2)",
            }}
          >
            <Lock size={20} className="text-[#4ECDC4]" />
            <input
              type="password"
              placeholder="请输入密码"
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        </motion.div>

        {/* 登录按钮 */}
        <motion.button
          className="w-full py-4 rounded-full text-white mb-4"
          style={{
            backgroundColor: "#FFD966",
            boxShadow: "0 6px 16px rgba(255, 217, 102, 0.4)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => navigate("/menu")}
        >
          登录
        </motion.button>

        {/* 注册提示 */}
        <motion.p
          className="text-sm text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          还没有账号？
          <span
            className="text-[#4ECDC4] cursor-pointer ml-1"
            onClick={() => navigate("/register")}
          >
            立即注册
          </span>
        </motion.p>

        {/* 游客体验按钮 */}
        <motion.button
          className="w-full py-4 rounded-full"
          style={{
            backgroundColor: "transparent",
            border: "2px solid #4ECDC4",
            color: "#4ECDC4",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={() => navigate("/menu")}
        >
          游客体验
        </motion.button>
      </div>
    </div>
  );
}
