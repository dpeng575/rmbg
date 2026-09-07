"use client";

import { useState, type FormEvent } from "react";
import { MailCheck, Send } from "lucide-react";

/** 订阅区块:墨色面板打断页面节奏;纯前端演示,不接后端 */
export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    setDone(true);
  };

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-paper shadow-lift sm:px-12 sm:py-16">
          {/* 角部棋盘格装饰 */}
          <div
            aria-hidden
            className="checkerboard-fine absolute -top-6 -right-6 size-32 rotate-12 opacity-25"
          />
          <div
            aria-hidden
            className="checkerboard-fine absolute -bottom-8 -left-8 size-32 -rotate-12 opacity-25"
          />

          <div className="relative">
            <p className="font-mono text-xs tracking-wide text-vermilion">
              NEWSLETTER
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              获取更新
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/70">
              加入邮件列表,第一时间收到产品动态与抠图技巧。随时可以取消订阅。
            </p>

            {done ? (
              <p className="animate-pop mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-6 py-3 text-sm font-medium">
                <MailCheck className="size-4 text-vermilion" />
                已订阅!更新会第一时间送达你的邮箱。
              </p>
            ) : (
              <form
                onSubmit={submit}
                className="mx-auto mt-8 flex max-w-md items-center gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="邮箱地址"
                  className="min-w-0 flex-1 rounded-full border border-paper/20 bg-paper/10 px-5 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-vermilion focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-vermilion px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-vermilion-deep"
                >
                  <Send className="size-4" />
                  订阅
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
