import { motion } from "motion/react";
import { Music, Settings, Gamepad2, Trophy, Map, Paintbrush, ChevronRight } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { GameCanvas } from "../components/GameCanvas";
import { useNavigate } from "react-router";
import { useState } from "react";

const menuItems = [
  {
    title: "开始游戏",
    icon: Gamepad2,
    color: "#FFD966",
    path: "/game-mode",
  },
  {
    title: "排行榜",
    icon: Trophy,
    color: "#4ECDC4",
    path: "/leaderboard",
  },
  {
    title: "地图工坊",
    icon: Map,
    color: "#FFB7B2",
    path: "/workshop",
  },
  {
    title: "我的创作",
    icon: Paintbrush,
    color: "#FFB088",
    path: "/profile",
  },
];

const recommendedMaps = [
  { id: 1, name: "热力节拍", creator: "音乐大师", image: "music colorful abstract" },
  { id: 2, name: "彩虹跑道", creator: "设计师小王", image: "rainbow gradient colorful" },
  { id: 3, name: "星空漫步", creator: "创作者123", image: "starry night sky abstract" },
];

export default function MainMenu() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return <GameCanvas onExit={() => setIsPlaying(false)} />;
  }

  return (
    <div
      className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)",
      }}
    >
      <BackgroundDecorations />

      <div className="relative z-10 flex flex-col h-full">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* 用户信息 */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/profile")}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#FFB7B2" }}
            >
              <span className="text-white text-lg">玩</span>
            </div>
            <span className="text-gray-700">玩家昵称</span>
          </motion.div>

          {/* 设置按钮 */}
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/settings")}
          >
            <Settings size={20} className="text-gray-600" />
          </motion.button>
        </div>

        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Music size={32} className="text-[#FFD966]" fill="#FFD966" />
          <h1
            className="text-4xl"
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
        </motion.div>

        {/* 主菜单按钮 */}
        <div className="px-6 space-y-4 mb-6">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.title}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-full text-white"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 6px 16px ${item.color}40`,
              }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              onClick={() => {
                if (item.title === "开始游戏") {
                  setIsPlaying(true);
                  return;
                }
                navigate(item.path);
              }}
            >
              <item.icon size={24} />
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronRight size={20} />
            </motion.button>
          ))}
        </div>

        {/* 今日推荐 */}
        <motion.div
          className="px-6 mt-auto mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="text-lg mb-3" style={{ color: "#4ECDC4" }}>
            今日推荐
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recommendedMaps.map((map, index) => (
              <motion.div
                key={map.id}
                className="flex-shrink-0 w-40 rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.7 }}
                onClick={() => navigate(`/map/${map.id}`)}
              >
                <div
                  className="w-full h-24"
                  style={{
                    background: `linear-gradient(135deg, ${menuItems[index % 4].color}, ${menuItems[(index + 1) % 4].color})`,
                  }}
                />
                <div className="p-3">
                  <p className="text-sm mb-1">{map.name}</p>
                  <p className="text-xs text-gray-500">{map.creator}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
