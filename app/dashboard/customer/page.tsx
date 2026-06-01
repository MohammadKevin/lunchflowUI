'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import {
  ArrowRight,
  Clock,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react'

import { api } from '@/lib/api'

const PALETTES = [
  { from: '#FF6B35', to: '#F7C59F', icon: '🍜' },
  { from: '#7B35FF', to: '#C59FF7', icon: '🍱' },
  { from: '#00C853', to: '#B9F6CA', icon: '🍛' },
  { from: '#FF3565', to: '#F79FC5', icon: '🍔' },
  { from: '#0099CC', to: '#9FE0F7', icon: '🍣' },
  { from: '#FF8F00', to: '#FFE082', icon: '🥗' },
  { from: '#D81B60', to: '#F8BBD0', icon: '🍕' },
  { from: '#00897B', to: '#B2DFDB', icon: '🥘' },
]

const getSellerColors = (name: string) => {
  const index = name.charCodeAt(0) % PALETTES.length
  return PALETTES[index]
}

type Menu = {
  id: string
  name: string
  image: string
  price: number

  seller: {
    storeName: string
  }
}

type Seller = {
  id: string
  storeName: string
  storeLogo: string
  description: string
  isOpen: boolean
}

export default function CustomerDashboardPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [menusResponse, sellersResponse] = await Promise.all([
        api.get('/menus/recommended'),
        api.get('/sellers'),
      ])

      setMenus(menusResponse.data)
      setSellers(sellersResponse.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Memuat...
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-[32px] bg-orange-500 p-10 text-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-5xl font-black leading-tight">
              Makanan Lezat
              <br />
              untuk Makan Siangmu
            </h1>

            <p className="mt-5 max-w-xl text-lg text-orange-100">
              Pesan makanan dari penjual favoritmu di kampus dengan cepat dan mudah.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard/customer/menus"
                className="flex h-14 items-center gap-2 rounded-2xl bg-white px-6 font-semibold text-orange-500 transition hover:scale-105"
              >
                Jelajahi Menu
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/dashboard/customer/sellers"
                className="flex h-14 items-center rounded-2xl border border-white/30 px-6 font-semibold text-white transition hover:bg-white/10"
              >
                Lihat Penjual
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-3xl font-black">{menus.length}+</h3>
              <p className="mt-1 text-orange-100">Menu</p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Store className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-3xl font-black">{sellers.length}+</h3>
              <p className="mt-1 text-orange-100">Penjual</p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-3xl font-black">Cepat</h3>
              <p className="mt-1 text-orange-100">Pengiriman</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Rekomendasi */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Menu Rekomendasi</h2>
            <p className="mt-1 text-gray-500">Menu terbaik untuk hari ini.</p>
          </div>

          <Link
            href="/dashboard/customer/menus"
            className="font-semibold text-orange-500"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={`/dashboard/customer/menus/${menu.id}`}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1"
            >
              <img
                src={menu.image || 'https://placehold.co/600x400'}
                alt={menu.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-orange-500">
                  <Clock className="h-4 w-4" />
                  Rekomendasi
                </div>

                <h3 className="mt-3 text-xl font-black text-gray-900">
                  {menu.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {menu.seller?.storeName}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <h4 className="text-2xl font-black text-orange-500">
                    Rp {Number(menu.price).toLocaleString()}
                  </h4>

                  <div className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                    Pesan
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {menus.length === 0 && (
          <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">Belum Ada Menu</h2>
            <p className="mt-2 text-gray-500">Menu rekomendasi akan muncul di sini.</p>
          </div>
        )}
      </section>

      {/* Penjual Populer */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Penjual Populer</h2>
            <p className="mt-1 text-gray-500">Jelajahi penjual makanan di kampus.</p>
          </div>

          <Link
            href="/dashboard/customer/sellers"
            className="font-semibold text-orange-500"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sellers.map((seller) => {
            const { from, to, icon } = getSellerColors(seller.storeName)
            const initial = seller.storeName.charAt(0).toUpperCase()

            return (
              <Link
                key={seller.id}
                href={`/dashboard/customer/sellers/${seller.id}`}
                className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  {/* Logo ilustrasi SVG */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl">
                    <svg
                      viewBox="0 0 80 80"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-full w-full"
                    >
                      <defs>
                        <linearGradient
                          id={`seller-grad-${seller.id}`}
                          x1="0%" y1="0%"
                          x2="100%" y2="100%"
                        >
                          <stop offset="0%" stopColor={from} />
                          <stop offset="100%" stopColor={to} />
                        </linearGradient>
                      </defs>

                      <rect width="80" height="80" fill={`url(#seller-grad-${seller.id})`} />
                      <circle cx="70" cy="12" r="22" fill="white" fillOpacity="0.10" />
                      <circle cx="8"  cy="70" r="18" fill="white" fillOpacity="0.08" />

                      {/* Inisial */}
                      <text
                        x="40" y="40"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="32"
                        fontWeight="900"
                        fill="white"
                        fillOpacity="0.95"
                        fontFamily="sans-serif"
                      >
                        {initial}
                      </text>

                      {/* Icon makanan kecil */}
                      <text
                        x="58" y="62"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                      >
                        {icon}
                      </text>
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-xl font-black text-gray-900">
                        {seller.storeName}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          seller.isOpen
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {seller.isOpen ? 'Buka' : 'Tutup'}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {seller.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {sellers.length === 0 && (
          <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">Belum Ada Penjual</h2>
            <p className="mt-2 text-gray-500">Penjual akan muncul di sini.</p>
          </div>
        )}
      </section>
    </div>
  )
}