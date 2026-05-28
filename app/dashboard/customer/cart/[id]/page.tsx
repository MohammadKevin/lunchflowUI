'use client'

import {
  use,
  useEffect,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Minus,
  Plus,
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

export default function CartDetailPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = use(params)

  const router = useRouter()

  const [menu, setMenu] =
    useState<Menu | null>(
      null,
    )

  const [quantity, setQuantity] =
    useState(1)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu =
    async () => {
      try {
        const response =
          await api.get(
            `/menus/${id}`,
          )

        setMenu(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

  const addToCart = () => {
    if (!menu) return

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          'cart',
        ) || '[]',
      )

    const existingItem =
      existingCart.find(
        (item: any) =>
          item.id === menu.id,
      )

    let updatedCart = []

    if (existingItem) {
      updatedCart =
        existingCart.map(
          (item: any) =>
            item.id === menu.id
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    quantity,
                }
              : item,
        )
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: menu.id,
          name: menu.name,
          image: menu.image,
          price: menu.price,
          quantity,
          seller:
            menu.seller
              ?.storeName,
        },
      ]
    }

    localStorage.setItem(
      'cart',
      JSON.stringify(
        updatedCart,
      ),
    )

    router.push(
      '/dashboard/customer/cart',
    )
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Menu not found
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <button
        onClick={() =>
          router.back()
        }
        className="flex items-center gap-2 font-semibold text-orange-500"
      >
        <ArrowLeft className="h-5 w-5" />

        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <img
            src={
              menu.image ||
              'https://placehold.co/800x600'
            }
            alt={menu.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-500">
              {
                menu.category
                  ?.name
              }
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                menu.isAvailable
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {menu.isAvailable
                ? 'Available'
                : 'Unavailable'}
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black text-gray-900">
            {menu.name}
          </h1>

          <p className="mt-4 text-lg text-gray-500">
            {
              menu.description
            }
          </p>

          <div className="mt-8 rounded-3xl bg-gray-50 p-6">
            <p className="text-sm text-gray-500">
              Seller
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {
                menu.seller
                  ?.storeName
              }
            </h2>
          </div>

          <div className="mt-6 rounded-3xl bg-gray-50 p-6">
            <p className="text-sm text-gray-500">
              Stock
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {menu.stock}
            </h2>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-5xl font-black text-orange-500">
              Rp{' '}
              {Number(
                menu.price,
              ).toLocaleString()}
            </h2>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity - 1,
                    ),
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100"
              >
                <Minus className="h-5 w-5" />
              </button>

              <span className="w-10 text-center text-2xl font-black">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(
                    quantity + 1,
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            onClick={addToCart}
            className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-3xl bg-orange-500 text-lg font-bold text-white transition hover:bg-orange-600"
          >
            <ShoppingCart className="h-6 w-6" />

            Add To Cart
          </button>
        </div>
      </div>
    </div>
  )
}