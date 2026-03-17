"use client";
import { BlurCard } from "@/components/blur-card";
import BreadCrumb from "@/components/bread-crumb";
import PomodoroTimer from "@/components/pomodoro-timer";
import { useTranslations } from "next-intl";

export default function PomodoroTimerPage() {
  const t = useTranslations("PomodoroTimer");

  return (
    <BreadCrumb
      firstBreadcrumb={t("breadcrumb1")}
      secondBreadcrumb={t("breadcrumb2")}
    >
      <BlurCard title={t("title")} subTitle={t("subTitle")}>
        <PomodoroTimer />
      </BlurCard>
    </BreadCrumb>
  );
}
