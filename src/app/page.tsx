import { RembgStudio } from "@/components/studio/RembgStudio";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CutLine } from "@/components/home/Section";
import { UseCaseSection } from "@/components/home/UseCaseSection";
import { IntegrationSection } from "@/components/home/IntegrationSection";
import { BlogSection } from "@/components/home/BlogSection";
import { NewsletterCta } from "@/components/home/NewsletterCta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <RembgStudio>
          <CutLine />
          <UseCaseSection />
          <IntegrationSection />
          <CutLine />
          <BlogSection />
          <NewsletterCta />
        </RembgStudio>
      </main>
      <SiteFooter />
    </>
  );
}
