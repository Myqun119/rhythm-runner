<<<<<<< HEAD

  # 节奏跑酷游戏UI设计
  本项目围绕音乐节奏与跑酷玩法的**节奏跑酷游戏系统**深度融合，涵盖从背景调研、系统设计、技术实现到创新总结的完整开发流程，打造兼具趣味性与创作自由的游戏体验。

  ## 项目运行说明

  1.下载依赖
  npm install

  2.开启后端
  npm run server

  3.开启项目
  npm run dev

  ## 系统整体架构
  <img width="1043" height="748" alt="image" src="https://github.com/user-attachments/assets/2c5b5aa1-1304-4d15-bb1d-beebf262f955" />

  ## 技术支撑
React + TypeScript 前端框架
TailwindCSS 样式设计
Canvas API 游戏渲染
Web Audio API 音频处理
Framer Motion 动效动画
Lucide React 图标库
React Router 路由管理
Node.js + Express 后端框架

## 交互流程图
<img width="1264" height="839" alt="image" src="https://github.com/user-attachments/assets/88963e36-d798-4165-bfd1-181527663a40" />

## 原型设计及主要界面
### 登录注册界面
<img width="486" height="909" alt="image" src="https://github.com/user-attachments/assets/738bd014-49ee-4035-87f5-43d43e16432a" />
功能：
1) 账号密码登录：校验成功跳转主页面，同步用户收藏、创作数据；
2) 注册：跳转注册弹窗新建账号；
3) 游客模式：免登录试玩，禁用下载、保存、上传地图功能。

### 首页主菜单
<img width="489" height="913" alt="image" src="https://github.com/user-attachments/assets/0d6d26a6-630c-4574-9590-5bf9d85c7e0b" />
页面元素：
1) 开始游戏：进入固定 / 随机地图选择列表；
2) 排行榜：查看游戏积分排行；
3) 地图工坊：跳转社区地图广场；
4) 我的创作：拆分「节奏工坊、自制地图」两个编辑器；
5) 设置：预留音效、画面设置。
<img width="473" height="912" alt="image" src="https://github.com/user-attachments/assets/98047cb4-56e9-4190-a213-64940b9759d2" />

### 地图工坊界面
<img width="475" height="910" alt="image" src="https://github.com/user-attachments/assets/3f79cef5-f7f0-4274-b549-08a3bdbdc2aa" />
分区：顶部搜索栏；分类标签：热门/最新/最多下载/我的收藏；下方地图卡片列表；
卡片功能：
1)立即体验：直接跳转游戏试玩，不存入本地；
2)下载地图：下载完成自动添加至【开始游戏-固定地图】；
3)收藏：地图存入个人中心收藏夹。

### 个人中心界面
<img width="489" height="910" alt="image" src="https://github.com/user-attachments/assets/2c535525-6192-4a7f-8442-6396e6595ec2" />

### 游戏对局界面
<img width="566" height="918" alt="image" src="https://github.com/user-attachments/assets/e0057fe9-e2a1-4ef0-add8-5b24bb8c0fa9" />
对局信息：实时积分数据+进度条，展示当前得分与通关进度；上传音乐：替换当前对局背景音乐；
换背景：自定义更换场景图片；
默认背景：一键恢复系统原生场景；
<img width="484" height="910" alt="image" src="https://github.com/user-attachments/assets/dddf6a57-a9d1-480d-aed2-5239993e71f8" />
更换音乐：重新选取音频，系统重新按节拍生成全新随机障碍；
视觉：赛博：一键切换「赛博/清新」双主题，全局替换跑道、障碍、背景素材；
显示调试：开发调试开关，上线隐藏；
通栏大按钮【开始/暂停】：控制音乐播放、角色跑动、障碍生成启停；

### 地图编辑
<img width="808" height="1186" alt="image" src="https://github.com/user-attachments/assets/32b78a61-f22b-43a8-b877-a157752959c1" />

更多具体内容可查看项目文档……



  
  

