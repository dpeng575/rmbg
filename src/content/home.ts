/** 首页营销区块的内容数据:改这里即可调整文案,不动组件 */

export type UseCase = {
  icon:
    | "heart"
    | "camera"
    | "megaphone"
    | "code"
    | "cart"
    | "newspaper"
    | "car"
    | "building";
  title: string;
  desc: string;
};

export const useCases: UseCase[] = [
  {
    icon: "heart",
    title: "个人",
    desc: "制作贺卡、头像和拼贴,把回忆从杂乱背景里解放出来。",
  },
  {
    icon: "camera",
    title: "摄影师",
    desc: "批量处理人像与婚礼照片,省下数小时的后期抠图时间。",
  },
  {
    icon: "megaphone",
    title: "营销",
    desc: "快速产出适配各渠道的素材,让产品与活动主视觉更聚焦。",
  },
  {
    icon: "code",
    title: "开发人员",
    desc: "一行代码接入浏览器端抠图能力,无需自建 GPU 推理服务。",
  },
  {
    icon: "cart",
    title: "电子商务",
    desc: "一键生成符合平台规范的白底/透明底商品图,提升转化。",
  },
  {
    icon: "newspaper",
    title: "媒体",
    desc: "新闻配图与封面快速换底,排版前不再被抠图拖住节奏。",
  },
  {
    icon: "car",
    title: "汽车经销商",
    desc: "上千张车辆照片批量去背景,统一呈现于干净展厅背景。",
  },
  {
    icon: "building",
    title: "企业",
    desc: "员工证照、宣传物料与品牌资产统一处理,流程可审计。",
  },
];

export type Integration = {
  icon: "wand" | "monitor" | "laptop" | "terminal" | "smartphone" | "braces";
  name: string;
  desc: string;
};

export const integrations: Integration[] = [
  { icon: "wand", name: "Photoshop 插件", desc: "在 PS 里直接调用" },
  { icon: "monitor", name: "Windows", desc: "桌面客户端" },
  { icon: "laptop", name: "macOS", desc: "桌面客户端" },
  { icon: "terminal", name: "Linux", desc: "命令行工具" },
  { icon: "smartphone", name: "Android", desc: "手机端 App" },
  { icon: "braces", name: "HTTP API", desc: "接入任何工作流" },
];

export type Post = {
  tag: string;
  date: string;
  title: string;
  excerpt: string;
};

export const posts: Post[] = [
  {
    tag: "电商",
    date: "2026-08-30",
    title: "电商产品图指南:白底图规范与批量抠图实战",
    excerpt:
      "从拍摄布光到一键批量去背景,一套可复用的商品图生产流程,让详情页转化率看得见地提升。",
  },
  {
    tag: "教程",
    date: "2026-08-12",
    title: "证件照换底色全攻略:蓝底、红底、白底一次讲清",
    excerpt:
      "不再为不同场合反复重拍。抠出透明底之后,任意底色只是一行 CSS 的事。",
  },
  {
    tag: "技术",
    date: "2026-07-25",
    title: "在浏览器里跑 AI 抠图模型:WebGPU 与 WASM 的取舍",
    excerpt:
      "ONNX 模型如何塞进浏览器?从模型量化、显存约束到加载策略,拆解端侧推理的工程细节。",
  },
];

export type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

export const footerColumns: FooterColumn[] = [
  {
    heading: "了解更多",
    links: [
      { label: "所有功能", href: "#" },
      { label: "使用场景", href: "#use-cases" },
      { label: "成功故事", href: "#" },
      { label: "路线图", href: "#" },
    ],
  },
  {
    heading: "工具和 API",
    links: [
      { label: "API 文档", href: "#" },
      { label: "集成与插件", href: "#integrations" },
      { label: "Photoshop 扩展", href: "#" },
      { label: "桌面客户端", href: "#" },
    ],
  },
  {
    heading: "支持",
    links: [
      { label: "帮助与常见问题", href: "#" },
      { label: "联系我们", href: "#" },
      { label: "服务状态", href: "#" },
    ],
  },
  {
    heading: "公司",
    links: [
      { label: "博客", href: "#blog" },
      { label: "隐私优先宣言", href: "#" },
      { label: "关于我们", href: "#" },
    ],
  },
];
