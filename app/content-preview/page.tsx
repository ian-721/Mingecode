import type { Metadata } from "next";
import { ContentPreviewApp } from "@/components/content-preview/content-preview-app";
import {
  assertRepresentativeContentTraces,
  representativeDiagnostics,
} from "./contract-self-check";

assertRepresentativeContentTraces();

export const metadata: Metadata = {
  title: "命盘主导内容预览｜命格译码",
  description: "命盘决定核心内容，问题只补充现实显化的非生产预览。",
};

export default function ContentPreviewPage() {
  return (
    <>
      <pre id="representative-diagnostics">
        {JSON.stringify(representativeDiagnostics, null, 2)}
      </pre>
      <ContentPreviewApp />
    </>
  );
}
