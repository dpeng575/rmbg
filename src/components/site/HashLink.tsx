"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/**
 * 站内锚点链接:当目标与当前地址在同一页面(仅 hash 不同或完全相同)时,
 * Next 的 Link 不触发任何滚动——已位于 #tool 时点 "Change a background"
 * 会毫无反应。这里在同页点击时 preventDefault,手动平滑滚动到目标元素。
 */
export function HashLink({
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const pathname = usePathname();
  const [targetPath, targetId] = href.split("#");
  const isSamePage = (targetPath || "/") === pathname;

  const handleClick = isSamePage && targetId
    ? (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
        });
        history.replaceState(null, "", `#${targetId}`);
      }
    : undefined;

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
