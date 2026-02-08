import { Form, Link } from "@remix-run/react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          to="/login"
          className="text-gray-300 hover:text-white px-3 py-2 text-sm"
        >
          Entrar
        </Link>
        <Link
          to="/signup"
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
        >
          Criar conta
        </Link>
      </div>
    );
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center space-x-2 text-gray-300 hover:text-white">
        <UserCircleIcon className="h-8 w-8" />
        <span className="text-sm hidden sm:block">{user.name}</span>
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm text-white">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <Link
                  to="/dashboard"
                  className={`${
                    focus ? "bg-gray-700" : ""
                  } block px-4 py-2 text-sm text-gray-300`}
                >
                  Minhas composições
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className={`${
                      focus ? "bg-gray-700" : ""
                    } block w-full text-left px-4 py-2 text-sm text-gray-300`}
                  >
                    Sair
                  </button>
                </Form>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
