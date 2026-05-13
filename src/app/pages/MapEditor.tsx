import { motion } from "motion/react";
import { ArrowLeft, Save, Upload, Music, Play } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { getCurrentUser, saveMap, getMapById } from "../../utils/db";

const obstacles = [
  { id: 1, name: "跳跃", color: "#4ECDC4", icon: "🦘" },
  { id: 2, name: "滑铲", color: "#FFD966", icon: "⚡" },
  { id: 3, name: "节奏点", color: "#FFB7B2", icon: "🎵" },
];

export default function MapEditor() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { id } = useParams();
  const [selectedObstacle, setSelectedObstacle] = useState(1);
  const [grid, setGrid] = useState<(number | null)[][]>(
    Array(10).fill(null).map(() => Array(8).fill(null))
  );
  const [mapName, setMapName] = useState("我的新地图");

  useEffect(() => {
    const loadMap = async () => {
      if (id) {
        const map = await getMapById(id);
        if (map) {
          setMapName(map.name);
          setGrid(map.data);
        }
      }
    };
    loadMap();
  }, [id]);

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = newGrid[row][col] === selectedObstacle ? null : selectedObstacle;
    setGrid(newGrid);
  };

  const getObstacleById = (id: number | null) => {
    return obstacles.find((o) => o.id === id);
  };

  const handleSave = async () => {
    if (!user) {
      alert("请先登录！");
      navigate("/login");
      return;
    }

    const res = await saveMap({ name: mapName, data: grid }, id);
    if (res.success) {
      alert(res.msg);
      navigate("/profile");
    } else {
      alert(res.msg);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      alert("请先登录！");
      navigate("/login");
      return;
    }

    const res = await saveMap({ name: mapName, data: grid, publish: true }, id);
    if (res.success) {
      alert(res.msg);
      navigate("/workshop");
    } else {
      alert(res.msg);
    }
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
        <div className="px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-xl" style={{ fontWeight: 700, color: "#4ECDC4" }}>
              创建你的地图
            </h2>
          </motion.div>

          <motion.div
            className="flex gap-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <button
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                backgroundColor: "#4ECDC4",
                color: "white",
                boxShadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
              }}
              onClick={handleSave}
            >
              <Save size={16} />
              <span className="text-sm">保存</span>
            </button>
            <button
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{
                backgroundColor: "#FFD966",
                color: "white",
                boxShadow: "0 4px 12px rgba(255, 217, 102, 0.3)",
              }}
              onClick={handlePublish}
            >
              <Upload size={16} />
              <span className="text-sm">发布</span>
            </button>
          </motion.div>
        </div>

        <motion.div
          className="px-6 mb-2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            placeholder="输入地图名称"
            className="w-full px-4 py-2 rounded-lg border-none shadow-sm"
            style={{ backgroundColor: "white" }}
          />
        </motion.div>

        {/* 音乐选择 */}
        <motion.div
          className="px-6 mb-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#FFD966" }}
              >
                <Music size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm">当前音乐</p>
                <p className="text-xs text-gray-500">电子迷幻 - 3:24</p>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded-full text-sm"
              style={{
                backgroundColor: "#4ECDC4",
                color: "white",
              }}
            >
              更换
            </button>
          </div>
        </motion.div>

        {/* 编辑区域 */}
        <div className="flex-1 flex px-6 gap-3 overflow-hidden">
          {/* 网格编辑器 */}
          <motion.div
            className="flex-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="p-3 rounded-2xl h-full overflow-auto"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="grid gap-1">
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((cell, colIndex) => {
                      const obstacle = getObstacleById(cell);
                      return (
                        <button
                          key={colIndex}
                          className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg transition-all"
                          style={{
                            backgroundColor: obstacle ? obstacle.color + "40" : "transparent",
                            borderColor: obstacle ? obstacle.color : "#E5E7EB",
                          }}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                          {obstacle && obstacle.icon}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 障碍物工具栏 */}
          <motion.div
            className="w-20"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="p-3 rounded-2xl space-y-3"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              {obstacles.map((obstacle) => (
                <button
                  key={obstacle.id}
                  className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${selectedObstacle === obstacle.id ? "ring-4" : ""
                    }`}
                  style={{
                    backgroundColor: obstacle.color + "40",
                    ringColor: selectedObstacle === obstacle.id ? obstacle.color : "transparent",
                  }}
                  onClick={() => setSelectedObstacle(obstacle.id)}
                >
                  <span className="text-2xl">{obstacle.icon}</span>
                  <span className="text-xs">{obstacle.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 时间轴预览 */}
        <motion.div
          className="px-6 py-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="p-4 rounded-2xl"
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">时间轴预览</p>
              <button
                className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "#FFD966",
                  color: "white",
                }}
              >
                <Play size={14} />
                <span className="text-xs">预览</span>
              </button>
            </div>
            {/* 波形模拟 */}
            <div className="h-12 rounded-lg overflow-hidden flex items-center gap-0.5">
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${20 + Math.random() * 60}%`,
                    backgroundColor: "#4ECDC4",
                    opacity: 0.3 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
