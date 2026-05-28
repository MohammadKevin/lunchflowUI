'use client'

import Link from 'next/link'

import {
  usePathname,
  useRouter,
} from 'next/navigation'

import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Tags,
  Users,
  X,
} from 'lucide-react'

import { useState } from 'react'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  const pathname =
    usePathname()

  const [isOpen, setIsOpen] =
    useState(false)

  const menus = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: LayoutDashboard,
    },

    {
      title: 'Users',
      href: '/dashboard/admin/users',
      icon: Users,
    },

    {
      title: 'Sellers',
      href: '/dashboard/admin/sellers',
      icon: ShoppingBag,
    },

    {
      title: 'Categories',
      href: '/dashboard/admin/categories',
      icon: Tags,
    },

    {
      title: 'Orders',
      href: '/dashboard/admin/orders',
      icon: Package,
    },

    {
      title: 'Payments',
      href: '/dashboard/admin/payments',
      icon: CreditCard,
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem(
      'accessToken',
    )

    localStorage.removeItem(
      'user',
    )

    router.push('/')
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
        <div className="flex h-20 items-center justify-between border-b px-6">
          <Link
            href="/dashboard/admin"
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
                Admin Panel
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

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {menus.map((menu) => {
            const Icon =
              menu.icon

            const isActive =
              pathname ===
              menu.href

            return (
              <Link
                key={menu.title}
                href={menu.href}
                onClick={() =>
                  setIsOpen(false)
                }
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                }`}
              >
                <Icon className="h-5 w-5" />

                <span className="font-medium">
                  {menu.title}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="border-t p-4">
          <button
            onClick={
              handleLogout
            }
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />

            <span className="font-medium">
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
                Admin Dashboard
              </h2>

              <p className="text-xs text-gray-500 sm:text-sm">
                Welcome back admin 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <h3 className="font-semibold text-gray-900">
                Super Admin
              </h3>

              <p className="text-sm text-gray-500">
                kvn4.200581@gmail.com
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
              SA
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