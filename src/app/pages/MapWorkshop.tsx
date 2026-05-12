import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import RhythmRunnerApp from "../../../rhythmGame/src/App";

export default function MapWorkshop() {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFF6C9 0%, #FFF9EA 24%, #F0FBF7 72%, #DFF7F3 100%)" }}
    >
      <motion.button
        onClick={() => navigate("/menu")}
        className="absolute left-4 top-4 z-20 w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          border: "2px solid #4ECDC4",
          boxShadow: "0 8px 20px rgba(78, 205, 196, 0.14)",
        }}
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <ArrowLeft size={20} className="text-[#4ECDC4]" />
      </motion.button>

      <div className="rhythmgame-host relative z-10 h-full w-full overflow-auto pt-16">
        <RhythmRunnerApp />
      </div>
    </div>
  );
}
