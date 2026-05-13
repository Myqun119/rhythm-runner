import { motion } from "motion/react";
import { ArrowLeft, Download, Star, User, Music, Clock, MessageCircle, Heart } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getMapById, updateMapDownloads, getCurrentUser, syncFavorites } from "../../utils/db";

const comments = [
  {
    id: 1,
    user: "音乐爱好者",
    content: "超级好玩的地图，节奏感很强！",
    rating: 5,
    avatar: "🎵",
  },
  {
    id: 2,
    user: "跑酷高手",
    content: "难度适中，适合新手练习",
    rating: 4,
    avatar: "⚡",
  },
  {
    id: 3,
    user: "创作者",
    content: "设计很巧妙，学习了！",
    rating: 5,
    avatar: "🎨",
  },
];

export default function MapDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [map, setMap] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const user = getCurrentUser();

  useEffect(() => {
    const loadMap = async () => {
      if (!id) return;
      const data = await getMapById(id);
      if (data) setMap(data);
    };
    loadMap();
  }, [id]);

  useEffect(() => {
    const loadFavoriteInfo = async () => {
      if (!id) return;

      try {
        const countRes = await fetch(`http://localhost:3001/api/maps/${id}/favorites`);
        const countData = await countRes.json();
        setFavoritesCount(countData.favoritesCount || 0);
      } catch (error) {
        console.error("获取收藏数失败:", error);
      }

      if (user) {
        try {
          const favRes = await fetch(`http://localhost:3001/api/favorites/${user.userId}`);
          const favorites = await favRes.json();
          setIsFavorited(favorites.includes(id));
        } catch (error) {
          console.error("获取收藏状态失败:", error);
        }
      }
    };

    loadFavoriteInfo();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("请先登录");
      navigate("/login");
      return;
    }

    try {
      if (isFavorited) {
        await fetch(`http://localhost:3001/api/maps/${id}/unfavorite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId }),
        });
        setIsFavorited(false);
        setFavoritesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await fetch(`http://localhost:3001/api/maps/${id}/favorite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId }),
        });
        setIsFavorited(true);
        setFavoritesCount((prev) => prev + 1);
      }

      await syncFavorites();
    } catch (error) {
      console.error("收藏操作失败:", error);
    }
  };

  if (!map) return null;

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
        <div className="px-6 py-4 flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/workshop")}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </motion.button>
          <motion.h2
            className="text-xl"
            style={{ fontWeight: 700, color: "#4ECDC4" }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            地图详情
          </motion.h2>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          {/* 封面大图 */}
          <motion.div
            className="w-full h-48 rounded-3xl mb-6 flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${map.color || "#FFD966"}, #4ECDC4)`,
              boxShadow: "0 8px 24px rgba(255, 217, 102, 0.3)",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-6xl">🎵</span>
            <button
              onClick={handleToggleFavorite}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md"
            >
              <Heart
                size={20}
                className={isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"}
              />
            </button>
          </motion.div>

          {/* 地图信息 */}
          <motion.div
            className="mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl mb-2">{map.name}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <User size={16} />
              <span className="text-sm">{map.creator}</span>
            </div>

            {/* 统计数据 */}
            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-2">
                <Download size={18} className="text-[#4ECDC4]" />
                <span className="text-sm">{map.downloads || 0}次下载</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-red-400" />
                <span className="text-sm">{favoritesCount}收藏</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-[#FFD966]" fill="#FFD966" />
                <span className="text-sm">{map.rating || 0}分</span>
              </div>
            </div>

            {/* 难度标签 */}
            <div
              className="inline-block px-4 py-2 rounded-full text-sm text-white"
              style={{ backgroundColor: "#A8E6CF" }}
            >
              自定义地图
            </div>
          </motion.div>

          {/* 地图描述 */}
          <motion.div
            className="p-4 rounded-2xl mb-6"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-base mb-2" style={{ color: "#4ECDC4" }}>
              地图描述
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              这是一张由玩家原创的自定义节奏地图，跟随音乐的节奏闯关挑战！
            </p>
          </motion.div>

          {/* 音乐信息 */}
          <motion.div
            className="p-4 rounded-2xl mb-6"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-base mb-3" style={{ color: "#4ECDC4" }}>
              配乐信息
            </h3>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#FFD966" }}
              >
                <Music size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1">电子迷幻</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>3:24</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 评论区 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-base mb-3" style={{ color: "#4ECDC4" }}>
              玩家评论
            </h3>
            <div className="space-y-3 mb-4">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  className="p-4 rounded-2xl"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index + 0.7 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: "#FFB7B220" }}
                    >
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{comment.user}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < comment.rating ? "text-[#FFD966]" : "text-gray-300"
                              }
                              fill={i < comment.rating ? "#FFD966" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 写评论 */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-full"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <MessageCircle size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="写下你的评论..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </motion.div>
        </div>

        {/* 底部按钮 */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-6 py-6"
          style={{
            background: "linear-gradient(to top, #FFF9E6 80%, transparent)",
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-3">
            <button
              className="flex-1 py-4 rounded-full text-white"
              style={{
                backgroundColor: "#FFD966",
                boxShadow: "0 6px 20px rgba(255, 217, 102, 0.5)",
              }}
              onClick={async () => {
                await updateMapDownloads(id!);
                navigate("/game-mode");
              }}
            >
              立即体验
            </button>
            <button
              className="flex-1 py-4 rounded-full"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #4ECDC4",
                color: "#4ECDC4",
              }}
              onClick={async () => {
                const result = await updateMapDownloads(id!);
                if (result.success) {
                  alert(`地图 "${map.name}" 下载成功！`);
                  navigate("/game-mode");
                } else {
                  alert("下载失败");
                }
              }}
            >
              下载地图
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
