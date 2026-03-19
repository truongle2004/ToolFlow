import { BlurCard } from "@/components/blur-card";
import BreadCrumb from "@/components/bread-crumb";
import { CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SpeedTestPage() {
  const t = useTranslations("SpeedTest");
  return (
    <BreadCrumb firstBreadcrumb={t("title")} secondBreadcrumb={t("subTitle")}>
      <BlurCard title={t("title")} subTitle={t("subTitle")}>
        <CardContent className="p-0">
          <div
            className="relative w-full"
            style={{ paddingBottom: "50%", minHeight: "360px" }}
          >
            <iframe
              src="//openspeedtest.com/speedtest"
              title="Speed Test"
              className="absolute inset-0 w-full h-full border-0"
              style={{ minHeight: "360px" }}
            />
          </div>
        </CardContent>
        <p className="text-xs text-muted-foreground">
          Provided by{" "}
          <a
            href="https://openspeedtest.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            OpenSpeedtest.com
          </a>
        </p>
      </BlurCard>
    </BreadCrumb>
  );
}
