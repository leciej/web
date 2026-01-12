// src/features/activity/store/activityStore.ts

export type Activity = {
  type: string;
  createdAt: number;
};

let activities: Activity[] = [];
let listeners: Array<() => void> = [];

export function emitActivity(type: string): void {
  activities = [
    { type, createdAt: Date.now() },
    ...activities,
  ].slice(0, 20);

  listeners.forEach(listener => listener());
}

export function getActivities(): Activity[] {
  return activities;
}

export function subscribe(listener: () => void): () => void {
  listeners.push(listener);

  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}
