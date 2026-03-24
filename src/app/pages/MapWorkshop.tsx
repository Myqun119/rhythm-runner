import { motion } from "motion/react";
import { ArrowLeft, Search, Download, Star, Paintbrush } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useState } from "react";

const mapsList = [
  {
    id: 1,
    name: "彩虹跑道",
    creator: "设计师小王",
    downloads: 1250,
    rating: 4.8,
    difficulty: "简单",
    color: "#FFD966",
  },
  {
    id: 2,
    name: "星空漫步",
    creator: "创作者123",
    downloads: 980,
    rating: 4.9,
    difficulty: "中等",
    color: "#4ECDC4",
  },
  {
    id: 3,
    name: "节奏迷宫",
    creator: "音乐大师",
    downloads: 2340,
    rating: 4.7,
    difficulty: "困难",
    color: "#FFB7B2",
  },
  {
    id: 4,
    name: "梦幻森林",
    creator: "自然爱好者",
    downloads: 1560,
    rating: 4.6,
    difficulty: "简单",
    color: "#A8E6CF",
  },
  {
    id: 5,
    name: "未来都市",
    creator: "科幻迷",
    downloads: 1890,
    rating: 4.9,
    difficulty: "中等",
    color: "#FFB088",
  },
  {
    id: 6,
    name: "海底奇遇",
    creator: "海洋探险家",
    downloads: 1120,
    rating: 4.5,
    difficulty: "困难",
    color: "#9BD1E5",
  },
];

const filterOptions = ["热门", "最新", "最多下载", "我的收藏"];

export default function MapWorkshop() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("热门");

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "简单") return "#A8E6CF";
    if (difficulty === "中等") return "#FFD966";
    return "#FFB7B2";
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
                地图工坊
              </h2>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#FFD966",
                boxShadow: "0 4px 12px rgba(255, 217, 102, 0.3)",
              }}
              onClick={() => navigate("/editor")}
            >
              <Paintbrush size={20} className="text-white" />
            </button>
          </motion.div>

          {/* 搜索框 */}
          <motion.div
            className="flex items-center gap-3 px-4 py-3 rounded-full mb-4"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="搜索地图或创作者"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </motion.div>

          {/* 筛选栏 */}
          <motion.div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
                  activeFilter === filter ? "text-white" : "text-gray-600"
                }`}
                style={{
                  backgroundColor: activeFilter === filter ? "#4ECDC4" : "white",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>

        {/* 地图网格列表 */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {mapsList.map((map, index) => (
              <motion.div
                key={map.id}
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 * index + 0.3 }}
                onClick={() => navigate(`/map/${map.id}`)}
              >
                {/* 封面 */}
                <div
                  className="w-full h-32 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${map.color}, ${map.color}CC)`,
                  }}
                >
                  <span className="text-4xl">🎵</span>
                </div>

                {/* 信息 */}
                <div className="p-3">
                  <h3 className="text-sm mb-1 truncate">{map.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{map.creator}</p>

                  {/* 统计数据 */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Download size={12} />
                      <span>{map.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-[#FFD966]" fill="#FFD966" />
                      <span>{map.rating}</span>
                    </div>
                  </div>

                  {/* 难度标签 */}
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs text-white"
                    style={{
                      backgroundColor: getDifficultyColor(map.difficulty),
                    }}
                  >
                    {map.difficulty}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
