import { motion } from "motion/react";
import { ArrowLeft, Trophy, Medal, Filter } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useState } from "react";

const leaderboardData = [
  { rank: 1, name: "节奏大师", score: 99850, avatar: "🏆" },
  { rank: 2, name: "音乐精灵", score: 98720, avatar: "🎵" },
  { rank: 3, name: "跑酷之王", score: 97650, avatar: "⚡" },
  { rank: 4, name: "节拍猎人", score: 96540, avatar: "🎯" },
  { rank: 5, name: "旋律追逐者", score: 95430, avatar: "🌟" },
  { rank: 6, name: "当前玩家", score: 92340, avatar: "🎮", isCurrent: true },
  { rank: 7, name: "音符收集者", score: 91230, avatar: "🎪" },
  { rank: 8, name: "韵律舞者", score: 90120, avatar: "💃" },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"global" | "friends" | "music">("global");

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FFD966";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "#4ECDC4";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={24} className="text-[#FFD966]" fill="#FFD966" />;
    if (rank === 2) return <Medal size={24} className="text-[#C0C0C0]" fill="#C0C0C0" />;
    if (rank === 3) return <Medal size={24} className="text-[#CD7F32]" fill="#CD7F32" />;
    return null;
  };

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
            className="flex items-center justify-between mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
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
                排行榜
              </h2>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Filter size={20} className="text-gray-600" />
            </button>
          </motion.div>

          {/* 标签页切换 */}
          <motion.div
            className="flex gap-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <button
              className={`flex-1 py-2 rounded-full text-sm transition-all ${
                activeTab === "global" ? "text-white" : "text-gray-600"
              }`}
              style={{
                backgroundColor: activeTab === "global" ? "#FFD966" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setActiveTab("global")}
            >
              全球排行
            </button>
            <button
              className={`flex-1 py-2 rounded-full text-sm transition-all ${
                activeTab === "friends" ? "text-white" : "text-gray-600"
              }`}
              style={{
                backgroundColor: activeTab === "friends" ? "#4ECDC4" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setActiveTab("friends")}
            >
              好友排行
            </button>
            <button
              className={`flex-1 py-2 rounded-full text-sm transition-all ${
                activeTab === "music" ? "text-white" : "text-gray-600"
              }`}
              style={{
                backgroundColor: activeTab === "music" ? "#FFB7B2" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setActiveTab("music")}
            >
              音乐排行
            </button>
          </motion.div>
        </div>

        {/* 排行榜列表 */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="space-y-3">
            {leaderboardData.map((player, index) => (
              <motion.div
                key={player.rank}
                className={`flex items-center gap-4 p-4 rounded-2xl ${
                  player.isCurrent ? "ring-4 ring-[#FFD966] ring-offset-2" : ""
                }`}
                style={{
                  backgroundColor: player.isCurrent ? "#FFF9E6" : "white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index + 0.2 }}
              >
                {/* 排名 */}
                <div className="w-12 flex items-center justify-center">
                  {getRankIcon(player.rank) || (
                    <span
                      className="text-lg"
                      style={{ color: getRankColor(player.rank) }}
                    >
                      #{player.rank}
                    </span>
                  )}
                </div>

                {/* 头像 */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: getRankColor(player.rank) + "20",
                  }}
                >
                  {player.avatar}
                </div>

                {/* 名称和分数 */}
                <div className="flex-1">
                  <p className="text-base mb-1">{player.name}</p>
                  <p className="text-sm" style={{ color: getRankColor(player.rank) }}>
                    {player.score.toLocaleString()}分
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 我的排名卡片 */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-6 py-6"
          style={{
            background: "linear-gradient(to top, #FFF9E6 80%, transparent)",
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              backgroundColor: "#FFD966",
              boxShadow: "0 6px 20px rgba(255, 217, 102, 0.5)",
            }}
          >
            <div className="w-12 flex items-center justify-center">
              <span className="text-lg text-white">#6</span>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-white">
              🎮
            </div>
            <div className="flex-1">
              <p className="text-base text-white mb-1">当前玩家</p>
              <p className="text-sm text-white opacity-90">92,340分</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
