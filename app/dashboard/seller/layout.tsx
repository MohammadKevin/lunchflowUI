'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CreditCard,
  Store,
  LogOut,
} from 'lucide-react'

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
  const pathname = usePathname()

  const logout = () => {
    localStorage.removeItem('accessToken')

    localStorage.removeItem('user')

    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <aside className="flex w-64 flex-col border-r bg-white">
        <div className="border-b p-6">
          <h1 className="text-2xl font-black text-orange-500">
            LunchFlow
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Seller Panel
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menus.map((menu) => {
            const Icon = menu.icon

            const isActive =
              pathname === menu.href

            return (
              <Link
                key={menu.href}
                href={menu.href}
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

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}