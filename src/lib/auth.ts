export type FabyUser = {
  id: string;
  createdAt: number;
  email: string; // normalized lower-case
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

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getUsers(): FabyUser[] {
  const parsed = safeJsonParse<unknown>(localStorage.getItem(USERS_KEY), []);
  if (!Array.isArray(parsed)) return [];
  return parsed as FabyUser[];
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
  const exists = users.some((u) => u.email === email);
  if (exists) {
    return { ok: false as const, error: "Un compte existe déjà avec cet email." };
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
  const user = users.find((u) => u.email === normalized);
  if (!user) return { ok: false as const, error: "Aucun compte trouvé pour cet email." };
  if (user.password !== password) return { ok: false as const, error: "Mot de passe incorrect." };
  return { ok: true as const, user };
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

export function clearSession() {
  localStorage.setItem("faby_logged", "false");
  localStorage.removeItem(SESSION_KEY);
}

