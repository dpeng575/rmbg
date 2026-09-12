import type { Metadata } from "next";
import { LegalDocument } from "@/components/site/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy | SwitchBG",
  description: "How SwitchBG handles images and basic website request data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy"
      summary="SwitchBG processes selected images in your browser. The image file is not uploaded to SwitchBG servers."
    >
      <section>
        <h2>Image processing</h2>
        <p>
          Your browser reads the image you select, runs background removal, and
          creates the result on your device. SwitchBG does not send the selected
          image file or generated result to its servers.
        </p>
      </section>
      <section>
        <h2>Network requests</h2>
        <p>
          SwitchBG is not a fully offline application. Your browser connects to
          the site to load the page, sample images, and AI model and runtime
          files. First use may download about 76 MB of those AI resources;
          browser caching can reduce later downloads.
        </p>
      </section>
      <section>
        <h2>Logs and analytics</h2>
        <p>
          SwitchBG currently includes no analytics or advertising scripts.
          Hosting and delivery providers may still process standard request
          data such as IP address, user agent, requested URL, timestamps, and
          error information for security and reliable delivery. We therefore do
          not claim that using the website creates zero data.
        </p>
      </section>
      <section>
        <h2>Data on your device</h2>
        <p>
          Browsers may cache the app and AI resources. Image previews use
          temporary browser memory, and downloaded results remain wherever you
          choose to save them. You can clear cached site data through your
          browser settings.
        </p>
      </section>
    </LegalDocument>
  );
}
