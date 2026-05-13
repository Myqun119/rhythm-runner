import { motion } from "motion/react";
import { ArrowLeft, Search, Download, Heart, Paintbrush } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import type { MouseEvent } from "react";
import { getPublishedMaps, getCurrentUser, isFavorited, addFavorite, removeFavorite, syncFavorites } from "../../utils/db";

const filterOptions = ["热门", "最新", "最多下载", "我的收藏"];

export default function MapWorkshop() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("热门");
  const [mapsList, setMapsList] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  const isFirstLoad = useRef(true);

  const loadMaps = useCallback(async () => {
    setLoading(true);

    let maps = await getPublishedMaps();

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      maps = maps.filter((map: any) => map.name?.toLowerCase().includes(keyword) || map.creator?.toLowerCase().includes(keyword));
    }

    const mapsWithStatus = maps.map((map: any) => ({
      ...map,
      isFavorited: isFavorited(map.id),
    }));

    switch (activeFilter) {
      case "最新":
        mapsWithStatus.sort((a, b) => (b.createdAt || Number(b.id)) - (a.createdAt || Number(a.id)));
        break;
      case "最多下载":
        mapsWithStatus.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case "我的收藏":
        setMapsList(mapsWithStatus.filter((map) => map.isFavorited === true));
        setLoading(false);
        return;
      default:
        mapsWithStatus.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }

    setMapsList(mapsWithStatus);
    setLoading(false);
  }, [searchKeyword, activeFilter]);

  const handleFavorite = async (e: MouseEvent<HTMLButtonElement>, mapId: string, currentIsFavorited: boolean) => {
    e.stopPropagation();

    if (!user) {
      alert("请先登录");
      navigate("/login");
      return;
    }

    try {
      const result = currentIsFavorited ? await removeFavorite(mapId) : await addFavorite(mapId);

      if (result.success) {
        setMapsList((prevMaps) =>
          prevMaps.map((map) =>
            map.id === mapId
              ? {
                ...map,
                favoritesCount: result.favoritesCount,
                isFavorited: !currentIsFavorited,
              }
              : map
          )
        );

        await syncFavorites();

        if (activeFilter === "我的收藏") {
          await loadMaps();
        }
      }
    } catch (error) {
      console.error("收藏操作失败:", error);
    }
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      loadMaps();
    }
  }, [loadMaps]);

  useEffect(() => {
    loadMaps();
  }, [searchKeyword, activeFilter]);

  useEffect(() => {
    loadMaps();
  }, [location.key]);

  return (
    <div
      className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)" }}
    >
      <BackgroundDecorations />

      <div className="relative z-10 flex flex-col h-full">
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
                style={{ backgroundColor: "white", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h2 className="text-2xl" style={{ fontWeight: 700, color: "#4ECDC4" }}>
                地图工坊
              </h2>
            </div>

            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#FFD966", boxShadow: "0 4px 12px rgba(255, 217, 102, 0.3)" }}
              onClick={() => navigate("/editor")}
            >
              <Paintbrush size={20} className="text-white" />
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 px-4 py-3 rounded-full mb-4"
            style={{ backgroundColor: "white", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="搜索地图或创作者..."
              className="flex-1 bg-transparent outline-none text-sm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {searchKeyword && (
              <button onClick={() => setSearchKeyword("")} className="text-gray-400 text-sm">
                清除
              </button>
            )}
          </motion.div>

          <motion.div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm transition-all ${activeFilter === filter ? "text-white" : "text-gray-600"}`}
                style={{ backgroundColor: activeFilter === filter ? "#4ECDC4" : "white", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-gray-400">加载中...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {mapsList.length === 0 ? (
                <div className="col-span-2 text-center py-16 bg-white rounded-2xl shadow-sm">
                  <p className="text-4xl mb-2">🗺️</p>
                  <p className="text-gray-500">{searchKeyword ? "未找到相关地图" : "暂无公开地图"}</p>
                  {searchKeyword && (
                    <button className="mt-4 text-[#4ECDC4] text-sm" onClick={() => setSearchKeyword("")}>
                      清除搜索
                    </button>
                  )}
                </div>
              ) : (
                mapsList.map((map, index) => (
                  <motion.div
                    key={map.id}
                    className="rounded-2xl overflow-hidden cursor-pointer"
                    style={{ backgroundColor: "white", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05 * index + 0.3 }}
                    onClick={() => navigate(`/map/${map.id}`)}
                  >
                    <div
                      className="w-full h-32 flex items-center justify-center relative"
                      style={{ background: `linear-gradient(135deg, ${map.color || "#FFD966"}, ${map.color || "#4ECDC4"}CC)` }}
                    >
                      <span className="text-4xl">🎵</span>
                      {user && (
                        <button
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                          onClick={(e) => handleFavorite(e, map.id, map.isFavorited)}
                        >
                          <Heart size={14} className={map.isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"} />
                        </button>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm mb-1 truncate font-medium">{map.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{map.creator}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Download size={12} />
                          <span>{map.downloads || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={10} className="text-red-400" />
                          <span>{map.favoritesCount || 0}</span>
                        </div>
                      </div>
                      <div className="inline-block px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: "#A8E6CF" }}>
                        自定义
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
