import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { db } from "~/db";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request);
  const userId = session.get("userId");
  return userId ?? null;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  const user = await db
    .selectFrom("users")
    .select(["id", "email", "name"])
    .where("id", "=", userId)
    .executeTakeFirst();

  return user ?? null;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await db
    .selectFrom("users")
    .select(["id", "email", "name"])
    .where("id", "=", userId)
    .executeTakeFirst();

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// User creation
export async function createUser(
  email: string,
  password: string,
  name: string
) {
  const hashedPassword = await hashPassword(password);
  const id = crypto.randomUUID() as string;

  await db
    .insertInto("users")
    .values({
      id,
      email,
      name,
      password: hashedPassword,
    } as any)
    .execute();

  return { id, email, name };
}

// User lookup
export async function getUserByEmail(email: string) {
  return db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
}

export async function verifyLogin(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  return { id: user.id, email: user.email, name: user.name };
}
