'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import {
  MapPin,
  Search,
  Store,
} from 'lucide-react'

import { api } from '@/lib/api'

type Seller = {
  id: string
  storeName: string
  description: string
  logo: string
  address: string
  isOpen: boolean

  user: {
    fullName: string
    email: string
  }

  menus: {
    id: string
  }[]
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

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellers()
  }, [])

  useEffect(() => {
    const filtered = sellers.filter((seller) =>
      seller.storeName.toLowerCase().includes(search.toLowerCase()),
    )
    setFilteredSellers(filtered)
  }, [search, sellers])

  const fetchSellers = async () => {
    try {
      const response = await api.get('/sellers')
      setSellers(response.data)
      setFilteredSellers(response.data)
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
        <h1 className="text-4xl font-black text-gray-900">Sellers</h1>
        <p className="mt-2 text-gray-500">Explore food stores near you.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search seller..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-14 w-full rounded-3xl border bg-white pl-12 pr-4 outline-none"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredSellers.map((seller) => {
          const { from, to, icon } = getSellerColors(seller.storeName)
          const initial = seller.storeName.charAt(0).toUpperCase()

          return (
            <Link
              key={seller.id}
              href={`/dashboard/customer/sellers/${seller.id}`}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1"
            >
              {/* Ilustrasi SVG sebagai background */}
              <div className="relative h-52 overflow-hidden">
                <svg
                  viewBox="0 0 600 208"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient
                      id={`grad-${seller.id}`}
                      x1="0%" y1="0%"
                      x2="100%" y2="100%"
                    >
                      <stop offset="0%" stopColor={from} />
                      <stop offset="100%" stopColor={to} />
                    </linearGradient>
                  </defs>

                  {/* Background gradient */}
                  <rect width="600" height="208" fill={`url(#grad-${seller.id})`} />

                  {/* Decorative circles */}
                  <circle cx="520" cy="30"  r="80"  fill="white" fillOpacity="0.08" />
                  <circle cx="560" cy="170" r="55"  fill="white" fillOpacity="0.06" />
                  <circle cx="60"  cy="180" r="100" fill="white" fillOpacity="0.06" />
                  <circle cx="20"  cy="20"  r="40"  fill="white" fillOpacity="0.10" />
                  <circle cx="300" cy="104" r="130" fill="white" fillOpacity="0.04" />

                  {/* Dot grid */}
                  {Array.from({ length: 6 }).map((_, row) =>
                    Array.from({ length: 10 }).map((_, col) => (
                      <circle
                        key={`dot-${row}-${col}`}
                        cx={col * 60 + 30}
                        cy={row * 42 + 20}
                        r="2"
                        fill="white"
                        fillOpacity="0.15"
                      />
                    ))
                  )}

                  {/* Watermark initial */}
                  <text
                    x="300" y="104"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="160"
                    fontWeight="900"
                    fill="white"
                    fillOpacity="0.10"
                    fontFamily="sans-serif"
                  >
                    {initial}
                  </text>

                  {/* Food icon */}
                  <text
                    x="300" y="115"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="52"
                  >
                    {icon}
                  </text>
                </svg>

                {/* Badge Open/Closed */}
                <div className="absolute right-4 top-4">
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      seller.isOpen
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {seller.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      {seller.storeName}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {seller.description}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <Store className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <p className="line-clamp-1 text-sm">{seller.address}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-6">
                  <div>
                    <p className="text-sm text-gray-500">Owner</p>
                    <h3 className="font-semibold text-gray-900">
                      {seller.user?.fullName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Menus</p>
                    <h3 className="text-xl font-black text-orange-500">
                      {seller.menus?.length}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filteredSellers.length === 0 && (
        <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">No Sellers Found</h2>
          <p className="mt-2 text-gray-500">Try searching another seller.</p>
        </div>
      )}
    </div>
  )
}