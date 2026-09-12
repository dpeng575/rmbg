import type { Metadata } from "next";
import { LegalDocument } from "@/components/site/LegalDocument";

export const metadata: Metadata = {
  title: "Terms | SwitchBG",
  description: "Terms governing use of the SwitchBG browser tool.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms"
      summary="These terms govern your use of the SwitchBG website and browser-based image tool."
    >
      <section>
        <h2>Permitted use</h2>
        <p>
          SwitchBG is currently provided for personal, non-commercial use only.
          Commercial use is not authorized unless the operator confirms an
          appropriate license in writing.
        </p>
      </section>
      <section>
        <h2>Your content</h2>
        <p>
          You retain your rights in images and results. You are responsible for
          having permission to use each image and for complying with privacy,
          copyright, publicity, and other applicable laws. Do not use SwitchBG
          for unlawful, harmful, or rights-infringing content.
        </p>
      </section>
      <section>
        <h2>Service availability</h2>
        <p>
          The service is provided as available, without guarantees of accuracy,
          uninterrupted access, fitness for a particular purpose, or preservation
          of results. Keep your own copy of any image you need.
        </p>
      </section>
      <section>
        <h2>Third-party components</h2>
        <p>
          Open-source software and model components remain subject to their own
          licenses. Review the Model License page before using the service.
        </p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>
          The service and these terms may change. The date at the top identifies
          the current published version.
        </p>
      </section>
    </LegalDocument>
  );
}
