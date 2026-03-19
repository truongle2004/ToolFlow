"use client";
import { BlurCard } from "@/components/blur-card";
import BreadCrumb from "@/components/bread-crumb";
import { UuidGenerator } from "@/features/uuid-generator/components/UuidGenerator";
import { useTranslations } from "next-intl";

export default function UuidGeneratorPage() {
  const t = useTranslations("UuidGenerator");
  return (
    <BreadCrumb breadcrumb={t("breadcrumb")}>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-4">
        <div className="col-span-3">
          <BlurCard title={t("title")} subTitle={t("subTitle")}>
            <UuidGenerator />
          </BlurCard>
        </div>
      </div>
    </BreadCrumb>
  );
}
