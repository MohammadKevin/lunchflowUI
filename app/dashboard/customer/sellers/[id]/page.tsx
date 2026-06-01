'use client'

import Link from 'next/link'

import {
  use,
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  Clock,
  MapPin,
  ShoppingCart,
  Store,
} from 'lucide-react'

import { api } from '@/lib/api'

type Menu = {
  id: string
  name: string
  image: string
  description: string
  price: number
  stock: number
  isAvailable: boolean
}

type Seller = {
  id: string
  storeName: string
  description: string
  logo: string
  banner: string
  address: string
  isOpen: boolean

  user: {
    fullName: string
    email: string
  }

  menus: Menu[]
}

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

export default function SellerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSeller()
  }, [])

  const fetchSeller = async () => {
    try {
      const response = await api.get(`/sellers/${id}`)
      setSeller(response.data)
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

  if (!seller) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Seller not found
      </div>
    )
  }

  const { from, to, icon } = getSellerColors(seller.storeName)
  const initial = seller.storeName.charAt(0).toUpperCase()

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/customer/sellers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* Banner ilustrasi SVG */}
        <div className="relative h-72 overflow-hidden">
          <svg
            viewBox="0 0 1200 288"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient
                id="banner-grad"
                x1="0%" y1="0%"
                x2="100%" y2="100%"
              >
                <stop offset="0%" stopColor={from} />
                <stop offset="100%" stopColor={to} />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect width="1200" height="288" fill="url(#banner-grad)" />

            {/* Decorative circles */}
            <circle cx="1100" cy="50"  r="160" fill="white" fillOpacity="0.07" />
            <circle cx="1050" cy="270" r="100" fill="white" fillOpacity="0.05" />
            <circle cx="80"   cy="260" r="180" fill="white" fillOpacity="0.05" />
            <circle cx="30"   cy="30"  r="60"  fill="white" fillOpacity="0.09" />
            <circle cx="600"  cy="144" r="260" fill="white" fillOpacity="0.03" />

            {/* Dot grid */}
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 16 }).map((_, col) => (
                <circle
                  key={`dot-${row}-${col}`}
                  cx={col * 76 + 38}
                  cy={row * 58 + 28}
                  r="2.5"
                  fill="white"
                  fillOpacity="0.12"
                />
              ))
            )}

            {/* Watermark initial */}
            <text
              x="600" y="144"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="300"
              fontWeight="900"
              fill="white"
              fillOpacity="0.06"
              fontFamily="sans-serif"
            >
              {initial}
            </text>

            {/* Center icon */}
            <text
              x="600" y="130"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="80"
            >
              {icon}
            </text>
          </svg>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Store info overlay */}
          <div className="absolute bottom-6 left-6 flex items-end gap-5">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white">
              <svg
                viewBox="0 0 112 112"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <defs>
                  <linearGradient
                    id="logo-grad"
                    x1="0%" y1="0%"
                    x2="100%" y2="100%"
                  >
                    <stop offset="0%" stopColor={to} />
                    <stop offset="100%" stopColor={from} />
                  </linearGradient>
                </defs>

                {/* Background — reversed gradient dari banner */}
                <rect width="112" height="112" fill="url(#logo-grad)" />

                {/* Decorative circles */}
                <circle cx="100" cy="15"  r="30" fill="white" fillOpacity="0.10" />
                <circle cx="10"  cy="100" r="25" fill="white" fillOpacity="0.08" />

                {/* Dot grid kecil */}
                {Array.from({ length: 3 }).map((_, row) =>
                  Array.from({ length: 3 }).map((_, col) => (
                    <circle
                      key={`logo-dot-${row}-${col}`}
                      cx={col * 20 + 76}
                      cy={row * 20 + 16}
                      r="1.5"
                      fill="white"
                      fillOpacity="0.2"
                    />
                  ))
                )}

                {/* Inisial toko */}
                <text
                  x="56" y="56"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="48"
                  fontWeight="900"
                  fill="white"
                  fillOpacity="0.95"
                  fontFamily="sans-serif"
                >
                  {initial}
                </text>
              </svg>
            </div>

            <div className="text-white">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black">{seller.storeName}</h1>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    seller.isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {seller.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="mt-2 text-lg text-white/80">{seller.description}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div className="rounded-3xl border p-5">
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6 text-orange-500" />
              <h2 className="text-lg font-black text-gray-900">Owner</h2>
            </div>
            <p className="mt-4 font-semibold text-gray-900">
              {seller.user?.fullName}
            </p>
            <p className="text-sm text-gray-500">{seller.user?.email}</p>
          </div>

          <div className="rounded-3xl border p-5">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-orange-500" />
              <h2 className="text-lg font-black text-gray-900">Address</h2>
            </div>
            <p className="mt-4 text-gray-600">{seller.address}</p>
          </div>

          <div className="rounded-3xl border p-5">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-orange-500" />
              <h2 className="text-lg font-black text-gray-900">Menus</h2>
            </div>
            <p className="mt-4 text-4xl font-black text-orange-500">
              {seller.menus?.length}
            </p>
            <p className="text-sm text-gray-500">Available menus</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Menus</h2>
            <p className="mt-2 text-gray-500">Explore seller menus</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {seller.menus?.map((menu) => (
            <div
              key={menu.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >
              <img
                src={menu.image || 'https://placehold.co/600x400'}
                alt={menu.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      menu.isAvailable
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {menu.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {menu.stock}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-black text-gray-900">
                  {menu.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {menu.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-orange-500">
                    Rp {Number(menu.price).toLocaleString()}
                  </h2>

                  <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white transition hover:bg-orange-600">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {seller.menus?.length === 0 && (
          <div className="mt-6 rounded-3xl bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">No Menus Yet</h2>
            <p className="mt-2 text-gray-500">This seller has no menus.</p>
          </div>
        )}
      </div>
    </div>
  )
}