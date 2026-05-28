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

export default function SellerDetailPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = use(params)

  const [seller, setSeller] =
    useState<Seller | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchSeller()
  }, [])

  const fetchSeller =
    async () => {
      try {
        const response =
          await api.get(
            `/sellers/${id}`,
          )

        setSeller(
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

  if (!seller) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Seller not found
      </div>
    )
  }

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
        <div className="relative h-72">
          <img
            src={
              seller.banner ||
              'https://placehold.co/1200x400'
            }
            alt={
              seller.storeName
            }
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-6 left-6 flex items-end gap-5">
            <img
              src={
                seller.logo ||
                'https://placehold.co/200x200'
              }
              alt={
                seller.storeName
              }
              className="h-28 w-28 rounded-3xl border-4 border-white object-cover"
            />

            <div className="text-white">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black">
                  {
                    seller.storeName
                  }
                </h1>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    seller.isOpen
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                >
                  {seller.isOpen
                    ? 'Open'
                    : 'Closed'}
                </span>
              </div>

              <p className="mt-2 text-lg text-white/80">
                {
                  seller.description
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div className="rounded-3xl border p-5">
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6 text-orange-500" />

              <h2 className="text-lg font-black text-gray-900">
                Owner
              </h2>
            </div>

            <p className="mt-4 font-semibold text-gray-900">
              {
                seller.user
                  ?.fullName
              }
            </p>

            <p className="text-sm text-gray-500">
              {
                seller.user
                  ?.email
              }
            </p>
          </div>

          <div className="rounded-3xl border p-5">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-orange-500" />

              <h2 className="text-lg font-black text-gray-900">
                Address
              </h2>
            </div>

            <p className="mt-4 text-gray-600">
              {
                seller.address
              }
            </p>
          </div>

          <div className="rounded-3xl border p-5">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-orange-500" />

              <h2 className="text-lg font-black text-gray-900">
                Menus
              </h2>
            </div>

            <p className="mt-4 text-4xl font-black text-orange-500">
              {
                seller.menus
                  ?.length
              }
            </p>

            <p className="text-sm text-gray-500">
              Available menus
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              Menus
            </h2>

            <p className="mt-2 text-gray-500">
              Explore seller menus
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {seller.menus?.map(
            (menu) => (
              <div
                key={menu.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <img
                  src={
                    menu.image ||
                    'https://placehold.co/600x400'
                  }
                  alt={
                    menu.name
                  }
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
                      {menu.isAvailable
                        ? 'Available'
                        : 'Unavailable'}
                    </span>

                    <span className="text-sm text-gray-500">
                      Stock:{' '}
                      {
                        menu.stock
                      }
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-gray-900">
                    {menu.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {
                      menu.description
                    }
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-orange-500">
                      Rp{' '}
                      {Number(
                        menu.price,
                      ).toLocaleString()}
                    </h2>

                    <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white transition hover:bg-orange-600">
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {seller.menus
          ?.length ===
          0 && (
          <div className="mt-6 rounded-3xl bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              No Menus Yet
            </h2>

            <p className="mt-2 text-gray-500">
              This seller has no
              menus.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}