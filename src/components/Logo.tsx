/** 品牌标记:朱砂底 + 白色棋盘格两象限 = 「透明」的母题 */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid ${className} grid-cols-2 grid-rows-2 overflow-hidden rounded-[7px] bg-vermilion shadow-panel`}
    >
      <span className="bg-white" />
      <span />
      <span />
      <span className="bg-white" />
    </span>
  );
}
