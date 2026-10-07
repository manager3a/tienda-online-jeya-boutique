'use client';

import { useSyncExternalStore } from 'react';

export interface Usuario {
  email: string;
  pais: string;
  telefono: string;
  fechaNacimiento: string; // YYYY-MM-DD
  nombre: string;
  apellido: string;
}

const CURRENT_USER_KEY = 'jeya-current-user';
const USERS_KEY = 'jeya-users-v1';

/**
 * Registro/login mock 100% client-side (localStorage), consistente con el
 * resto de la tienda en esta fase (carrito y pedidos también son mock
 * hasta que exista backend real). No hay contraseña ni verificación: el
 * "login" solo reconoce un correo ya registrado en este navegador. Antes
 * de producción esto debe reemplazarse por autenticación real en servidor
 * (ver SECURITY.md).
 */
let currentUser: Usuario | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function readUsers(): Record<string, Usuario> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Usuario>) : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, Usuario>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    currentUser = raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    currentUser = null;
  }
  hydrated = true;
}

function persistCurrentUser() {
  if (typeof window === 'undefined') return;
  if (currentUser) {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  } else {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  ensureHydrated();
  return currentUser;
}

function getServerSnapshot() {
  return null;
}

export function registerUser(usuario: Usuario) {
  ensureHydrated();
  const users = readUsers();
  users[usuario.email.toLowerCase()] = usuario;
  writeUsers(users);
  currentUser = usuario;
  persistCurrentUser();
}

export function loginByEmail(email: string): boolean {
  ensureHydrated();
  const users = readUsers();
  const found = users[email.trim().toLowerCase()];
  if (!found) return false;
  currentUser = found;
  persistCurrentUser();
  return true;
}

export function logoutUser() {
  currentUser = null;
  persistCurrentUser();
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { user, registerUser, loginByEmail, logoutUser };
}
