import { motion } from "motion/react";
import { ArrowLeft, Volume2, Zap, Bell, Globe, User as UserIcon, Info, LogOut } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function Settings() {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(70);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [rhythmHint, setRhythmHint] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [language, setLanguage] = useState("中文");

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
              设置
            </h2>
          </motion.div>
        </div>

        {/* 设置列表 */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-4">
            {/* 音量设置 */}
            <motion.div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Volume2 size={20} className="text-[#4ECDC4]" />
                <span>音量</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${volume}%, #E5E7EB ${volume}%, #E5E7EB 100%)`,
                }}
              />
              <div className="text-right text-sm text-gray-500 mt-1">{volume}%</div>
            </motion.div>

            {/* 难度设置 */}
            <motion.div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap size={20} className="text-[#FFD966]" />
                <span>难度设置</span>
              </div>
              <div className="flex gap-2">
                {[
                  { value: "easy", label: "简单", color: "#A8E6CF" },
                  { value: "medium", label: "中等", color: "#FFD966" },
                  { value: "hard", label: "困难", color: "#FFB7B2" },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`flex-1 py-2 rounded-full text-sm transition-all ${
                      difficulty === option.value ? "text-white" : "text-gray-600"
                    }`}
                    style={{
                      backgroundColor:
                        difficulty === option.value ? option.color : "#F3F4F6",
                    }}
                    onClick={() => setDifficulty(option.value as typeof difficulty)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 节奏提示 */}
            <motion.div
              className="p-5 rounded-2xl flex items-center justify-between"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-[#FFB7B2]" />
                <span>节奏提示</span>
              </div>
              <button
                className={`w-14 h-8 rounded-full relative transition-all ${
                  rhythmHint ? "bg-[#4ECDC4]" : "bg-gray-300"
                }`}
                onClick={() => setRhythmHint(!rhythmHint)}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-white absolute top-1"
                  animate={{
                    left: rhythmHint ? "calc(100% - 28px)" : "4px",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </motion.div>

            {/* 音效开关 */}
            <motion.div
              className="p-5 rounded-2xl flex items-center justify-between"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-[#4ECDC4]" />
                <span>音效</span>
              </div>
              <button
                className={`w-14 h-8 rounded-full relative transition-all ${
                  soundEffects ? "bg-[#4ECDC4]" : "bg-gray-300"
                }`}
                onClick={() => setSoundEffects(!soundEffects)}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-white absolute top-1"
                  animate={{
                    left: soundEffects ? "calc(100% - 28px)" : "4px",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </motion.div>

            {/* 语言设置 */}
            <motion.div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Globe size={20} className="text-[#FFD966]" />
                <span>语言</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 rounded-full outline-none"
                style={{
                  backgroundColor: "#F3F4F6",
                  border: "2px solid #E5E7EB",
                }}
              >
                <option value="中文">中文</option>
                <option value="English">English</option>
              </select>
            </motion.div>

            {/* 账号管理 */}
            <motion.button
              className="w-full p-5 rounded-2xl flex items-center justify-between"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => navigate("/profile")}
            >
              <div className="flex items-center gap-3">
                <UserIcon size={20} className="text-[#4ECDC4]" />
                <span>账号管理</span>
              </div>
              <ArrowLeft size={20} className="text-gray-400 rotate-180" />
            </motion.button>

            {/* 关于我们 */}
            <motion.div
              className="p-5 rounded-2xl flex items-center justify-between"
              style={{
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3">
                <Info size={20} className="text-[#FFB7B2]" />
                <span>关于我们</span>
              </div>
              <span className="text-sm text-gray-500">v1.0.0</span>
            </motion.div>

            {/* 退出登录 */}
            <motion.button
              className="w-full p-5 rounded-2xl flex items-center justify-center gap-3"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #FFB7B2",
                color: "#FFB7B2",
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => navigate("/login")}
            >
              <LogOut size={20} />
              <span>退出登录</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
