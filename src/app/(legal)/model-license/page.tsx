import type { Metadata } from "next";
import { LegalDocument } from "@/components/site/LegalDocument";

export const metadata: Metadata = {
  title: "Model License | SwitchBG",
  description: "AI model and software license information for SwitchBG.",
  alternates: { canonical: "/model-license" },
};

export default function ModelLicensePage() {
  return (
    <LegalDocument
      title="Model License"
      summary="The software and model components used for browser-based background removal have separate license terms."
    >
      <section>
        <h2>Current implementation</h2>
        <p>
          SwitchBG currently uses <code>@imgly/background-removal</code> version
          1.7.0 with the quantized IS-Net model named <code>isnet_quint8</code>.
          It does not use BRIA RMBG-1.4.
        </p>
      </section>
      <section>
        <h2>Applicable licenses</h2>
        <ul className="space-y-2">
          <li>
            The IMG.LY background-removal library is offered under the GNU
            Affero General Public License v3.0 (AGPL-3.0). See the{" "}
            <a href="https://github.com/imgly/background-removal-js/blob/main/LICENSE.md">
              official license
            </a>
            .
          </li>
          <li>
            The dependency&apos;s third-party notices identify the ISNET model as
            MIT-licensed and link to the{" "}
            <a href="https://github.com/xuebinqin/DIS">upstream DIS project</a>.
          </li>
        </ul>
      </section>
      <section>
        <h2>Usage restriction</h2>
        <p>
          Until the operator has confirmed all model redistribution and AGPL
          compliance obligations, SwitchBG is provided only for personal,
          non-commercial use. Do not rely on the service for business,
          e-commerce, advertising, or other commercial workflows.
        </p>
      </section>
      <section>
        <h2>No additional license grant</h2>
        <p>
          This notice summarizes the current implementation and does not replace
          or expand any upstream license. The upstream license texts control if
          this summary conflicts with them.
        </p>
      </section>
    </LegalDocument>
  );
}
