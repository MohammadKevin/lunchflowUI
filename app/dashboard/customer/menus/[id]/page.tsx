'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'

type Menu = {
  id: string
  sellerId: string
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

export default function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [menu, setMenu] = useState<Menu | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)

  // Hitung total harga secara dinamis berdasarkan kuantitas
  const totalPrice = menu ? menu.price * quantity : 0

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/menus/${id}`)
        setMenu(response.data)
      } catch (error) {
        console.error(error)
        toast.error('Failed to fetch menu')
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [id])

  const addToCart = async () => {
    if (!menu) return

    try {
      setCartLoading(true)
      await api.post('/cart', {
        menuId: menu.id,
        quantity,
        // totalPrice, // Buka komen ini jika backend kamu membutuhkan payload total harga
      })

      toast.success('Added to cart')
      router.push('/dashboard/customer/cart')
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to add to cart')
    } finally {
      setCartLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-lg font-medium">
        Loading...
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-lg font-medium">
        Menu not found
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 font-semibold text-orange-500 transition hover:text-orange-600"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      {/* Detail Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Section */}
        <div className="aspect-video overflow-hidden rounded-[32px] bg-white shadow-sm lg:aspect-auto lg:h-[500px]">
          <img
            src={menu.image || 'https://placehold.co/800x600'}
            alt={menu.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-500">
              {menu.category?.name}
            </span>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                menu.isAvailable
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {menu.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black text-gray-900 md:text-5xl">
            {menu.name}
          </h1>
          <p className="mt-4 text-lg text-gray-500">{menu.description}</p>

          {/* Seller & Stock Info */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-gray-50 p-6">
              <p className="text-sm text-gray-500">Seller</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900 line-clamp-1">
                {menu.seller?.storeName}
              </h2>
            </div>
            <div className="rounded-3xl bg-gray-50 p-6">
              <p className="text-sm text-gray-500">Stock</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {menu.stock}
              </h2>
            </div>
          </div>

          {/* Price & Quantity Selector */}
          <div className="mt-auto pt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Price</p>
              <h2 className="text-4xl font-black text-orange-500 md:text-5xl">
                Rp {Number(totalPrice).toLocaleString('id-ID')}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={!menu.isAvailable}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 transition hover:bg-gray-200 disabled:opacity-50"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-8 text-center text-2xl font-black">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => Math.min(menu.stock, prev + 1))}
                disabled={!menu.isAvailable || quantity >= menu.stock}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:bg-gray-300"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={addToCart}
            disabled={!menu.isAvailable || cartLoading || menu.stock === 0}
            className="mt-8 flex h-16 w-full items-center justify-center gap-3 rounded-3xl bg-orange-500 text-lg font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartLoading ? 'Adding...' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}