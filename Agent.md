项目：motion-photo 

只需提供Google/Samsung标准下的motion photo链接，就能返回一个高度可用的motion photo展示的web组件

对于motion photo，通过文件标识来区分照片和视频部分，下面是一个示例代码，用来从照片中提取分离视频：

```javascript
/**
 * 从 Motion Photo (JPG) 中分离视频
 * @param {File} file - 用户上传的文件对象
 * @returns {Promise<{jpgBlob: Blob, mp4Blob: Blob}>}
 */
async function extractVideoFromMotionPhoto(file) {
    // 1. 将文件转换为 ArrayBuffer 以便读取二进制数据
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // 2. 遍历二进制数据，寻找 MP4 文件的文件头特征
    // MP4 文件的头部通常包含 'ftyp' (File Type) 标识
    // 对应的 ASCII 码为: f=102, t=116, y=121, p=112
    // 循环条件 bytes.length - 8 是为了防止数组越界
    for (let i = 0; i < bytes.length - 8; i += 1) {
        // 检查当前位置偏移量 +4 处是否为 'ftyp'
        // MP4 结构：[4字节长度][4字节标识(ftyp)]...
        if (
            bytes[i + 4] === 102 && // 'f'
            bytes[i + 5] === 116 && // 't'
            bytes[i + 6] === 121 && // 'y'
            bytes[i + 7] === 112    // 'p'
        ) {
            // 3. 找到分割点 (i)
            
            // 前半部分是纯图片 (JPG)
            const jpgBlob = new Blob([bytes.slice(0, i)], { type: "image/jpeg" });
            
            // 后半部分是视频 (MP4)
            const mp4Blob = new Blob([bytes.slice(i)], { type: "video/mp4" });

            return { jpgBlob, mp4Blob };
        }
    }

    throw new Error("未检测到视频部分（文件可能不是 Motion Photo）");
}
```

注意iPhone的live photo标准是视频和图片分开存储的，因此你需要同步支持imgSrc+videoSrc都传入的这种方式，同时还能兼容motion photo只传入img的方式

你需要使用的核心技术栈：

TypeScript、Bun、Biome...

下面是给你的更详细的工作指南：

我为你设计了一个**“Headless Core + Framework Adapters”**的架构方案。这种方案能最大程度满足你“高度可自定义”和“多端兼容”的要求。

### 第一阶段：架构设计与项目初始化

由于你要支持 React、Vue 和 CDN（原生 JS），最好的方式是采用 **Monorepo（单体仓库）** 或者 **单一仓库多出口（Multi-export）** 的结构。推荐使用 `bun` + `tsup`（基于 esbuild 的打包工具，速度极快且配置简单）。

**核心架构思想：**

1. **Core (Headless)**: 纯 TS 编写，不依赖任何框架。负责解析 Motion Photo 二进制流、管理播放状态（Loading, Playing, Paused）、处理 iPhone 双链接逻辑。
2. **Adapters**: 分别为 React 和 Vue 提供封装好的 Hooks/Composables。
3. **UI**: 提供默认组件，但允许用户完全接管渲染（Headless UI 模式）。

#### 步骤 1.1：初始化项目

（记得使用bun）

```bash
npm init -y
npm install -D typescript tsup
npx tsc --init

```

---

### 第二阶段：开发 Core 核心层 (Vanilla JS/TS)

这是整个包的“大脑”。不要在这里写任何 `<div>` 或 CSS。

#### 步骤 2.1：统一输入接口

你需要设计一个标准化的输入处理层。

* **输入 A (Motion Photo)**: 接收 `File` 或 `Blob` 或 `URL`。内部调用你之前的解析逻辑（`ftyp` 查找），拆解为 ObjectURL。
* **输入 B (iPhone Live)**: 接收 `{ imgSrc: string, videoSrc: string }`。

#### 步骤 2.2：状态机设计

实现一个简单的类（Class）或状态机来管理逻辑：

* **State**: `idle` -> `parsing` -> `ready` -> `playing` -> `error`。
* **Methods**: `load()`, `play()`, `pause()`, `toggle()`, `mute()`.
* **Events**: 抛出自定义事件，方便上层订阅（如 `onLoad`, `onPlay`）。

#### 步骤 2.3：DOM 交互逻辑 (Ref 处理)

