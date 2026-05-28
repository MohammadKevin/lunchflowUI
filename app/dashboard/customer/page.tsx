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
  const [menus, setMenus] =
    useState<Menu[]>([])

  const [sellers, setSellers] =
    useState<Seller[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData =
    async () => {
      try {
        const menusResponse =
          await api.get(
            '/menus/recommended',
          )

        const sellersResponse =
          await api.get('/sellers')

        setMenus(
          menusResponse.data,
        )

        setSellers(
          sellersResponse.data,
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
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[32px] bg-orange-500 p-10 text-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-5xl font-black leading-tight">
              Delicious Food
              <br />
              For Your Lunch
            </h1>

            <p className="mt-5 max-w-xl text-lg text-orange-100">
              Order food from your
              favorite campus sellers
              quickly and easily.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menus"
                className="flex h-14 items-center gap-2 rounded-2xl bg-white px-6 font-semibold text-orange-500 transition hover:scale-105"
              >
                Explore Menus

                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/sellers"
                className="flex h-14 items-center rounded-2xl border border-white/30 px-6 font-semibold text-white transition hover:bg-white/10"
              >
                Browse Sellers
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-3xl font-black">
                {menus.length}+
              </h3>

              <p className="mt-1 text-orange-100">
                Menus
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Store className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-3xl font-black">
                {
                  sellers.length
                }
                +
              </h3>

              <p className="mt-1 text-orange-100">
                Sellers
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Truck className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-3xl font-black">
                Fast
              </h3>

              <p className="mt-1 text-orange-100">
                Delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              Recommended Menus
            </h2>

            <p className="mt-1 text-gray-500">
              Best menus for today.
            </p>
          </div>

          <Link
            href="/menus"
            className="font-semibold text-orange-500"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={`/menus/${menu.id}`}
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
                <div className="flex items-center gap-2 text-sm text-orange-500">
                  <Clock className="h-4 w-4" />

                  Recommended
                </div>

                <h3 className="mt-3 text-xl font-black text-gray-900">
                  {menu.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {
                    menu.seller
                      ?.storeName
                  }
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <h4 className="text-2xl font-black text-orange-500">
                    Rp{' '}
                    {Number(
                      menu.price,
                    ).toLocaleString()}
                  </h4>

                  <div className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                    Order
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {menus.length === 0 && (
          <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              No Menus Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Recommended menus will
              appear here.
            </p>
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">
              Popular Sellers
            </h2>

            <p className="mt-1 text-gray-500">
              Explore campus food
              sellers.
            </p>
          </div>

          <Link
            href="/sellers"
            className="font-semibold text-orange-500"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/sellers/${seller.id}`}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    seller.storeLogo ||
                    'https://placehold.co/100x100'
                  }
                  alt={
                    seller.storeName
                  }
                  className="h-20 w-20 rounded-3xl object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">
                      {
                        seller.storeName
                      }
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                  <p className="mt-2 text-sm text-gray-500">
                    {
                      seller.description
                    }
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sellers.length === 0 && (
          <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              No Sellers Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Sellers will appear
              here.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}