"use client";

import { useState } from "react";
import { CopyIcon, RefreshCwIcon, CheckIcon } from "lucide-react";
import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from "uuid";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import type { UuidVersion } from "@/lib/types/uuid";

export function UuidGenerator() {
  const t = useTranslations("UuidGenerator");
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateUuids = () => {
    const newUuids = Array.from({ length: quantity }, () => {
      let id;
      if (version === "v1") id = uuidv1();
      else if (version === "v7") id = uuidv7();
      else id = uuidv4();
      
      if (!hyphens) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      if (braces) id = `{${id}}`;
      return id;
    });
    setUuids(newUuids);
    setCopied(false);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-8">
      <Card className="border-border/50 bg-card/50 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 grid gap-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="grid gap-3 flex-1">
              <Label htmlFor="version" className="text-muted-foreground">{t("version")}</Label>
              <Select value={version} onValueChange={(v) => setVersion(v as any)}>
                <SelectTrigger id="version" className="h-11 rounded-xl bg-background/50 hover:bg-background/80 transition-colors">
                  <SelectValue placeholder={t("version")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="v4" className="rounded-lg cursor-pointer">{t("v4Name")}</SelectItem>
                  <SelectItem value="v7" className="rounded-lg cursor-pointer">{t("v7Name")}</SelectItem>
                  <SelectItem value="v1" className="rounded-lg cursor-pointer">{t("v1Name")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3 flex-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="quantity" className="text-muted-foreground">{t("quantity")}</Label>
                <span className="text-sm font-medium text-foreground bg-muted px-2 py-0.5 rounded-md">{quantity}</span>
              </div>
              <div className="flex items-center gap-4 h-11">
                <Slider 
                  id="quantity"
                  min={1} 
                  max={50} 
                  step={1} 
                  value={[quantity]} 
                  onValueChange={(v) => setQuantity(v[0])}
                  className="flex-1 cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>
            
            <Button onClick={generateUuids} size="lg" className="rounded-xl h-11 gap-2 w-full sm:w-auto mt-4 sm:mt-0 shadow-sm hover:shadow transition-all">
              <RefreshCwIcon className="h-4 w-4" />
              {t("generate")}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-6 pt-6 border-t border-border/40">
            <div className="flex items-center space-x-3">
              <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} />
              <Label htmlFor="hyphens" className="font-medium text-muted-foreground cursor-pointer select-none">{t("hyphens")}</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
              <Label htmlFor="uppercase" className="font-medium text-muted-foreground cursor-pointer select-none">{t("uppercase")}</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="braces" checked={braces} onCheckedChange={setBraces} />
              <Label htmlFor="braces" className="font-medium text-muted-foreground cursor-pointer select-none">{t("braces")}</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative group mx-2 sm:mx-0">
        <textarea
          readOnly
          value={uuids.join("\n")}
          rows={Math.min(12, Math.max(5, uuids.length))}
          className="w-full rounded-2xl border-2 border-border/20 bg-muted/30 hover:bg-muted/50 transition-colors px-5 py-4 text-[15px] font-mono leading-relaxed outline-none focus:border-primary/30 break-all resize-none shadow-inner"
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute right-3 top-3 gap-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 shadow-sm bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={copyAll}
        >
          {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4 text-muted-foreground" />}
          {copied ? t("copied") : t("copyAll")}
        </Button>
      </div>
    </div>
  );
}
