'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import {
  Heart,
  ShoppingCart,
  Store,
} from 'lucide-react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type FavoriteMenu = {
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

export default function FavoritesPage() {
  const [favorites, setFavorites] =
    useState<FavoriteMenu[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites =
    async () => {
      try {
        const response =
          await api.get(
            '/orders/favorites/me',
          )

        setFavorites(
          response.data,
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch favorite menus',
        )
      } finally {
        setLoading(false)
      }
    }

  const addToCart =
    async (
      menuId: string,
    ) => {
      try {
        await api.post(
          '/cart',
          {
            menuId,
            quantity: 1,
          },
        )

        toast.success(
          'Added to cart',
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to add to cart',
        )
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
          Favorite Menus
        </h1>

        <p className="mt-2 text-gray-500">
          Based on your order history
        </p>
      </div>

      {favorites.length ===
      0 ? (
        <div className="rounded-[32px] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <Heart className="h-12 w-12" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-gray-900">
            No Favorite Menus Yet
          </h2>

          <p className="mt-3 text-gray-500">
            Order some food first
          </p>

          <Link
            href="/dashboard/customer/menus"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-2xl bg-orange-500 px-8 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Menus
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map(
            (favorite) => (
              <div
                key={
                  favorite.id
                }
                className="overflow-hidden rounded-[32px] bg-white shadow-sm"
              >
                <Link
                  href={`/dashboard/customer/menus/${favorite.id}`}
                >
                  <img
                    src={
                      favorite.image ||
                      'https://placehold.co/600x400'
                    }
                    alt={
                      favorite.name
                    }
                    className="h-64 w-full object-cover"
                  />
                </Link>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-500">
                      {
                        favorite
                          .category
                          ?.name
                      }
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/customer/menus/${favorite.id}`}
                  >
                    <h2 className="mt-5 text-3xl font-black text-gray-900">
                      {
                        favorite.name
                      }
                    </h2>
                  </Link>

                  <p className="mt-3 line-clamp-2 text-gray-500">
                    {
                      favorite.description
                    }
                  </p>

                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                      <Store className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Seller
                      </p>

                      <h3 className="font-bold text-gray-900">
                        {
                          favorite
                            .seller
                            ?.storeName
                        }
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Price
                      </p>

                      <h3 className="text-3xl font-black text-orange-500">
                        Rp{' '}
                        {Number(
                          favorite.price,
                        ).toLocaleString()}
                      </h3>
                    </div>

                    <button
                      onClick={() =>
                        addToCart(
                          favorite.id,
                        )
                      }
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white transition hover:bg-orange-600"
                    >
                      <ShoppingCart className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}