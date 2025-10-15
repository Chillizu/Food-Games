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

## 在新设备上配置并运行项目

请按照以下步骤在新设备上设置和启动项目。

### 1. 先决条件

- 安装 [Node.js](https://nodejs.org/) (建议使用 LTS 版本，v16 或更高)
- 安装 [npm](https://www.npmjs.com/get-npm) (通常随 Node.js 一起安装)

### 2. 克隆仓库

首先，将项目代码克隆到你的本地设备。

```bash
git clone <your-repository-url>
cd future-food-lab
```

### 3. 安装依赖项

进入项目根目录后，运行以下命令来安装所有必需的依赖包。这些依赖项定义在 `package.json` 文件中。

```bash
npm install
```

这将需要几分钟时间来下载和安装所有库（如 React, Three.js 等）。

### 4. 启动开发服务器

安装完成后，运行以下命令来启动 Vite 开发服务器：

```bash
npm run dev
```

服务器启动后，你会在终端看到类似以下的信息：

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. 在浏览器中查看

打开你的浏览器，并访问终端中显示的 `Local` 地址 (通常是 `http://localhost:5173`)。

现在你应该能看到《未来食物实验室》的游戏界面了！

## 主要依赖项

- `react`, `react-dom`: 用于构建用户界面的核心库。
- `three`: 用于创建和显示3D图形。
- `@react-three/fiber`: React 的 Three.js 渲染器，使我们能用声明式组件来构建3D场景。
- `@react-three/drei`: 为 `@react-three/fiber` 提供的实用辅助工具、组件和钩子集合。
- `framer-motion`: 一个强大的动画库，用于创建流畅的UI过渡和交互动画。
- `vite`: 新一代前端构建工具，提供极速的开发服务器和优化的构建流程。

## 近期更新与修复 (v1.1.0)

本次更新主要集中在修复一系列UI、逻辑和3D渲染的Bug，并对用户体验进行了优化。

### 主要修复内容：

- **核心逻辑 & UI:**
    - **重定向问题:** 修复了结果页面“返回主界面”按钮无法正常工作的Bug，确保游戏流程可以顺畅重置。
    - **统计面板:** 修复了食物选择界面统计进度条的显示错误。
    - **布局稳定性:** 优化了选择界面的布局，使“当前选择总览”面板永久可见，避免了因内容变化引起的页面抖动。
    - **文本溢出:** 解决了食物卡片描述文字过长时破坏布局的问题，现在会进行优雅地截断处理。

- **3D渲染 & 视觉效果:**
    - **模型渲染:** 修复了3D星球上树木模型显示为黑色的渲染错误。
    - **UI样式:** 统一并修复了各个弹窗（如图鉴、成就）中关闭按钮的样式不一致问题。
    - **内容滚动:** 解决了图鉴弹窗内容过多时无法正常滚动的问题。

这些改进显著提升了应用的稳定性、视觉效果和整体用户体验。