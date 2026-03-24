import { motion } from "motion/react";
import { Trophy, Target, Zap, TrendingUp } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";

export default function GameOver() {
  const navigate = useNavigate();
  const score = 92340;
  const highScore = 95430;
  const maxCombo = 156;
  const obstaclesPassed = 234;
  const accuracy = 94;

  const getRating = () => {
    if (score >= 95000) return { text: "节奏大师！", emoji: "🏆", color: "#FFD966" };
    if (score >= 90000) return { text: "还不错哦", emoji: "🎵", color: "#4ECDC4" };
    return { text: "继续加油", emoji: "💪", color: "#FFB7B2" };
  };

  const rating = getRating();

  return (
    <div
      className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)",
      }}
    >
      {/* 庆祝效果装饰 */}
      <BackgroundDecorations />
      
      {/* 彩带装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-16 rounded-full"
            style={{
              backgroundColor: ["#FFD966", "#4ECDC4", "#FFB7B2"][i % 3],
              left: `${Math.random() * 100}%`,
              top: -100,
            }}
            animate={{
              y: [0, 1000],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* 游戏结束标题 */}
        <motion.h1
          className="text-3xl mb-4"
          style={{ fontWeight: 700, color: rating.color }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          游戏结束
        </motion.h1>

        {/* 得分显示 */}
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-7xl mb-2" style={{ color: "#FFD966" }}>
            {score.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            最高分: {highScore.toLocaleString()}
          </div>
        </motion.div>

        {/* 评价 */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-4xl">{rating.emoji}</span>
          <span className="text-2xl" style={{ color: rating.color }}>
            {rating.text}
          </span>
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          className="w-full grid grid-cols-3 gap-3 mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Zap size={24} className="mx-auto mb-2" style={{ color: "#FFD966" }} />
            <div className="text-xl mb-1">{maxCombo}</div>
            <div className="text-xs text-gray-500">最高连击</div>
          </div>

          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Target size={24} className="mx-auto mb-2" style={{ color: "#4ECDC4" }} />
            <div className="text-xl mb-1">{obstaclesPassed}</div>
            <div className="text-xs text-gray-500">通过障碍</div>
          </div>

          <div
            className="p-4 rounded-2xl text-center"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <TrendingUp size={24} className="mx-auto mb-2" style={{ color: "#FFB7B2" }} />
            <div className="text-xl mb-1">{accuracy}%</div>
            <div className="text-xs text-gray-500">命中率</div>
          </div>
        </motion.div>

        {/* 按钮 */}
        <motion.div
          className="w-full flex gap-3"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            className="flex-1 py-4 rounded-full text-white flex items-center justify-center gap-2"
            style={{
              backgroundColor: "#FFD966",
              boxShadow: "0 6px 20px rgba(255, 217, 102, 0.5)",
            }}
            onClick={() => navigate("/music-select")}
          >
            <Trophy size={20} />
            <span>再玩一次</span>
          </button>
          <button
            className="flex-1 py-4 rounded-full flex items-center justify-center gap-2"
            style={{
              backgroundColor: "transparent",
              border: "2px solid #4ECDC4",
              color: "#4ECDC4",
            }}
            onClick={() => navigate("/menu")}
          >
            返回主菜单
          </button>
        </motion.div>
      </div>
    </div>
  );
}
