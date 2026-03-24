import { motion } from "motion/react";
import { Map, Shuffle, ArrowLeft } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";

export default function GameMode() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)",
      }}
    >
      <BackgroundDecorations />

      <div className="relative z-10 flex flex-col h-full px-6 py-12">
        {/* 标题 */}
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/menu")}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl" style={{ fontWeight: 700, color: "#4ECDC4" }}>
            选择游戏模式
          </h2>
        </motion.div>

        {/* 模式卡片 */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          {/* 固定地图模式 */}
          <motion.div
            className="relative p-6 rounded-3xl cursor-pointer overflow-hidden"
            style={{
              backgroundColor: "#FFD966",
              boxShadow: "0 8px 24px rgba(255, 217, 102, 0.4)",
            }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onClick={() => navigate("/music-select")}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  <Map size={28} className="text-white" />
                </div>
                <h3 className="text-2xl text-white">固定地图</h3>
              </div>
              <p className="text-white text-sm opacity-90">
                经典玩法，地图固定不变
              </p>
              <p className="text-white text-sm opacity-90 mt-1">
                挑战极限，突破最高分！
              </p>
            </div>
            {/* 装饰图案 */}
            <div
              className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full opacity-20"
              style={{ backgroundColor: "white" }}
            />
          </motion.div>

          {/* 随机地图模式 */}
          <motion.div
            className="relative p-6 rounded-3xl cursor-pointer overflow-hidden"
            style={{
              backgroundColor: "#4ECDC4",
              boxShadow: "0 8px 24px rgba(78, 205, 196, 0.4)",
            }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => navigate("/music-select")}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  <Shuffle size={28} className="text-white" />
                </div>
                <h3 className="text-2xl text-white">随机地图</h3>
              </div>
              <p className="text-white text-sm opacity-90">
                每次体验都不同
              </p>
              <p className="text-white text-sm opacity-90 mt-1">
                音乐驱动，自动生成地图！
              </p>
            </div>
            {/* 装饰图案 */}
            <div
              className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full opacity-20"
              style={{ backgroundColor: "white" }}
            />
          </motion.div>
        </div>

        {/* 返回按钮 */}
        <motion.button
          className="w-full py-4 rounded-full mt-8"
          style={{
            backgroundColor: "transparent",
            border: "2px solid #FFB7B2",
            color: "#FFB7B2",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() => navigate("/menu")}
        >
          返回
        </motion.button>
      </div>
    </div>
  );
}
