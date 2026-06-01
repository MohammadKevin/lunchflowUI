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
  const [favorites, setFavorites] = useState<FavoriteMenu[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/orders/favorites/me')
      setFavorites(response.data)
    } catch (error) {
      console.log(error)
      toast.error('Gagal memuat menu favorit')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (menuId: string) => {
    try {
      await api.post('/cart', { menuId, quantity: 1 })
      toast.success('Ditambahkan ke keranjang')
    } catch (error) {
      console.log(error)
      toast.error('Gagal menambahkan ke keranjang')
    }
  }

  const isSoldOut = (item: FavoriteMenu) =>
    item.stock === 0 || !item.isAvailable

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
        <h1 className="text-4xl font-black text-gray-900">Menu Favorit</h1>
        <p className="mt-2 text-gray-500">Berdasarkan riwayat pesananmu</p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-[32px] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <Heart className="h-12 w-12" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-gray-900">
            Belum Ada Menu Favorit
          </h2>

          <p className="mt-3 text-gray-500">Pesan makanan dulu, yuk!</p>

          <Link
            href="/dashboard/customer/menus"
            className="mt-8 inline-flex h-14 items-center justify-center rounded-2xl bg-orange-500 px-8 font-semibold text-white transition hover:bg-orange-600"
          >
            Jelajahi Menu
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite) => {
            const soldOut = isSoldOut(favorite)

            return (
              <div
                key={favorite.id}
                className={`overflow-hidden rounded-[32px] bg-white shadow-sm transition ${
                  soldOut ? 'opacity-60' : ''
                }`}
              >
                {/* Gambar + overlay stok habis */}
                <div className="relative h-64">
                  {soldOut ? (
                    <img
                      src={favorite.image || 'https://placehold.co/600x400'}
                      alt={favorite.name}
                      className="h-full w-full object-cover grayscale"
                    />
                  ) : (
                    <Link href={`/dashboard/customer/menus/${favorite.id}`}>
                      <img
                        src={favorite.image || 'https://placehold.co/600x400'}
                        alt={favorite.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  )}

                  {soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-gray-700">
                        Stok Habis
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-500">
                      {favorite.category?.name}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                  </div>

                  {soldOut ? (
                    <h2 className="mt-5 text-3xl font-black text-gray-900">
                      {favorite.name}
                    </h2>
                  ) : (
                    <Link href={`/dashboard/customer/menus/${favorite.id}`}>
                      <h2 className="mt-5 text-3xl font-black text-gray-900 hover:text-orange-500 transition">
                        {favorite.name}
                      </h2>
                    </Link>
                  )}

                  <p className="mt-3 line-clamp-2 text-gray-500">
                    {favorite.description}
                  </p>

                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                      <Store className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Penjual</p>
                      <h3 className="font-bold text-gray-900">
                        {favorite.seller?.storeName}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Harga</p>
                      <h3
                        className={`text-3xl font-black ${
                          soldOut ? 'text-gray-400' : 'text-orange-500'
                        }`}
                      >
                        Rp {Number(favorite.price).toLocaleString()}
                      </h3>
                    </div>

                    <button
                      onClick={() => !soldOut && addToCart(favorite.id)}
                      disabled={soldOut}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white transition ${
                        soldOut
                          ? 'cursor-not-allowed bg-gray-300'
                          : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                    >
                      <ShoppingCart className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}