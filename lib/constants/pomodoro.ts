import { Brain, Coffee } from 'lucide-react';

export const POMODORO_MODES = {
  pomodoro: { id: 'pomodoro', time: 25 * 60, icon: Brain },
  shortBreak: { id: 'shortBreak', time: 5 * 60, icon: Coffee },
  longBreak: { id: 'longBreak', time: 15 * 60, icon: Coffee },
} as const;
