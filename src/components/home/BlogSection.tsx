import { Section } from "./Section";
import { posts } from "@/content/home";

const TAG_STYLES: Record<string, string> = {
  电商: "bg-vermilion-wash text-vermilion-deep",
  教程: "bg-jade-wash text-jade",
  技术: "bg-mist text-ink-soft",
};

export function BlogSection() {
  return (
    <Section
      id="blog"
      kicker="03 · 博客"
      title="读一点抠图之外的"
      sub="使用技巧、工作流实战与端侧 AI 的工程笔记。"
    >
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-mist bg-panel shadow-panel transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-mist-deep"
          >
            {/* 卡片头:棋盘格变奏 */}
            <div
              aria-hidden
              className={`checkerboard h-28 border-b border-mist ${post.tag === "电商" ? "opacity-90" : post.tag === "教程" ? "opacity-70" : "opacity-50"}`}
            >
              <div className="size-full bg-gradient-to-br from-transparent via-transparent to-panel/60" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_STYLES[post.tag] ?? TAG_STYLES.技术}`}
                >
                  {post.tag}
                </span>
                <time className="font-mono text-xs text-ink-faint">
                  {post.date}
                </time>
              </div>
              <h3 className="mt-3 leading-snug font-semibold transition-colors group-hover:text-vermilion-deep">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
