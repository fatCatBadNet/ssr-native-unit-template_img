# LuckyGiftINModel 图片工作转包提词

## 任务边界与资源识别

主工程实际图片根目录为 `public/images/LuckyGiftINModel/img/`；用户描述的
`public/images/LuckyGiftINModel/assets/image/` 在当前主工程不存在。语言目录由
`pages/LuckyGiftINModel/build.config.json` 中的 `path` 字段决定（`EN`、`BR`、`ID`）。

按 `multilingual-image-adaptation` 的资源识别规则，以下英文素材画面中含有语言文字，
已分别复制到 `source/EN/` 与 `source/EN2/` 作为视觉基准：

| 源图 | 实测尺寸 | 格式 / 透明 | 画面文字 | 分类 |
| --- | ---: | --- | --- | --- |
| `source/EN/title.webp` | 750 × 311 px | WebP / 带透明通道 | `CONGRATULATIONS` / `SCRATCH` / `And Win!` | 需本地化 |
| `source/EN/cbgm.webp` | 683 × 580 px | WebP / 带透明通道 | `Swipe to Scratch!` | 需本地化 |
| `source/EN/nowin.webp` | 598 × 281 px | WebP / 无透明通道 | `No luck, try again!` | 需本地化 |
| `source/EN/prize-btn.webp` | 356 × 105 px | WebP / 带透明通道 | `GET` | 需本地化 |
| `source/EN2/title.webp` | 750 × 314 px | WebP / 带透明通道 | `CONGRATULATIONS` / `SCRATCH` / `And Win!` | 需本地化（EN2 变体） |
| `source/EN2/cbgm.webp` | 683 × 580 px | WebP / 带透明通道 | `Swipe to Scratch!` | 需本地化（EN2 变体） |
| `source/EN2/nowin.webp` | 598 × 281 px | WebP / 无透明通道 | `No luck, try again!` | 需本地化（EN2 变体） |
| `source/EN2/prize-btn.webp` | 356 × 105 px | WebP / 带透明通道 | `GET` | 需本地化（EN2 变体） |

以下资源已实际检查为无字公共图，不复制、不翻译：各语言 `bg.webp` 背景、`main.webp`
刮卡框、`arrow.webp`、`prize-bg.webp`、`EN2/prize-frame.webp`、金币 `cash*.webp`、
`effect*.webp`、`gift-effct.webp`、`hand.webp`、`box-img.png`、`no-img.png`、`rule-bg.png`
及 `back.svg` / `kefu.svg` / `union.svg` / `vector.svg` 图标。它们应继续由主工程共享路径
加载。

`EN2/` 是仅英文的另一视觉变体；它与标准 `EN` 使用同一组文案，但 `title.webp`
高度为 314 px，不能用标准 EN 图硬套。已将其 4 张含字源图入库并在本文件标注为 EN2
变体。由于回迁脚本和交付约定要求单个 `<lang>/` 目录内同名文件只能有一份，本次标准
语言输出以 `source/EN/` 的 4 张图为主；若后续启用 `LuckyGiftINEn2` 的独立视觉投放，
应使用同一译文和对应 EN2 尺寸/契约另行生成一套 4 张图，不能覆盖标准 EN 产物。

## 交付总则

- 目标语言：`en`（印度 IN、菲律宾 PH）、`pt`（巴西 BR）、`vi`（越南 VN）、`id`（印尼 ID）、
  `ja`（日本 JP）、`bn`（孟加拉 BD）、`my`（缅甸 MM）、`ar`（埃及 EG）。
- 生成目录统一为 `../ssr-native-unit-template_img/outsourcing/LuckyGiftINModel/output/<lang>/`。
- 每个语言目录必须且只能包含以下 4 个文件，文件名与源图完全一致：
  `title.webp`、`cbgm.webp`、`nowin.webp`、`prize-btn.webp`。
- 每张图必须保持源图精确像素尺寸、WebP 格式及源图透明通道状态；禁止拉伸、压扁、裁切、
  改比例或把透明图改成白底。所有文字都应在源图原安全区域内适配。
- `output/<lang>/` 的语言目录一律使用小写标准码；不要创建 `EN`、`BR`、`ID` 等大写输出目录。

## 逐图提词

### 1. `title.webp`

**源图与硬性规格**

- 源图：`source/EN/title.webp`
- 生成尺寸：**750 × 311 px**，必须逐像素保持画布尺寸与比例。
- 格式：WebP；源图带透明通道，必须保留透明背景与四周安全边距。

**视觉契约**

保留三层英文标题的强烈促销字图结构：顶部小行 `CONGRATULATIONS`，中间最大行
`SCRATCH`，底部 `And Win!`。文字整体居中，保持原始倾斜/动感构图、字重、行间距和
透视层级。保留蓝—紫—粉的霓虹渐变填充、白色高光/内描边、粉红外描边、深色偏移阴影、
两侧速度线和顶部蓝紫胶囊底。译文变长时优先采用下方精炼译文，再在原安全区域内缩小字号或
调整断行；不得改变画布、拉伸背景或把文字改成普通无描边字体。

**目标文案（按三行排版）**

| lang | 译文 |
| --- | --- |
| en | `CONGRATULATIONS` / `SCRATCH` / `And Win!` |
| pt | `PARABÉNS!` / `RASPE` / `Ganhe!` |
| vi | `CHÚC MỪNG!` / `CÀO` / `VÀ TRÚNG!` |
| id | `SELAMAT!` / `GOSOK` / `dan Menang!` |
| ja | `おめでとう！` / `こすって` / `当てよう！` |
| bn | `অভিনন্দন!` / `স্ক্র্যাচ` / `করে জিতুন!` |
| my | `ဂုဏ်ယူပါတယ်!` / `ခြစ်ပြီး` / `ဆုရယူပါ!` |
| ar | `مبروك!` / `اكشط` / `واربح!` |

