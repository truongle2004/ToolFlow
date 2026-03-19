import { BlurCard } from "@/components/blur-card";
import BreadCrumb from "@/components/bread-crumb";
import { WheelContainer } from "@/features/wheel-of-name/components/WheelContainer";
import { useTranslations } from "next-intl";

export default function WheelOfNamePage() {
  const t = useTranslations("WheelOfName");
  return (
    <BreadCrumb firstBreadcrumb={t("breadcrumb1")} secondBreadcrumb={t("breadcrumb2")}>
      <BlurCard title={t("title")} subTitle={t("subTitle")}>
        <WheelContainer />
      </BlurCard>
    </BreadCrumb>
  );
}
