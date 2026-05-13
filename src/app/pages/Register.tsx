import { motion } from "motion/react";
import { User, Mail, Lock, Check } from "lucide-react";
import { BackgroundDecorations } from "../components/Decorations";
import { useNavigate } from "react-router";
import { useState } from "react";
import { registerUser } from "../../utils/db";

export default function Register() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleRegister = async () => {
    if (!nickname || !username || !password || !confirmPwd) {
      alert("请填写所有字段！");
      return;
    }

    if (password !== confirmPwd) {
      alert("两次密码不一致！");
      return;
    }

    const res = await registerUser(username, password, nickname);
    if (res.success) {
      alert("注册成功！请登录");
      navigate("/login");
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

      <div className="relative z-10 flex flex-col items-center h-full px-8 py-12">
        {/* 标题 */}
        <motion.h2
          className="text-3xl mb-12"
          style={{
            fontWeight: 700,
            color: "#4ECDC4",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          创建账号
        </motion.h2>

        {/* 输入框区域 */}
        <motion.div
          className="w-full space-y-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {/* 昵称输入框 */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#FFF8E7",
              border: "2px solid #FFB7B2",
              boxShadow: "0 4px 12px rgba(255, 183, 178, 0.2)",
            }}
          >
            <User size={20} className="text-[#4ECDC4]" />
            <input
              type="text"
              placeholder="请输入昵称"
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* 邮箱/手机号输入框 */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#FFF8E7",
              border: "2px solid #FFB7B2",
              boxShadow: "0 4px 12px rgba(255, 183, 178, 0.2)",
            }}
          >
            <Mail size={20} className="text-[#4ECDC4]" />
            <input
              type="text"
              placeholder="请输入邮箱或手机号"
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* 密码输入框 */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#FFF8E7",
              border: "2px solid #FFB7B2",
              boxShadow: "0 4px 12px rgba(255, 183, 178, 0.2)",
            }}
          >
            <Lock size={20} className="text-[#4ECDC4]" />
            <input
              type="password"
              placeholder="请输入密码"
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 确认密码输入框 */}
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-full"
            style={{
              backgroundColor: "#FFF8E7",
              border: "2px solid #FFB7B2",
              boxShadow: "0 4px 12px rgba(255, 183, 178, 0.2)",
            }}
          >
            <Check size={20} className="text-[#4ECDC4]" />
            <input
              type="password"
              placeholder="请确认密码"
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </div>
        </motion.div>

        {/* 注册按钮 */}
        <motion.button
          className="w-full py-4 rounded-full text-white mb-4"
          style={{
            backgroundColor: "#FFD966",
            boxShadow: "0 6px 16px rgba(255, 217, 102, 0.4)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onClick={handleRegister}
        >
          注册
        </motion.button>

        {/* 协议提示 */}
        <motion.p
          className="text-xs text-gray-500 text-center mb-8 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          点击注册即表示同意
          <span className="text-[#4ECDC4]">用户协议</span>
          和
          <span className="text-[#4ECDC4]">隐私政策</span>
        </motion.p>

        {/* 返回登录链接 */}
        <motion.p
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          已有账号？
          <span
            className="text-[#4ECDC4] cursor-pointer ml-1"
            onClick={() => navigate("/login")}
          >
            去登录
          </span>
        </motion.p>
      </div>
    </div>
  );
}
