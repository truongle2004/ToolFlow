"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw, BarChart3, Coffee, Brain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const MODES = {
  pomodoro: { id: "pomodoro", time: 25 * 60, icon: Brain },
  shortBreak: { id: "shortBreak", time: 5 * 60, icon: Coffee },
  longBreak: { id: "longBreak", time: 15 * 60, icon: Coffee },
};

type ModeKey = keyof typeof MODES;

interface DailyStats {
  date: string;
  completedPomodoros: number;
  focusTimeMinutes: number;
}

export default function PomodoroTimer() {
  const t = useTranslations("PomodoroTimer");

  // Timer state
  const [mode, setMode] = useState<ModeKey>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(MODES.pomodoro.time);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Statistics state
  const [stats, setStats] = useState<DailyStats>({
    date: new Date().toDateString(),
    completedPomodoros: 0,
    focusTimeMinutes: 0,
  });

  // Load stats from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("toolflow-pomodoro-stats");
    if (saved) {
      const parsedStats: DailyStats = JSON.parse(saved);
      // Reset if it's a new day
      if (parsedStats.date !== new Date().toDateString()) {
        const freshStats = {
          date: new Date().toDateString(),
          completedPomodoros: 0,
          focusTimeMinutes: 0,
        };
        setStats(freshStats);
        localStorage.setItem("toolflow-pomodoro-stats", JSON.stringify(freshStats));
      } else {
        setStats(parsedStats);
      }
    }
  }, []);

  // Save stats to local storage on change
  useEffect(() => {
    localStorage.setItem("toolflow-pomodoro-stats", JSON.stringify(stats));
  }, [stats]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      setIsActive(false);

      if (mode === "pomodoro") {
        setStats((prev) => ({
          ...prev,
          completedPomodoros: prev.completedPomodoros + 1,
          focusTimeMinutes: prev.focusTimeMinutes + MODES.pomodoro.time / 60,
        }));
        
        // Notification sound could go here
        
        // Auto-switch to break based on completed pomodoros
        const newPomodoros = stats.completedPomodoros + 1;
        if (newPomodoros % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        // Break finished, go back to pomodoro
        switchMode("pomodoro");
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, stats.completedPomodoros]);

  const switchMode = useCallback((newMode: ModeKey) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
    setIsActive(false);
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const ModeIcon = MODES[mode].icon;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full min-h-[600px]">
      {/* Timer Section - Left Side */}
      <div className="lg:col-span-2 xl:col-span-3 rounded-2xl border border-border/50 bg-card/10 backdrop-blur-xl p-8 shadow-lg flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500">
        
        {/* Animated Background gradients based on mode */}
        <div 
          className={`absolute inset-0 opacity-10 transition-colors duration-1000 ${
            mode === "pomodoro" ? "bg-gradient-to-br from-red-500/40 via-transparent" :
            mode === "shortBreak" ? "bg-gradient-to-br from-emerald-500/40 via-transparent" : 
            "bg-gradient-to-br from-blue-500/40 via-transparent"
          }`} 
        />
        
        {/* Subtle glowing orb behind timer */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-all duration-1000 ${
            mode === "pomodoro" ? "bg-red-500" :
            mode === "shortBreak" ? "bg-emerald-500" : "bg-blue-500"
          }`}
        />

        <div className="flex items-center gap-1.5 mb-12 bg-background/60 backdrop-blur-md p-1.5 rounded-full border border-border/50 z-10 shadow-sm">
          <Button
            variant={mode === "pomodoro" ? "default" : "ghost"}
            size="sm"
            className={`rounded-full px-6 transition-all ${mode === "pomodoro" ? "shadow-md bg-foreground text-background" : "hover:bg-foreground/5"}`}
            onClick={() => switchMode("pomodoro")}
          >
            {t("pomodoro")}
          </Button>
          <Button
            variant={mode === "shortBreak" ? "default" : "ghost"}
            size="sm"
            className={`rounded-full px-6 transition-all ${mode === "shortBreak" ? "shadow-md bg-emerald-600 hover:bg-emerald-700 text-white" : "hover:bg-foreground/5"}`}
            onClick={() => switchMode("shortBreak")}
          >
            {t("shortBreak")}
          </Button>
          <Button
            variant={mode === "longBreak" ? "default" : "ghost"}
            size="sm"
            className={`rounded-full px-6 transition-all ${mode === "longBreak" ? "shadow-md bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-foreground/5"}`}
            onClick={() => switchMode("longBreak")}
          >
            {t("longBreak")}
          </Button>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center mb-16">
          {/* Animated concentric rings */}
          <div className={`absolute inset-[-20px] rounded-full border border-border/40 transition-all duration-1000 ${isActive ? 'scale-105 opacity-50' : 'scale-100 opacity-20'}`} />
          <div className={`absolute inset-[-40px] rounded-full border border-border/20 transition-all duration-1000 ${isActive ? 'scale-110 opacity-30 delay-75' : 'scale-100 opacity-10'}`} />
          <div className={`absolute inset-[-60px] rounded-full border border-border/10 transition-all duration-1000 ${isActive ? 'scale-110 opacity-20 delay-150' : 'scale-100 opacity-5'}`} />

          <div className="w-80 h-80 rounded-full border-2 border-border/40 bg-background/40 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <ModeIcon className={`w-10 h-10 mb-6 transition-colors duration-700 ${
                mode === "pomodoro" ? "text-foreground" :
                mode === "shortBreak" ? "text-emerald-500" : "text-blue-500"
              }`} 
            />
            <div className="text-8xl font-black tracking-tighter font-mono tabular-nums text-foreground drop-shadow-sm">
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress indicator outline */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle 
                cx="160" 
                cy="160" 
                r="158" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray={2 * Math.PI * 158}
                strokeDashoffset={2 * Math.PI * 158 * (1 - timeLeft / MODES[mode].time)}
                className={`transition-all duration-1000 ease-linear ${
                  mode === "pomodoro" ? "text-foreground/20" :
                  mode === "shortBreak" ? "text-emerald-500/20" : "text-blue-500/20"
                }`}
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-6 z-10">
          <Button
            size="lg"
            variant="default"
            className={`w-40 h-14 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95 border-0 ${
              mode === "pomodoro" ? (isActive ? "bg-muted text-foreground hover:bg-muted/80" : "bg-foreground text-background hover:bg-foreground/90") :
              mode === "shortBreak" ? (isActive ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-600 hover:bg-emerald-700 text-white") :
              (isActive ? "bg-blue-950/40 text-blue-400" : "bg-blue-600 hover:bg-blue-700 text-white")
            }`}
            onClick={toggleTimer}
          >
            {isActive ? (
              <>
                <Pause className="w-6 h-6 mr-2" /> {t("pause")}
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2 fill-current" /> {t("start")}
              </>
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full w-14 h-14 shadow-sm transition-all hover:scale-105 active:scale-95 hover:rotate-[-45deg] bg-background/50 backdrop-blur-sm border-border/50"
            onClick={resetTimer}
            title={t("reset")}
          >
            <RotateCcw className="w-6 h-6 text-foreground/70" />
          </Button>
        </div>
      </div>

      {/* Statistics Section - Right Side */}
      <div className="lg:col-span-1 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-lg flex flex-col h-full relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-border/50 relative z-10">
          <div className="p-2.5 rounded-xl bg-foreground text-background shadow-md">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg">{t("statsToday")}</h3>
        </div>

        <div className="flex flex-col gap-6 flex-1 justify-center relative z-10">
          <div className="flex flex-col justify-center p-8 rounded-2xl bg-background/50 border border-border/50 shadow-sm backdrop-blur-sm group hover:border-foreground/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{t("completedPomodoros")}</span>
              <Brain className="w-4 h-4 text-primary/50" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tight text-foreground group-hover:scale-105 transition-transform origin-left">
                {stats.completedPomodoros}
              </span>
              <span className="text-sm font-bold text-muted-foreground">/ 8</span>
            </div>
            {/* Mini progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-foreground rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min((stats.completedPomodoros / 8) * 100, 100)}%` }} 
              />
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 rounded-2xl bg-background/50 border border-border/50 shadow-sm backdrop-blur-sm group hover:border-foreground/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{t("focusTime")}</span>
              <Play className="w-4 h-4 text-emerald-500/50" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tight text-foreground group-hover:scale-105 transition-transform origin-left">
                {stats.focusTimeMinutes}
              </span>
              <span className="text-xl font-medium text-muted-foreground ml-1">m</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/50 text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t("studio")}
          </div>
        </div>
      </div>
    </div>
  );
}
