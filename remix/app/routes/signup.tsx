import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { createUser, createUserSession, getUserByEmail, getUserId } from "~/services/session.server";
import { safeRedirectTo } from "~/services/share.server";
import { Button } from "~/components/button";

export const meta: MetaFunction = () => {
  return [{ title: "Criar conta - Polymatic" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");
  const redirectTo = safeRedirectTo(formData.get("redirectTo"));

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    return json(
      { errors: { email: null, password: null, name: null, form: "Formulário inválido" } },
      { status: 400 }
    );
  }

  if (!email.includes("@")) {
    return json(
      { errors: { email: "Email inválido", password: null, name: null, form: null } },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return json(
      { errors: { email: null, password: "Senha deve ter pelo menos 6 caracteres", name: null, form: null } },
      { status: 400 }
    );
  }

  if (name.length < 2) {
    return json(
      { errors: { email: null, password: null, name: "Nome deve ter pelo menos 2 caracteres", form: null } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      { errors: { email: "Este email já está em uso", password: null, name: null, form: null } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password, name);

  return createUserSession(user.id, redirectTo);
}

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold">Criar uma conta</h2>

        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {actionData?.errors?.form && (
            <div className="rounded-md bg-red-900 p-4">
              <p className="text-sm text-red-200">{actionData.errors.form}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500"
            />
            {actionData?.errors?.name && (
              <p className="mt-1 text-sm text-red-400">{actionData.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500"
            />
            {actionData?.errors?.email && (
              <p className="mt-1 text-sm text-red-400">{actionData.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-red-500"
            />
            {actionData?.errors?.password && (
              <p className="mt-1 text-sm text-red-400">{actionData.errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full rounded-md py-2">
            Criar conta
          </Button>

          <p className="text-center text-sm text-gray-400">
            Já tem uma conta?{" "}
            <Link
              to={{ pathname: "/login", search: searchParams.toString() }}
              className="text-red-400 hover:text-red-300"
            >
              Entrar
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
