import { BlurCard } from "@/components/blur-card";
import BreadCrumb from "@/components/bread-crumb";
import { WheelContainer } from "@/features/wheel-of-name/components/WheelContainer";
import { useTranslations } from "next-intl";

export default function WheelOfNamePage() {
  const t = useTranslations("WheelOfName");
  return (
    <BreadCrumb breadcrumb={t("breadcrumb")}>
      <BlurCard title={t("title")} subTitle={t("subTitle")}>
        <WheelContainer />
      </BlurCard>
    </BreadCrumb>
  );
}
