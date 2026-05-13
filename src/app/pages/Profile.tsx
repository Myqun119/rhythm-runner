import { motion } from "motion/react";
import { ArrowLeft, Edit, Download, Star, Plus, Trash2, Heart } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getCurrentUser, updateNickname, getUserMaps, deleteMap } from "../../utils/db";

export default function Profile() {
  const user = getCurrentUser();
  const [newNickname, setNewNickname] = useState(user?.nickname || "");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"achievements" | "creations" | "favorites">(
    "creations"
  );
  const [userMaps, setUserMaps] = useState<any[]>([]);
  const [favoriteMaps, setFavoriteMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  const loadUserMaps = async () => {
    setLoading(true);
    const maps = await getUserMaps();
    setUserMaps(maps);
    setLoading(false);
  };

  const loadFavoriteMaps = async () => {
    if (!user) return;
    setLoadingFavorites(true);
    try {
      const favRes = await fetch(`http://localhost:3001/api/favorites/${user.userId}`);
      const favoriteIds = await favRes.json();

      const mapsRes = await fetch("http://localhost:3001/api/maps");
      const allMaps = await mapsRes.json();

      const favorites = allMaps.filter((m: any) => favoriteIds.includes(m.id));
      setFavoriteMaps(favorites);
    } catch (error) {
      console.error("加载收藏地图失败:", error);
      setFavoriteMaps([]);
    }
    setLoadingFavorites(false);
  };

  useEffect(() => {
    if (activeTab === "creations") {
      loadUserMaps();
    } else if (activeTab === "favorites") {
      loadFavoriteMaps();
    }
  }, [activeTab]);

  const handleSaveNickname = async () => {
    if (!user) return;
    await updateNickname(user.username, newNickname);
    alert("昵称修改成功！");
    setIsEditing(false);
    window.location.reload();
  };

  const handleDeleteMap = async (mapId: string) => {
    if (!window.confirm("确定要删除这张地图吗？")) return;
    await deleteMap(mapId);
    loadUserMaps();
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
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: "#FFB7B2" }}
              >
                🎮
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-1">{user?.nickname || "游客"}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  账号：{user?.username || "未登录"}
                </p>
                <button
                  className="px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #4ECDC4",
                    color: "#4ECDC4",
                  }}
                  onClick={() => {
                    setNewNickname(user?.nickname || "");
                    setIsEditing(true);
                  }}
                >
                  <Edit size={16} />
                  编辑资料
                </button>
              </div>
            </div>

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

          {activeTab === "creations" && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {loading ? (
                <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                  <p className="text-gray-400">加载中...</p>
                </div>
              ) : userMaps.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                  <p className="text-gray-400">你还没有创建地图</p>
                </div>
              ) : (
                userMaps.map((map: any, index: number) => (
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
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: map.color || "#FFD966" }}
                    >
                      <span className="text-2xl">🎵</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base mb-1 truncate">{map.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Download size={12} />
                          <span>{map.downloads || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={10} className="text-red-400" />
                          <span>{map.favoritesCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "#4ECDC420",
                          color: "#4ECDC4",
                        }}
                        onClick={() => navigate(`/editor/${map.id}`)}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "#FFB7B220",
                          color: "#FFB7B2",
                        }}
                        onClick={() => handleDeleteMap(map.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "achievements" && (
            <motion.div className="text-center py-12">
              <span className="text-6xl mb-4 block">🏆</span>
              <p className="text-gray-500">你的战绩将在这里显示</p>
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {loadingFavorites ? (
                <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                  <p className="text-gray-400">加载中...</p>
                </div>
              ) : favoriteMaps.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                  <span className="text-4xl mb-2 block">❤️</span>
                  <p className="text-gray-500">你还没有收藏任何地图</p>
                  <button
                    className="mt-4 text-[#4ECDC4] text-sm"
                    onClick={() => navigate("/workshop")}
                  >
                    去地图工坊看看
                  </button>
                </div>
              ) : (
                favoriteMaps.map((map: any, index: number) => (
                  <motion.div
                    key={map.id}
                    className="p-4 rounded-2xl flex items-center gap-4 cursor-pointer"
                    style={{
                      backgroundColor: "white",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index + 0.4 }}
                    onClick={() => navigate(`/map/${map.id}`)}
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: map.color || "#FFD966" }}
                    >
                      <span className="text-2xl">🎵</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base mb-1 truncate">{map.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{map.creator}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Download size={12} />
                          <span>{map.downloads || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={10} className="text-red-400" />
                          <span>{map.favoritesCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "#FFB7B220",
                        color: "#FFB7B2",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("在地图详情页可以取消收藏");
                      }}
                    >
                      <Heart size={14} className="fill-red-500 text-red-500" />
                    </button>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>

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

      {isEditing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[300px] shadow-xl">
            <h3 className="text-lg font-bold mb-4">修改昵称</h3>
            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="输入新昵称"
            />
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-200"
                onClick={() => setIsEditing(false)}
              >
                取消
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-[#4ECDC4] text-white"
                onClick={handleSaveNickname}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
