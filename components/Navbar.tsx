'use client'

import Link from 'next/link'

import {
  Menu,
  ShoppingBag,
  X,
} from 'lucide-react'

import { useState } from 'react'

const navItems = [
  {
    label: 'Home',
    href: '#home',
  },

  {
    label: 'Features',
    href: '#features',
  },

  {
    label: 'About',
    href: '#about',
  },

  {
    label: 'Contact',
    href: '#contact',
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] =
    useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold">
            LunchFlow
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          className="md:hidden"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() =>
                  setIsOpen(false)
                }
                className="text-sm font-medium text-gray-600 transition hover:text-orange-500"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/login"
                className="rounded-xl border px-4 py-2 text-center text-sm font-medium"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-orange-500 px-4 py-2 text-center text-sm font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}