核心层需要知道去哪里渲染视频。通常你需要提供一个方法，让用户把 `video` 元素的引用传给你，你的 Core 负责控制这个 video 标签的 `src`、`currentTime` 和 `opacity`（实现封面到视频的平滑过渡）。

---

### 第三阶段：框架适配 (The Wrappers)

为了满足“高度可自定义”，我们推荐使用 **Hooks / Composables** 模式，而不是只提供一个写死的组件。

#### 步骤 3.1：React 适配

创建一个 `useLivePhoto` Hook。

* **输入**: 配置项（触发方式 `hover` | `click`，防抖时间等）。
* **输出**: `{ videoRef, imgRef, status, play, pause, isReady }`。
* **默认组件**: 基于 Hook 封装一个 `<LivePhoto />` 组件，但通过 `children` 或 `render props` 暴露插槽，让用户自定义按钮和 Loading 状态。

#### 步骤 3.2：Vue 适配

创建一个 `useLivePhoto` Composable。

* **输出**: 响应式的 `refs` 和方法。
* **组件**: 提供一个 `<LivePhoto>` 组件，大量使用 `<slot>` (如 `#placeholder`, `#controls`, `#error`)。

#### 步骤 3.3：CDN / Vanilla 适配

导出一个全局变量（例如 `LivePhotoPlayer`）。用户可以在 HTML 中通过 `new LivePhotoPlayer('#element-id', options)` 来初始化。

---

### 第四阶段：构建与打包 (Bundling)

这是新手最容易踩坑的地方。为了支持 CDN 和 NPM 导入，你需要打出三种格式的包。

#### 步骤 4.1：配置 `tsup.config.ts`

你需要配置打包工具输出：

1. **ESM (`.mjs`)**: 给现代打包工具（Vite, Webpack 5）使用，支持 Tree-shaking。
2. **CJS (`.js`)**: 给老旧的 Node 环境或工具使用。
3. **IIFE / UMD (`.global.js`)**: **这就是你的 CDN 版本**。它会把所有代码合并成一个文件，直接在浏览器 `<script>` 标签运行。

#### 步骤 4.2：处理 CSS

* **基础样式**: 尽量只写极其必要的 CSS（如 `position: absolute` 用于重叠视频和图片）。
* **自定义**: 允许用户传入 `className` 或 `style` 对象。

---

### 第五阶段：发布与文档

#### 步骤 5.1：`package.json` 配置

这是最关键的一步，决定了用户怎么引用你的包。

* `name`: 包名（先去 npmjs.com 搜一下有没有重名）。
* `main`: 指向 CJS 文件。
* `module`: 指向 ESM 文件。
* `types`: 指向 `.d.ts` 类型声明文件。
* `exports`: 现代 Node 标准，精确控制导入路径。
* `files`: 指定上传到 npm 的文件白名单（通常是 `dist` 目录）。

#### 步骤 5.2：编写 README.md

一份好的文档决定了包的生死。

* **Demo**: 放一个 GIF 或在线 CodeSandbox 链接。
* **Installation**: `npm install ...`
* **Usage**: 分别列出 React、Vue 和 HTML CDN 的用法示例。
* **API**: 详细列出配置项参数。

#### 步骤 5.3：发布

1. 注册 npm 账号。
2. 在终端运行 `npm login`。
3. 运行 `npm publish --access public`（如果是第一次发布）。

---

### 总结：你的路线图

1. **核心开发**: 写 TS 类，实现解析二进制流 + 播放控制。
2. **React 封装**: 写 `useLivePhoto` Hook。
3. **打包**: 用 `tsup` 生成 ESM/CJS/IIFE 格式。
4. **CDN 测试**: 写一个 `index.html` 引入打包好的 IIFE 文件测试功能。
5. **发布**: `npm publish`。


关于默认传出的livephoto组件样式：

左上角显示live logo和文字 圆角 半透明，视情况加入静音播放按钮（如果用户传入的视频没有声音/用户不希望播放声音，就不需要显示这个按钮，其他情况可以允许观看照片的人决定是否播放声音）

移动端点击（长按）播放live 视频，手指挪出就不再播放改成显示照片，大屏端点击左上角live按钮（或者hover，可以配置）播放live视频，或许可以考虑允许auto-replay？（放视频 然后静态照片几s，然后再播放视频） 注意视频和静态照片的过渡 考虑使用渐变技巧

我希望这些选项都是可以配置的，但这似乎会增大使用负担，所以希望AI在规划时做出取舍，给出脱和最佳实践的实现方案