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
  const [menus, setMenus] = useState<Menu[]>([])
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenus()
  }, [])

  useEffect(() => {
    let result = menus

    if (activeCategory !== 'All') {
      result = result.filter(
        (menu) => menu.category?.name === activeCategory,
      )
    }

    if (search.trim()) {
      result = result.filter((menu) =>
        menu.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    setFilteredMenus(result)
  }, [search, activeCategory, menus])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus')
      setMenus(response.data)
      setFilteredMenus(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'All',
    ...Array.from(
      new Set(
        menus
          .map((menu) => menu.category?.name)
          .filter(Boolean),
      ),
    ),
  ]

  const isSoldOut = (menu: Menu) =>
    menu.stock === 0 || !menu.isAvailable

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Memuat...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900">Menu</h1>
        <p className="mt-2 text-gray-500">Jelajahi makanan lezat</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-14 w-full rounded-3xl border bg-white pl-12 pr-4 outline-none"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition hover:scale-[1.03] ${
              activeCategory === category
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-600 shadow-sm hover:bg-orange-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredMenus.map((menu) => {
          const soldOut = isSoldOut(menu)

          const card = (
            <div
              className={`overflow-hidden rounded-3xl bg-white shadow-sm transition ${
                soldOut
                  ? 'cursor-not-allowed opacity-60'
                  : 'hover:-translate-y-1'
              }`}
            >
              {/* Gambar + overlay stok habis */}
              <div className="relative h-56">
                <img
                  src={menu.image || 'https://placehold.co/600x400'}
                  alt={menu.name}
                  className={`h-full w-full object-cover ${soldOut ? 'grayscale' : ''}`}
                />

                {soldOut && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-gray-700">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-500">
                    {menu.category?.name}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      soldOut
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {soldOut ? 'Tidak Tersedia' : 'Tersedia'}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black text-gray-900">
                  {menu.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {menu.description}
                </p>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Penjual</p>
                  <h3 className="font-semibold text-gray-900">
                    {menu.seller?.storeName}
                  </h3>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <h3
                    className={`text-2xl font-black ${
                      soldOut ? 'text-gray-400' : 'text-orange-500'
                    }`}
                  >
                    Rp {Number(menu.price).toLocaleString()}
                  </h3>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${
                      soldOut
                        ? 'cursor-not-allowed bg-gray-300'
                        : 'bg-orange-500'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          )

          // Kalau stok habis, jangan bisa diklik (pakai div bukan Link)
          return soldOut ? (
            <div key={menu.id}>{card}</div>
          ) : (
            <Link
              key={menu.id}
              href={`/dashboard/customer/menus/${menu.id}`}
            >
              {card}
            </Link>
          )
        })}
      </div>

      {filteredMenus.length === 0 && (
        <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">
            Menu Tidak Ditemukan
          </h2>
          <p className="mt-2 text-gray-500">
            Coba kata kunci atau kategori lain.
          </p>
        </div>
      )}
    </div>
  )
}