### 2. `cbgm.webp`

**源图与硬性规格**

- 源图：`source/EN/cbgm.webp`
- 生成尺寸：**683 × 580 px**，不得裁切或改变比例。
- 格式：WebP；源图带透明通道，必须保留圆角卡片外的透明区域。

**视觉契约**

保持灰色磨砂刮卡覆盖层、深浅灰星芒重复纹理、细金色圆角边框和底部深色边缘。
提示文字位于原英文文字所在的水平安全区，使用白色粗体无衬线字、蓝色描边/外沿高光，
保持居中与可读对比度。译文较长时优先精炼，必要时只在原卡面安全区内减小字号，不得
把提示移出卡面或破坏星芒纹理。

**目标文案（单行居中）**

| lang | 译文 |
| --- | --- |
| en | `Swipe to Scratch!` |
| pt | `Deslize para Raspar!` |
| vi | `Vuốt để cào!` |
| id | `Geser untuk Menggosok!` |
| ja | `スワイプして削る！` |
| bn | `সোয়াইপ করে স্ক্র্যাচ করুন!` |
| my | `ပွတ်ဆွဲ၍ ခြစ်ပါ!` |
| ar | `مرّر للكشط!` |

### EN2 变体补充

`source/EN2/title.webp`、`source/EN2/cbgm.webp`、`source/EN2/nowin.webp`、
`source/EN2/prize-btn.webp` 的目标文字与上面 4 节完全相同；生成时分别使用 EN2
源图的原尺寸（title 为 750×314，其余为 683×580、598×281、356×105），并保留
EN2 源图的渐变、阴影、星芒和安全区域。EN2 产物仍以同名文件交付，但应在独立的
EN2 视觉投放批次中管理，不能与标准 EN 产物混放。

### 3. `nowin.webp`

**源图与硬性规格**

- 源图：`source/EN/nowin.webp`
- 生成尺寸：**598 × 281 px**，不得裁切或改变比例。
- 格式：WebP；源图无透明通道，必须保持完整浅奶油色背景，不得改为透明。

**视觉契约**

保留哭脸表情图标及浅奶油—淡黄色背景、原始留白和横向构图。提示文案保持单行居中，
使用原来的金黄色、粗斜体无衬线气质；不要增加边框、阴影、图标或其他装饰。长译文应
优先采用下方短句，保证在原文本宽度安全区内清晰显示。

**目标文案（单行居中）**

| lang | 译文 |
| --- | --- |
| en | `No luck, try again!` |
| pt | `Sem sorte, tente novamente!` |
| vi | `Chưa may mắn, thử lại!` |
| id | `Belum beruntung, coba lagi!` |
| ja | `残念、もう一度！` |
| bn | `ভাগ্য হয়নি, আবার চেষ্টা করুন!` |
| my | `ကံမကောင်းသေးပါ၊ ထပ်ကြိုးစားပါ!` |
| ar | `لم يحالفك الحظ، حاول مجددًا!` |

### 4. `prize-btn.webp`

**源图与硬性规格**

- 源图：`source/EN/prize-btn.webp`
- 生成尺寸：**356 × 105 px**，不得裁切或改变比例。
- 格式：WebP；源图带透明通道，必须保留胶囊按钮外的透明区域。

**视觉契约**

保持红色圆角胶囊按钮、由亮红到深红的纵向渐变、细白内描边/高光、外侧柔和阴影和
原始安全边距。按钮文字居中、大写/强字重、纯白；短译文优先，不能让文字碰到胶囊边缘，
不增加额外图标或改变按钮形状。

**目标文案（单行居中）**

| lang | 译文 |
| --- | --- |
| en | `GET` |
| pt | `GET` |
| vi | `NHẬN` |
| id | `GET` |
| ja | `受け取る` |
| bn | `নিন` |
| my | `ရယူမည်` |
| ar | `استلم` |

## 交付与回迁说明

外部产出完成后，先在图床仓库执行 dry-run，确认语言目录、文件名和尺寸无误：

```bash
cd ../ssr-native-unit-template_img
node scripts/deploy-images.mjs --template LuckyGiftINModel --dry-run --strict-size
```

确认无误后，去掉 `--dry-run` 正式回迁；按主工程配置实际使用的 `EN` / `BR` / `ID` 目录
大小写由脚本反解，不手工往主工程拷图：

```bash
node scripts/deploy-images.mjs --template LuckyGiftINModel --strict-size
```

脚本将 `output/<lang>/` 图片回迁到主工程实际路径
`public/images/LuckyGiftINModel/img/<实际语言目录>/`，并用 `sips` 对每个产出与
`source/` 同名源图核对像素尺寸。回迁后必须在真实页面逐语言检查：正确语言文件被加载、
750/683/598/356 宽度素材没有裁切/模糊/拉伸、刮卡层与相邻 UI 无重叠，并检查 EN2
变体未被标准 EN 产物误覆盖。

页面验证完成后，在主工程根目录 `multilingual-review.json` 新增或合并
`LuckyGiftINModel` 的 pending 记录；保留历史 approved 记录，`approvedAt` 与
`approvedBy` 只能由人工在 `test.html` 审批模块填写。
