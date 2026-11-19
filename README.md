# Netflix 4K Capability Experiment

[中文](#中文) | [English](#english)

## 中文

这是一个面向 Windows 11、Google Chrome 140+ 和 2560×1440 等非 4K 显示器的 Manifest V3 实验扩展，用来研究 Netflix 前端显示与 HEVC 能力检测是否影响 4K（3840×2160）串流选择。

**状态：实验性，未验证能够解锁 4K。** 本项目只修改网页读取到的部分能力值，不改变显示器、GPU、DRM、HDCP、许可证或 Netflix 提供的清单，也不强制选择最高码率。它可能导致画面排版异常、播放失败或误报硬件解码能力。移除闭源播放器后，旧版项目中基于播放器的码率选择功能不再存在。

### 条件与限制

- Windows 11、Chrome 140 或更新版本；版本 140 是本项目目标，不是 Netflix 官方的最低版本。
- 支持 Ultra HD 的 Netflix 套餐，播放质量设为“自动”或“高”，选择支持 4K 的影片；官方建议至少 15 Mbps 的稳定网络。
- 兼容的硬件和驱动；部分 Windows 11 设备需要安装 Microsoft Store 的 HEVC 视频扩展。
- 外接显示器和连接链路应支持 HDCP 2.2；排查时可仅连接一台屏幕。单屏不是 Netflix 普遍规定的硬性条件，但多屏环境中所有启用的显示设备也须符合官方要求。
- Netflix 官方的 Windows 4K 要求包括支持 4K、60 Hz 的显示设备；2K 显示器不满足这一官方显示要求。本实验不能保证突破该限制，且 2K 面板本身无法原生显示 4K 像素。

来源：[Netflix Windows 观看要求](https://help.netflix.com/en/node/23931)；[Netflix 浏览器要求](https://help.netflix.com/en/node/30081)。

### 安装

1. 下载或克隆项目到本地，确保 `manifest.json` 和 `inject.js` 位于同一目录。
2. Chrome 地址栏打开 `chrome://extensions`，打开右上角“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择包含 `manifest.json` 的文件夹。
4. 如果同时安装了其他 Netflix 修改扩展，先停用它们以便单独测试。刷新 Netflix 页面后播放影片。
5. 更新本项目文件后，在扩展卡片点击刷新图标，再刷新 Netflix 页面。

### 验证

1. 播放影片，按 `Ctrl+Alt+Shift+D` 打开 Netflix 的调试信息；界面可能因版本而变化。
2. 查看 `Playing bitrate` 后面的分辨率：`3840×2160` 表示当时播放的流为 4K；`2560×1440` 表示 1440p。
3. `KeyStatus` 中的 `2160, usable` 仅表示相应密钥状态可用，不代表当前播放 4K。`DFR` 是按播放流高度记录的掉帧统计；出现 `2160` 不应单独作为成功判据。
4. 流清晰度会动态变化，继续播放并观察；若播放失败或异常，禁用扩展并刷新页面。

### 实现

在 `document_start` 的 `MAIN` 世界中注入脚本，覆盖部分屏幕、窗口和 HEVC 能力查询，并对部分 `matchMedia` 最小值查询作处理。它不添加 DOM 轮询或 MutationObserver；不声明额外扩展权限。不收集或上传数据。本项目未附带 Netflix 播放器或第三方图标。

## English

This experimental Manifest V3 extension targets Windows 11, Google Chrome 140+, and non-4K displays such as 2560×1440. It explores whether modifying some display and HEVC capability reports affects Netflix's selection of a 3840×2160 stream.

**Status: experimental; 4K unlocking has not been verified.** The extension cannot change the display, GPU, DRM, HDCP, license, or available Netflix streams, and does not force the maximum bitrate. It may cause layout issues, playback errors, or inaccurate hardware capability reports. Removing the third-party player also removes the earlier player-based bitrate preference.

### Requirements and limitations

- Windows 11 and Chrome 140+ (the project target, not Netflix's stated minimum).
- A Netflix Ultra HD plan, playback quality set to Auto or High, a 4K title, and a stable connection of at least 15 Mbps per Netflix.
- Compatible hardware and drivers; some Windows 11 devices require the Microsoft Store HEVC Video Extensions.
- HDCP 2.2 for external display connections. Testing with a single screen can simplify diagnosis; single-screen use is not a universal Netflix requirement.
- Netflix's official Windows 4K requirements include a 4K 60 Hz display. A 2K display does not meet that requirement and cannot display native 4K pixels. This experiment cannot guarantee a 4K stream.

See [Netflix's Windows requirements](https://help.netflix.com/en/node/23931) and [browser requirements](https://help.netflix.com/en/node/30081).

### Installation

1. Download or clone this project; keep `manifest.json` and `inject.js` together.
2. Open `chrome://extensions` and enable Developer mode.
3. Click **Load unpacked** and select the project folder containing `manifest.json`.
4. Disable other Netflix-modifying extensions when testing this project independently. Reload Netflix and play a title.
5. After updating files, reload the extension from its card and reload the Netflix page.

### Verification

1. During playback press `Ctrl+Alt+Shift+D` to open Netflix playback diagnostics; the interface may change.
2. Check the resolution after `Playing bitrate`: `3840×2160` indicates a 4K stream at that moment; `2560×1440` is 1440p.
3. `2160, usable` in `KeyStatus` means the corresponding key is usable, not that 4K is playing. `DFR` is a dropped-frame statistic grouped by stream height; `2160` alone is not proof of current 4K playback.
4. Resolution can change during adaptive playback. Disable the extension and reload the page if playback fails or the page behaves unexpectedly.

The content script runs at `document_start` in the `MAIN` world, modifies selected display and HEVC capability queries, and does not add DOM polling or a MutationObserver. It requests no extra extension permissions, collects no data, and includes no Netflix player or third-party icons.

## Acknowledgments / 致谢

- [lkmvip/netflix-4K-DDplus](https://github.com/lkmvip/netflix-4K-DDplus) (MIT): inspiration for the original experimental workflow. The cleaned project does not redistribute its player or other extension code.
- [truedread/netflix-1080p](https://github.com/truedread/netflix-1080p): upstream pioneering project acknowledged by lkmvip's project.

## License / 许可证

[MIT](LICENSE). Netflix is a trademark of Netflix, Inc.; this project is unaffiliated with Netflix.
