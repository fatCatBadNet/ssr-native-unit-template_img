# ssr-native-unit-template_img

主工程 [ssr-native-unit-template](../ssr-native-unit-template) 的姊妹图床仓库，承载多语言图片
工作转包的全过程物料：含字源图、逐图提词、外部产出图。回迁动作全部经下面的脚本完成，
不手工往主工程拷图。

## 目录排版约定

```
ssr-native-unit-template_img/
└── outsourcing/
    └── <模板名>/
        ├── source/               ← AI 扫描后复制的"携带语言"源图，保留主工程原语言子目录一层
        │   ├── En/title.png
        │   └── En/start-text.png
        ├── output/               ← 外部产出图，<lang> 一律小写标准语言码，文件名与源图完全一致
        │   ├── vi/title.png
        │   ├── ja/title.png
        │   └── ar/start-text.png
        └── PROMPTS.md            ← 逐图提词：尺寸、格式/透明、语言与译文、风格契约、交付说明
```

规则（由 test.html 多语言 Dashboard 的「图片工作转包提词」按钮生成的提词驱动执行）：

- 只入库"画面里带文字"的图片；图标、背景、金币等无字公共图不复制、不翻译。
- `source/` 保留主工程的原语言目录名（各模板大小写不一：`En`、`Es`、`ar`、`Thai`…），作为风格基准。
- `output/<lang>/` 语言码统一小写（en、pt、vi、id、ja、bn、my、ar…）；目标位置的真实目录
  大小写由脚本按主工程 `build.config.json` 反解，产出方无需关心。
- 生成图尺寸、格式、透明通道必须与 `source/` 同名源图完全一致；禁止改名、拉伸、裁切。

## 批量回迁脚本

```bash
# 预览（不写入）
node scripts/deploy-images.mjs --template <模板名> --dry-run

# 正式回迁到主工程 public/images/<模板名>/assets/image/<实际语言目录>/
node scripts/deploy-images.mjs --template <模板名>

# 只回迁指定语言；尺寸与源图不一致时直接报错退出
node scripts/deploy-images.mjs --template <模板名> --lang ja,ar --strict-size
```

- 语言目录大小写解析顺序：主工程 `pages/<模板>/build.config.json` 图片路径前缀 →
  主工程磁盘已有同名目录（大小写无关）→ 兜底小写语言码。
- 每张图自动与 `source/` 同名源图核对像素尺寸（sips），不一致默认告警，`--strict-size` 时阻断。
- 回迁后必须在主工程真实页面逐语言验证（加载、尺寸、清晰度、相邻 UI），并按流程登记
  `multilingual-review.json`（status=pending，人工审批）。
