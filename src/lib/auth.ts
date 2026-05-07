import { getStoredArray, safeJsonParse } from "./storage";

export type FabyUser = {
  id: string;
  createdAt: number;
  email: string;
  password: string;
  nom?: string;
  prenom?: string;
  sexe?: string;
  age?: number;
  telephone?: string;
  nationalite?: string;
};

const USERS_KEY = "faby_users";
const SESSION_KEY = "faby_session";

type FabySession = {
  userId: string;
  email: string;
  createdAt: number;
};

export function getUsers(): FabyUser[] {
  return getStoredArray<FabyUser>(USERS_KEY);
}

export function saveUsers(users: FabyUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function registerUser(input: Omit<FabyUser, "id" | "createdAt" | "email"> & { email: string }) {
  const email = normalizeEmail(input.email);
  if (!email) {
    return { ok: false as const, error: "L'email est requis." };
  }
  if (!input.password?.trim()) {
    return { ok: false as const, error: "Le mot de passe est requis." };
  }

  const users = getUsers();
  const exists = users.some((user) => user.email === email);
  if (exists) {
    return { ok: false as const, error: "Un compte existe deja avec cet email." };
  }

  const user: FabyUser = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt: Date.now(),
    email,
    password: input.password,
    nom: input.nom,
    prenom: input.prenom,
    sexe: input.sexe,
    age: input.age,
    telephone: input.telephone,
    nationalite: input.nationalite,
  };

  saveUsers([user, ...users]);
  return { ok: true as const, user };
}

export function authenticate(email: string, password: string) {
  const normalized = normalizeEmail(email);
  const users = getUsers();
  const user = users.find((item) => item.email === normalized);
  if (!user) return { ok: false as const, error: "Aucun compte trouve pour cet email." };
  if (user.password !== password) return { ok: false as const, error: "Mot de passe incorrect." };
  return { ok: true as const, user };
}

export function resetUserPassword(email: string, password: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { ok: false as const, error: "L'email est requis." };
  }
  if (!password.trim()) {
    return { ok: false as const, error: "Le nouveau mot de passe est requis." };
  }
  if (password.length < 8) {
    return { ok: false as const, error: "Le mot de passe doit contenir au moins 8 caracteres." };
  }

  const users = getUsers();
  const index = users.findIndex((user) => user.email === normalized);
  if (index === -1) {
    return { ok: false as const, error: "Aucun compte trouve pour cet email." };
  }

  const nextUsers = [...users];
  nextUsers[index] = {
    ...nextUsers[index],
    password,
  };

  saveUsers(nextUsers);
  return { ok: true as const };
}

export function setSession(user: FabyUser) {
  localStorage.setItem("faby_logged", "true");
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
    }),
  );
}

export function getSession() {
  const parsed = safeJsonParse<FabySession | null>(localStorage.getItem(SESSION_KEY), null);
  if (!parsed?.userId || !parsed.email) {
    return null;
  }
  return parsed;
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;

  const users = getUsers();
  return (
    users.find((user) => user.id === session.userId) ??
    users.find((user) => user.email === normalizeEmail(session.email)) ??
    null
  );
}

export function updateUser(userId: string, updates: Partial<Omit<FabyUser, "id" | "createdAt">>) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    return { ok: false as const, error: "Utilisateur introuvable." };
  }

  const nextEmail = updates.email ? normalizeEmail(updates.email) : users[index].email;
  const emailTaken = users.some((user, currentIndex) => currentIndex !== index && user.email === nextEmail);
  if (emailTaken) {
    return { ok: false as const, error: "Cet email est deja utilise." };
  }

  const nextUser: FabyUser = {
    ...users[index],
    ...updates,
    email: nextEmail,
  };

  const nextUsers = [...users];
  nextUsers[index] = nextUser;
  saveUsers(nextUsers);

  const session = getSession();
  if (session?.userId === userId) {
    setSession(nextUser);
  }

  return { ok: true as const, user: nextUser };
}

export function clearSession() {
  localStorage.setItem("faby_logged", "false");
  localStorage.removeItem(SESSION_KEY);
}
