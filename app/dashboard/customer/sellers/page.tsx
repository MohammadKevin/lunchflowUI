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

export default function SellersPage() {
  const [sellers, setSellers] =
    useState<Seller[]>([])

  const [
    filteredSellers,
    setFilteredSellers,
  ] = useState<Seller[]>([])

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchSellers()
  }, [])

  useEffect(() => {
    const filtered =
      sellers.filter((seller) =>
        seller.storeName
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
      )

    setFilteredSellers(filtered)
  }, [search, sellers])

  const fetchSellers =
    async () => {
      try {
        const response =
          await api.get(
            '/sellers',
          )

        setSellers(
          response.data,
        )

        setFilteredSellers(
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
          Sellers
        </h1>

        <p className="mt-2 text-gray-500">
          Explore food stores near
          you.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search seller..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value,
            )
          }
          className="h-14 w-full rounded-3xl border bg-white pl-12 pr-4 outline-none"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredSellers.map(
          (seller) => (
            <Link
              key={seller.id}
              href={`/dashboard/customer/sellers/${seller.id}`}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1"
            >
              <div className="relative h-52 bg-gray-100">
                <img
                  src={
                    seller.logo ||
                    'https://placehold.co/600x400'
                  }
                  alt={
                    seller.storeName
                  }
                  className="h-full w-full object-cover"
                />

                <div className="absolute right-4 top-4">
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      seller.isOpen
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {seller.isOpen
                      ? 'Open'
                      : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      {
                        seller.storeName
                      }
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {
                        seller.description
                      }
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <Store className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />

                  <p className="line-clamp-1 text-sm">
                    {
                      seller.address
                    }
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      Owner
                    </p>

                    <h3 className="font-semibold text-gray-900">
                      {
                        seller.user
                          ?.fullName
                      }
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Menus
                    </p>

                    <h3 className="text-xl font-black text-orange-500">
                      {
                        seller.menus
                          ?.length
                      }
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>

      {filteredSellers.length ===
        0 && (
        <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">
            No Sellers Found
          </h2>

          <p className="mt-2 text-gray-500">
            Try searching another
            seller.
          </p>
        </div>
      )}
    </div>
  )
}