import { motion } from "motion/react";
import { ArrowLeft, Brush, LayoutGrid, Sparkles } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";

export default function CreateMapChoice() {
    const navigate = useNavigate();

    return (
        <div
            className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden"
            style={{ background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)" }}
        >
            <BackgroundDecorations />

            <div className="relative z-10 flex h-full flex-col px-6 py-4">
                <motion.div
                    className="flex items-center gap-3 mb-8"
                    initial={{ y: -18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
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
                    <div>
                        <h2 className="text-2xl" style={{ fontWeight: 700, color: "#4ECDC4" }}>
                            创建新地图
                        </h2>
                        <p className="text-sm text-gray-500">选择你想要的创作方式</p>
                    </div>
                </motion.div>

                <motion.div
                    className="mb-6 rounded-3xl p-6"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.88)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                    }}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFD966" }}>
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-gray-800">先选一个入口</p>
                            <p className="text-sm text-gray-500">之后可以继续细化关卡和节奏</p>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.button
                        className="w-full rounded-3xl p-5 text-left"
                        style={{
                            background: "linear-gradient(135deg, #4ECDC4 0%, #39B7AE 100%)",
                            boxShadow: "0 10px 24px rgba(78, 205, 196, 0.28)",
                            color: "white",
                        }}
                        initial={{ x: -24, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/editor")}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20">
                                    <Brush size={22} />
                                </div>
                                <div>
                                    <div className="text-xl font-semibold">自制地图</div>
                                    <div className="text-sm text-white/85">进入手动编辑器，逐格摆放障碍与节奏点</div>
                                </div>
                            </div>
                            <LayoutGrid size={22} className="text-white/90" />
                        </div>
                    </motion.button>

                    <motion.button
                        className="w-full rounded-3xl p-5 text-left"
                        style={{
                            background: "linear-gradient(135deg, #FFD966 0%, #FFB857 100%)",
                            boxShadow: "0 10px 24px rgba(255, 217, 102, 0.3)",
                            color: "white",
                        }}
                        initial={{ x: 24, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/workshop")}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20">
                                    <Sparkles size={22} />
                                </div>
                                <div>
                                    <div className="text-xl font-semibold">节奏工坊</div>
                                    <div className="text-sm text-white/85">进入智能生成流程，快速制作可玩地图</div>
                                </div>
                            </div>
                            <LayoutGrid size={22} className="text-white/90" />
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}