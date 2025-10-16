# 《未来食物实验室》- 轻量互动游戏

本项目是一个基于 React, Vite 和 Three.js 构建的轻量级网页互动游戏，旨在通过有趣的方式向玩家科普可持续饮食与环保意识。

## 核心概念

玩家在虚拟的“未来食物实验室”中扮演饮食研究员。通过选择不同的食材组合，系统会立即反馈这顿饭对环境造成的影响（碳排放、水资源消耗、土地占用）以及健康指数。最终，玩家会看到自己的“饮食星球”根据他们的选择发生相应的变化。

这个项目的灵感来源于联合国可持续发展目标（SDGs），特别是：
- **SDG 2：零饥饿**
- **SDG 12：负责任的消费与生产**
- **SDG 13：气候行动**

## 技术栈

- **前端框架**: [React](https://reactjs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **3D渲染**: [Three.js](https://threejs.org/), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction), [Drei](https://github.com/pmndrs/drei)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **包管理器**: [npm](https://www.npmjs.com/)

## 项目结构

```
/
├── public/              # 存放静态资源，如图片、音效
├── src/
│   ├── assets/          # 存放项目资产
│   ├── components/      # React 组件
│   │   ├── 3D/          # Three.js 相关组件
│   │   ├── Audio/       # 音频管理组件
│   │   ├── Cards/       # 卡牌相关组件
│   │   ├── Game/        # 游戏流程屏幕组件
│   │   └── UI/          # 通用UI组件
│   ├── data/            # 游戏数据 (JSON格式)
│   │   ├── foods.json
│   │   ├── recipes.json
│   │   └── achievements.json
│   ├── hooks/           # 自定义 Hooks (例如：useGameLogic.js)
│   ├── styles/          # 全局 CSS 样式
│   ├── utils/           # 工具函数
│   ├── App.jsx          # 主应用组件
│   └── main.jsx         # 应用入口文件
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 本地开发环境设置

请按照以下步骤在新设备上配置并启动项目。

### 步骤 1: 环境准备

在开始之前，请确保你的电脑上安装了以下软件：
- **Node.js**: `v18.0` 或更高版本。我们建议使用最新的长期支持（LTS）版本。你可以从 [Node.js 官网](https://nodejs.org/) 下载。
- **npm**: 通常会随 Node.js 一起安装。你可以通过在终端运行 `npm -v` 来检查其版本。

### 步骤 2: 克隆项目代码

使用 Git 将项目代码克隆到你的本地电脑。打开终端并执行以下命令：

```bash
git clone https://github.com/your-username/future-food-lab.git
cd future-food-lab
```
*(请将 `https://github.com/your-username/future-food-lab.git` 替换为实际的仓库地址)*

### 步骤 3: 安装项目依赖

进入项目根目录后，运行 `npm install` 命令。这将读取 `package.json` 文件并自动下载所有必需的库和工具。

```bash
npm install
```
这个过程可能需要几分钟，具体时间取决于你的网络速度。

### 步骤 4: 启动本地开发服务器

所有依赖安装完成后，运行以下命令来启动 Vite 开发服务器：

```bash
npm run dev
```

如果一切顺利，你会在终端看到类似下面的输出，表明服务器已成功启动：

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 步骤 5: 在浏览器中访问

打开你的网页浏览器（如 Chrome, Firefox），访问终端中提示的 `Local` 地址：**`http://localhost:3000`**。

现在，你应该能看到《未来食物实验室》的游戏界面并开始互动了！

### 故障排查

- **端口 `3000` 被占用**: 如果启动时出现端口占用的错误（`Error: listen EADDRINUSE: address already in use :::3000`），你可以通过修改 `vite.config.js` 文件中的 `server.port` 值为另一个未被占用的端口（如 `3001`）来解决。

## 主要依赖项

- `react`, `react-dom`: 用于构建用户界面的核心库。
- `three`: 用于创建和显示3D图形。
- `@react-three/fiber`: React 的 Three.js 渲染器，使我们能用声明式组件来构建3D场景。
- `@react-three/drei`: 为 `@react-three/fiber` 提供的实用辅助工具、组件和钩子集合。
- `framer-motion`: 一个强大的动画库，用于创建流畅的UI过渡和交互动画。
- `vite`: 新一代前端构建工具，提供极速的开发服务器和优化的构建流程。

## 近期更新与修复 (2025-10-16)

本次更新集中修复了多个UI、逻辑和3D渲染相关的Bug，并对部分界面进行了优化，以提升整体用户体验和稳定性。

### 核心逻辑修复
- **结果页重定向:** 修复了在游戏结果页面点击“返回主界面”按钮时无法正确返回主菜单的问题。现在该按钮会重置游戏状态，确保流程正确。
- **统计面板显示:** 修复了食物选择界面统计进度条因CSS类名错误而无法显示的问题。

### UI与视觉优化
- **选择界面布局:** 调整了食物选择界面的布局，使“当前选择总览”面板永久可见，避免了因内容变化导致的布局跳动。
- **卡片文本溢出:** 修复了食物卡片描述文字过长时破坏布局的问题。现在长描述会自动截断，并支持鼠标悬停显示完整内容。
- **弹窗样式统一:** 修复了图鉴和成就弹窗中关闭按钮样式不一致的问题。
- **弹窗内容滚动:** 解决了图鉴弹窗在内容过多时无法正常滚动的问题。

### 3D渲染修复
- **模型颜色修正:** 修复了3D星球上的树木模型因材质属性冲突而显示为黑色的问题，使其恢复正常颜色。