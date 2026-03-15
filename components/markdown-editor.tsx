"use client";

import { useTranslations } from "next-intl";

export function MarkdownEditor() {
  const t = useTranslations("MarkdownEditor");

  return (
    <div className="w-full h-full min-h-[700px] border border-border/50 rounded-2xl overflow-hidden bg-background">
      <iframe
        src="https://stackedit.io/app"
        title={t("title")}
        className="w-full h-full border-0 min-h-[700px]"
        allow="clipboard-write"
      />
    </div>
  );
}
