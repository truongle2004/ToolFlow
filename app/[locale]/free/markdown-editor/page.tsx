"use client";
import { BlurCard } from "@/components/blur-card";
import BreadCrumb from "@/components/bread-crumb";
import { MarkdownEditor } from "@/features/markdown-editor/components/MarkdownEditor";
import { useTranslations } from "next-intl";

export default function MarkdownEditorPage() {
  const t = useTranslations("MarkdownEditor");
  return (
    <BreadCrumb
      firstBreadcrumb={t("breadcrumb1")}
      secondBreadcrumb={t("breadcrumb2")}
    >
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-4">
        <div className="col-span-3">
          <BlurCard title={t("title")} subTitle={t("subTitle")}>
            <MarkdownEditor />
          </BlurCard>
        </div>
      </div>
    </BreadCrumb>
  );
}
