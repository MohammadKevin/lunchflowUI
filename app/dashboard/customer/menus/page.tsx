'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import {
  Search,
  ShoppingCart,
} from 'lucide-react'

import { api } from '@/lib/api'

type Menu = {
  id: string
  name: string
  description: string
  image: string
  price: number
  stock: number
  isAvailable: boolean

  seller: {
    storeName: string
  }

  category: {
    name: string
  }
}

export default function MenusPage() {
  const [menus, setMenus] =
    useState<Menu[]>([])

  const [filteredMenus, setFilteredMenus] =
    useState<Menu[]>([])

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchMenus()
  }, [])

  useEffect(() => {
    const filtered =
      menus.filter((menu) =>
        menu.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
      )

    setFilteredMenus(filtered)
  }, [search, menus])

  const fetchMenus =
    async () => {
      try {
        const response =
          await api.get('/menus')

        setMenus(response.data)

        setFilteredMenus(
          response.data,
        )
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900">
          Menus
        </h1>

        <p className="mt-2 text-gray-500">
          Explore delicious food
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search menus..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value,
            )
          }
          className="h-14 w-full rounded-3xl border bg-white pl-12 pr-4 outline-none"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredMenus.map(
          (menu) => (
            <Link
              key={menu.id}
              href={`/dashboard/customer/menus/${menu.id}`}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1"
            >
              <img
                src={
                  menu.image ||
                  'https://placehold.co/600x400'
                }
                alt={menu.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-500">
                    {
                      menu.category
                        ?.name
                    }
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      menu.isAvailable
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {menu.isAvailable
                      ? 'Available'
                      : 'Unavailable'}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black text-gray-900">
                  {menu.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {
                    menu.description
                  }
                </p>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Seller
                  </p>

                  <h3 className="font-semibold text-gray-900">
                    {
                      menu.seller
                        ?.storeName
                    }
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <h3 className="text-2xl font-black text-orange-500">
                    Rp{' '}
                    {Number(
                      menu.price,
                    ).toLocaleString()}
                  </h3>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </div>
  )
}