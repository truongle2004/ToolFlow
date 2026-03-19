"use client";
import { BlurCard } from "@/components/blur-card";
import BreadCrumb from "@/components/bread-crumb";
import JsonEditor from "@/features/json-editor/components/JsonEditor";
import { useTranslations } from "next-intl";

export default function JsonEditorPage() {
  const t = useTranslations("JsonEditor");

  return (
    <BreadCrumb breadcrumb={t("breadcrumb")}>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="col-span-3">
          <BlurCard title={t("title")} subTitle={t("subTitle")}>
            <JsonEditor />
          </BlurCard>
        </div>
      </div>
    </BreadCrumb>
  );
}
