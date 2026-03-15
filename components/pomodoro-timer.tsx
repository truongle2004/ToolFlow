'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Pause, RotateCcw, BarChart3, Coffee, Brain } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { POMODORO_MODES } from '@/lib/constants/pomodoro';
import type { ModeKey, DailyStats } from '@/lib/types/pomodoro';

export default function PomodoroTimer() {
  const t = useTranslations('PomodoroTimer');

  const [mode, setMode] = useState<ModeKey>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(
    POMODORO_MODES.pomodoro.time,
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [stats, setStats] = useState<DailyStats>({
    date: new Date().toDateString(),
    completedPomodoros: 0,
    focusTimeMinutes: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('toolflow-pomodoro-stats');
    if (saved) {
      const parsedStats: DailyStats = JSON.parse(saved);
      if (parsedStats.date !== new Date().toDateString()) {
        const freshStats = {
          date: new Date().toDateString(),
          completedPomodoros: 0,
          focusTimeMinutes: 0,
        };
        setStats(freshStats);
        localStorage.setItem(
          'toolflow-pomodoro-stats',
          JSON.stringify(freshStats),
        );
      } else {
        setStats(parsedStats);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('toolflow-pomodoro-stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (mode === 'pomodoro') {
        setStats((prev) => ({
          ...prev,
          completedPomodoros: prev.completedPomodoros + 1,
          focusTimeMinutes:
            prev.focusTimeMinutes + POMODORO_MODES.pomodoro.time / 60,
        }));
        const newPomodoros = stats.completedPomodoros + 1;
        if (newPomodoros % 4 === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('pomodoro');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, stats.completedPomodoros]);

  const switchMode = useCallback((newMode: ModeKey) => {
    setMode(newMode);
    setTimeLeft(POMODORO_MODES[newMode].time);
    setIsActive(false);
  }, []);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(POMODORO_MODES[mode].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress =
    ((POMODORO_MODES[mode].time - timeLeft) / POMODORO_MODES[mode].time) * 100;
  const ModeIcon = POMODORO_MODES[mode].icon;

  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full min-h-[600px]'>
      {/* Timer Card */}
      <Card className='lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center rounded-3xl shadow-sm'>
        <CardHeader className='w-full flex flex-col items-center gap-4 pb-0'>
          <Tabs
            value={mode}
            onValueChange={(val) => switchMode(val as ModeKey)}
            className='w-auto'
          >
            <TabsList className='rounded-full px-1 h-10'>
              <TabsTrigger
                value='pomodoro'
                className='rounded-full px-5 text-sm'
              >
                {t('pomodoro')}
              </TabsTrigger>
              <TabsTrigger
                value='shortBreak'
                className='rounded-full px-5 text-sm'
              >
                {t('shortBreak')}
              </TabsTrigger>
              <TabsTrigger
                value='longBreak'
                className='rounded-full px-5 text-sm'
              >
                {t('longBreak')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className='flex flex-col items-center justify-center gap-10 py-10'>
          {/* Timer circle */}
          <div className='relative flex items-center justify-center w-72 h-72'>
            <svg className='absolute inset-0 w-full h-full -rotate-90'>
              <circle
                cx='144'
                cy='144'
                r='136'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                className='text-border'
              />
              <circle
                cx='144'
                cy='144'
                r='136'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                strokeLinecap='round'
                strokeDasharray={2 * Math.PI * 136}
                strokeDashoffset={2 * Math.PI * 136 * (1 - progress / 100)}
                className='text-foreground transition-all duration-1000 ease-linear'
              />
            </svg>

            <div className='flex flex-col items-center gap-2 z-10'>
              <ModeIcon className='w-7 h-7 text-muted-foreground' />
              <span className='text-7xl font-black tracking-tighter font-mono tabular-nums text-foreground'>
                {formatTime(timeLeft)}
              </span>
              <Badge
                variant='outline'
                className='text-xs text-muted-foreground rounded-full px-3'
              >
                {t(mode)}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center gap-4'>
            <Button
              size='lg'
              className='w-36 h-12 rounded-full font-semibold text-base shadow-sm'
              onClick={toggleTimer}
            >
              {isActive ? (
                <>
                  <Pause className='w-5 h-5 mr-2' />
                  {t('pause')}
                </>
              ) : (
                <>
                  <Play className='w-5 h-5 mr-2 fill-current' />
                  {t('start')}
                </>
              )}
            </Button>
            <Button
              size='icon'
              variant='outline'
              className='rounded-full w-12 h-12 hover:rotate-[-45deg] transition-transform'
              onClick={resetTimer}
              title={t('reset')}
            >
              <RotateCcw className='w-5 h-5 text-muted-foreground' />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className='lg:col-span-1 flex flex-col rounded-3xl shadow-sm'>
        <CardHeader className='flex flex-row items-center gap-3 pb-4'>
          <div className='p-2 rounded-xl bg-primary text-primary-foreground'>
            <BarChart3 className='w-4 h-4' />
          </div>
          <CardTitle className='text-base font-semibold'>
            {t('statsToday')}
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className='flex flex-col gap-4 flex-1 justify-center pt-6'>
          {/* Pomodoros stat */}
          <Card className='rounded-2xl shadow-none border-border/60'>
            <CardContent className='pt-5 pb-5'>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-sm text-muted-foreground'>
                  {t('completedPomodoros')}
                </span>
                <Brain className='w-4 h-4 text-muted-foreground' />
              </div>
              <div className='flex items-baseline gap-1.5 mb-3'>
                <span className='text-5xl font-black tracking-tight text-foreground'>
                  {stats.completedPomodoros}
                </span>
                <span className='text-sm text-muted-foreground font-medium'>
                  / 8
                </span>
              </div>
              <Progress
                value={Math.min((stats.completedPomodoros / 8) * 100, 100)}
                className='h-1.5'
              />
            </CardContent>
          </Card>

          {/* Focus time stat */}
          <Card className='rounded-2xl shadow-none border-border/60'>
            <CardContent className='pt-5 pb-5'>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-sm text-muted-foreground'>
                  {t('focusTime')}
                </span>
                <Play className='w-4 h-4 text-muted-foreground' />
              </div>
              <div className='flex items-baseline gap-1'>
                <span className='text-5xl font-black tracking-tight text-foreground'>
                  {stats.focusTimeMinutes}
                </span>
                <span className='text-lg text-muted-foreground font-medium ml-1'>
                  m
                </span>
              </div>
            </CardContent>
          </Card>
        </CardContent>

        <Separator />

        <CardFooter className='justify-center pt-4 pb-5'>
          <Badge
            variant='secondary'
            className='gap-1.5 rounded-full px-4 py-1.5 text-xs'
          >
            <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block' />
            {t('studio')}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
