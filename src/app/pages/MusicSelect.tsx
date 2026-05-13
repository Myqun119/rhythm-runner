import { motion } from "motion/react";
import { ArrowLeft, Play, Star, Clock } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useState } from "react";

const musicList = [
  {
    id: 1,
    title: "电子迷幻",
    artist: "DJ Remix",
    difficulty: 4,
    duration: "3:24",
    color: "#FFD966",
  },
  {
    id: 2,
    title: "流行跳跃",
    artist: "Pop Star",
    difficulty: 2,
    duration: "2:58",
    color: "#4ECDC4",
  },
  {
    id: 3,
    title: "摇滚狂欢",
    artist: "Rock Band",
    difficulty: 5,
    duration: "4:12",
    color: "#FFB7B2",
  },
  {
    id: 4,
    title: "古典优雅",
    artist: "Orchestra",
    difficulty: 3,
    duration: "3:45",
    color: "#FFB088",
  },
  {
    id: 5,
    title: "嘻哈节奏",
    artist: "Hip Hop Crew",
    difficulty: 4,
    duration: "3:18",
    color: "#A8E6CF",
  },
];

export default function MusicSelect() {
  const navigate = useNavigate();
  const [selectedMusic, setSelectedMusic] = useState(1);
  const [activeTab, setActiveTab] = useState<"local" | "online">("local");

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
        <div className="px-6 py-4">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate("/game-mode")}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-2xl" style={{ fontWeight: 700, color: "#4ECDC4" }}>
              选择音乐
            </h2>
          </motion.div>

          {/* 标签页切换 */}
          <motion.div
            className="flex gap-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <button
              className={`flex-1 py-2 rounded-full transition-all ${activeTab === "local" ? "text-white" : "text-gray-600"
                }`}
              style={{
                backgroundColor: activeTab === "local" ? "#FFD966" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setActiveTab("local")}
            >
              本地音乐
            </button>
            <button
              className={`flex-1 py-2 rounded-full transition-all ${activeTab === "online" ? "text-white" : "text-gray-600"
                }`}
              style={{
                backgroundColor: activeTab === "online" ? "#4ECDC4" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setActiveTab("online")}
            >
              在线曲库
            </button>
          </motion.div>
        </div>

        {/* 音乐列表 */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="space-y-3">
            {musicList.map((music, index) => (
              <motion.div
                key={music.id}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${selectedMusic === music.id ? "ring-4 ring-offset-2" : ""
                  }`}
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  ringColor: selectedMusic === music.id ? "#FFD966" : "transparent",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.2 }}
                onClick={() => setSelectedMusic(music.id)}
              >
                <div className="flex items-center gap-3">
                  {/* 音乐封面 */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: music.color }}
                  >
                    <Play size={24} className="text-white" fill="white" />
                  </div>

                  {/* 音乐信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base mb-1 truncate">{music.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{music.artist}</p>
                    <div className="flex items-center gap-3">
                      {/* 难度星级 */}
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < music.difficulty ? "text-[#FFD966]" : "text-gray-300"}
                            fill={i < music.difficulty ? "#FFD966" : "none"}
                          />
                        ))}
                      </div>
                      {/* 时长 */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{music.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 开始游戏按钮 */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-6 py-6"
          style={{
            background: "linear-gradient(to top, #FFF9E6 80%, transparent)",
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            className="w-full py-4 rounded-full text-white"
            style={{
              backgroundColor: "#FFD966",
              boxShadow: "0 6px 20px rgba(255, 217, 102, 0.5)",
            }}
            onClick={() => navigate("/game")}
          >
            开始游戏
          </button>
        </motion.div>
      </div>
    </div>
  );
}
