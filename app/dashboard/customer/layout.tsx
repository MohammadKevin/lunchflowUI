'use client'

import Link from 'next/link'

import {
  usePathname,
  useRouter,
} from 'next/navigation'

import {
  Bell,
  Heart,
  Home,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  X,
} from 'lucide-react'

import { useState } from 'react'

const menus = [
  {
    title: 'Dashboard',
    href: '/dashboard/customer',
    icon: Home,
  },

  {
    title: 'Menus',
    href:
      '/dashboard/customer/menus',
    icon: ShoppingBag,
  },

  {
    title: 'Sellers',
    href:
      '/dashboard/customer/sellers',
    icon: Store,
  },

  {
    title: 'Cart',
    href:
      '/dashboard/customer/cart',
    icon: ShoppingCart,
  },

  {
    title: 'Orders',
    href:
      '/dashboard/customer/orders',
    icon: Package,
  },

  {
    title: 'Favorites',
    href:
      '/dashboard/customer/favorites',
    icon: Heart,
  },

  {
    title: 'Notifications',
    href:
      '/dashboard/customer/notifications',
    icon: Bell,
  },

  {
    title: 'Profile',
    href:
      '/dashboard/customer/profile',
    icon: User,
  },
]

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname =
    usePathname()

  const router = useRouter()

  const [isOpen, setIsOpen] =
    useState(false)

  const isActive = (
    href: string,
  ) => {
    if (
      href ===
      '/dashboard/customer'
    ) {
      return (
        pathname === href
      )
    }

    return pathname.startsWith(
      href,
    )
  }

  const logout = () => {
    localStorage.removeItem(
      'accessToken',
    )

    localStorage.removeItem(
      'user',
    )

    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {isOpen && (
        <div
          onClick={() =>
            setIsOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r bg-white transition-all duration-300 lg:static lg:translate-x-0 ${
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b px-6">
          <Link
            href="/dashboard/customer"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-lg font-black text-gray-900">
                LunchFlow
              </h1>

              <p className="text-sm text-gray-500">
                Customer Panel
              </p>
            </div>
          </Link>

          <button
            onClick={() =>
              setIsOpen(false)
            }
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menus.map((menu) => {
              const Icon =
                menu.icon

              return (
                <Link
                  key={menu.title}
                  href={menu.href}
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all ${
                    isActive(
                      menu.href,
                    )
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span>
                    {menu.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="shrink-0 border-t p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 shrink-0 items-center justify-between border-b bg-white px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setIsOpen(true)
              }
              className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
                Customer Dashboard
              </h2>

              <p className="text-xs text-gray-500 sm:text-sm">
                Welcome back 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <h3 className="font-semibold text-gray-900">
                Customer
              </h3>

              <p className="text-sm text-gray-500">
                customer@gmail.com
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              CU
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}