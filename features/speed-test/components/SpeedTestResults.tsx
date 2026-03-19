import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Activity, Timer, ArrowDown, ArrowUp } from "lucide-react";
import { SpeedTestResult } from "../types";

interface SpeedTestResultsProps {
  result: SpeedTestResult;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}

function StatItem({ icon, label, value, sub }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-2xl font-black tracking-tight text-foreground">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{sub}</span>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function SpeedTestResults({ result }: SpeedTestResultsProps) {
  return (
    <Card className="rounded-2xl shadow-none border-border/60 w-full">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-around gap-2">
          <StatItem
            icon={<Timer className="w-4 h-4" />}
            label="Ping"
            value={`${result.ping}`}
            sub="ms"
          />
          <Separator orientation="vertical" className="h-12" />
          <StatItem
            icon={<Activity className="w-4 h-4" />}
            label="Jitter"
            value={`${result.jitter}`}
            sub="ms"
          />
          <Separator orientation="vertical" className="h-12" />
          <StatItem
            icon={<ArrowDown className="w-4 h-4" />}
            label="Download"
            value={`${result.download}`}
            sub="Mbps"
          />
          <Separator orientation="vertical" className="h-12" />
          <StatItem
            icon={<ArrowUp className="w-4 h-4" />}
            label="Upload"
            value={`${result.upload}`}
            sub="Mbps"
          />
        </div>
      </CardContent>
    </Card>
  );
}
