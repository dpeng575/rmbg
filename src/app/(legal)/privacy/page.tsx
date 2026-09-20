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
          With your permission, SwitchBG uses Google Analytics 4 to understand
          whether visitors use features such as upload, background selection,
          comparison, batch processing, and download, and where those workflows
          fail. We send only predefined event names and broad categories such as
          processing mode, result format, duration range, and controlled failure
          reason. We do not send selected images, generated images, filenames,
          image URLs, image contents, or raw error messages to Google Analytics.
        </p>
        <p>
          Google Analytics may process browser, device, approximate location,
          cookie, and on-site activity data. Analytics is disabled unless you
          accept it, Google Signals and advertising personalization are disabled,
          and you can change your choice at any time through “Analytics settings”
          in the footer. Our Google Analytics property should use the shortest
          practical event-data retention setting. See Google&apos;s{" "}
          <a href="https://policies.google.com/privacy" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </p>
        <p>
          Hosting and delivery providers may still process standard request data
          such as IP address, user agent, requested URL, timestamps, and error
          information for security and reliable delivery. We therefore do not
          claim that using the website creates zero data.
        </p>
      </section>
      <section>
        <h2>Data on your device</h2>
        <p>
          Browsers may cache the app and AI resources. Image previews use
          temporary browser memory, and downloaded results remain wherever you
          choose to save them. Your analytics preference is stored in local
          browser storage; if you accept analytics, Google Analytics may set
          first-party cookies. You can change the preference in the footer or
          clear cached site data through your browser settings.
        </p>
      </section>
    </LegalDocument>
  );
}
