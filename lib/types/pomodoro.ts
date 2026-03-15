export interface DailyStats {
  date: string;
  completedPomodoros: number;
  focusTimeMinutes: number;
}

export type ModeKey = 'pomodoro' | 'shortBreak' | 'longBreak';
