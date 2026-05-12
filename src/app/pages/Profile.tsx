import { motion } from "motion/react";
import { ArrowLeft, Edit, Download, Star, Plus, Trash2 } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useState } from "react";

const userMaps = [
  {
    id: 1,
    name: "我的第一张地图",
    downloads: 245,
    rating: 4.5,
    color: "#FFD966",
  },
  {
    id: 2,
    name: "节奏挑战",
    downloads: 678,
    rating: 4.8,
    color: "#4ECDC4",
  },
  {
    id: 3,
    name: "彩虹之路",
    downloads: 892,
    rating: 4.9,
    color: "#FFB7B2",
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"achievements" | "creations" | "favorites">(
    "creations"
  );

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
            className="flex items-center gap-3 mb-6"
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
              个人中心
            </h2>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {/* 个人资料卡片 */}
          <motion.div
            className="p-6 rounded-3xl mb-6"
            style={{
              backgroundColor: "white",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* 头像和基本信息 */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: "#FFB7B2" }}
              >
                🎮
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-1">玩家昵称</h3>
                <p className="text-sm text-gray-500 mb-3">
                  热爱音乐与节奏的跑酷玩家
                </p>
                <button
                  className="px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #4ECDC4",
                    color: "#4ECDC4",
                  }}
                >
                  <Edit size={16} />
                  编辑资料
                </button>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl mb-1" style={{ color: "#FFD966" }}>
                  1,234
                </div>
                <div className="text-xs text-gray-500">游玩次数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1" style={{ color: "#4ECDC4" }}>
                  95,430
                </div>
                <div className="text-xs text-gray-500">最高分</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1" style={{ color: "#FFB7B2" }}>
                  {userMaps.length}
                </div>
                <div className="text-xs text-gray-500">创作地图</div>
              </div>
            </div>
          </motion.div>

          {/* 标签页切换 */}
          <motion.div
            className="flex gap-2 mb-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              className={`flex-1 py-2 rounded-full text-sm transition-all ${activeTab === "achievements" ? "text-white" : "text-gray-600"
                }`}
              style={{
                backgroundColor: activeTab === "achievements" ? "#FFD966" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
              onClick={() => setActiveTab("achievements")}
            >
              我的战绩
            </button>
            <button
              className={`flex-1 py-2 rounded-full text-sm transition-all ${activeTab === "creations" ? "text-white" : "text-gray-600"
                }`}
              style={{
                backgroundColor: activeTab === "creations" ? "#4ECDC4" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
              onClick={() => setActiveTab("creations")}
            >
              我的创作
            </button>
            <button
              className={`flex-1 py-2 rounded-full text-sm transition-all ${activeTab === "favorites" ? "text-white" : "text-gray-600"
                }`}
              style={{
                backgroundColor: activeTab === "favorites" ? "#FFB7B2" : "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
              onClick={() => setActiveTab("favorites")}
            >
              我的收藏
            </button>
          </motion.div>

          {/* 我的创作列表 */}
          {activeTab === "creations" && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {userMaps.map((map, index) => (
                <motion.div
                  key={map.id}
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index + 0.4 }}
                >
                  {/* 封面 */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: map.color }}
                  >
                    <span className="text-2xl">🎵</span>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base mb-1 truncate">{map.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Download size={12} />
                        <span>{map.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-[#FFD966]" fill="#FFD966" />
                        <span>{map.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "#4ECDC420",
                        color: "#4ECDC4",
                      }}
                      onClick={() => navigate("/editor")}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "#FFB7B220",
                        color: "#FFB7B2",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* 战绩和收藏内容 */}
          {activeTab === "achievements" && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-6xl mb-4 block">🏆</span>
              <p className="text-gray-500">你的战绩将在这里显示</p>
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-6xl mb-4 block">⭐</span>
              <p className="text-gray-500">你的收藏将在这里显示</p>
            </motion.div>
          )}
        </div>

        {/* 创建新地图按钮 */}
        {activeTab === "creations" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-6 py-6"
            style={{
              background: "linear-gradient(to top, #FFF9E6 80%, transparent)",
            }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              className="w-full py-4 rounded-full text-white flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#FFD966",
                boxShadow: "0 6px 20px rgba(255, 217, 102, 0.5)",
              }}
              onClick={() => navigate("/profile/new-map")}
            >
              <Plus size={20} />
              <span>创建新地图</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
