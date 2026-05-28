'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'

import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  X,
} from 'lucide-react'

import { useState } from 'react'

const menus = [
  {
    name: 'Dashboard',
    href: '/dashboard/seller',
    icon: LayoutDashboard,
  },

  {
    name: 'Menus',
    href: '/dashboard/seller/menus',
    icon: UtensilsCrossed,
  },

  {
    name: 'Orders',
    href: '/dashboard/seller/orders',
    icon: ShoppingBag,
  },

  {
    name: 'Payments',
    href: '/dashboard/seller/payments',
    icon: CreditCard,
  },

  {
    name: 'Store',
    href: '/dashboard/seller/store',
    icon: Store,
  },
]

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname =
    usePathname()

  const [isOpen, setIsOpen] =
    useState(false)

  const logout = () => {
    localStorage.removeItem(
      'accessToken',
    )

    localStorage.removeItem(
      'user',
    )

    window.location.href =
      '/login'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
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
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h1 className="text-2xl font-black text-orange-500">
              LunchFlow
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Seller Panel
            </p>
          </div>

          <button
            onClick={() =>
              setIsOpen(false)
            }
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menus.map((menu) => {
            const Icon =
              menu.icon

            const isActive =
              pathname ===
              menu.href

            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() =>
                  setIsOpen(false)
                }
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {menu.name}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b bg-white px-4 sm:px-6">
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
                Seller Dashboard
              </h2>

              <p className="text-xs text-gray-500 sm:text-sm">
                Welcome back 👋
              </p>
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
            SL
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}