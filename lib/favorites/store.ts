'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'jeya-favorites-v1';

let favoriteIds: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  listeners.forEach((l) => l());
}

function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return;
  favoriteIds = readStorage();
  hydrated = true;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  ensureHydrated();
  return favoriteIds;
}

function getServerSnapshot() {
  return [] as string[];
}

export function toggleFavorite(productId: string) {
  ensureHydrated();
  favoriteIds = favoriteIds.includes(productId)
    ? favoriteIds.filter((id) => id !== productId)
    : [...favoriteIds, productId];
  persist();
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    favoriteIds: ids,
    isFavorite: (productId: string) => ids.includes(productId),
    toggleFavorite,
  };
}
