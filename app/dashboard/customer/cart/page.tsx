'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type CartItem = {
  id: string

  quantity: number

  menu: {
    id: string
    name: string
    image: string
    price: number

    seller: {
      storeName: string
    }
  }
}

export default function CartPage() {
  const router = useRouter()

  const [cartItems, setCartItems] =
    useState<CartItem[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart =
    async () => {
      try {
        const response =
          await api.get('/cart')

        setCartItems(
          response.data.items ||
            [],
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch cart',
        )
      } finally {
        setLoading(false)
      }
    }

  const increaseQty =
    async (
      id: string,
      quantity: number,
    ) => {
      try {
        await api.patch(
          `/cart/${id}`,
          {
            quantity:
              quantity + 1,
          },
        )

        fetchCart()
      } catch (error) {
        console.log(error)
      }
    }

  const decreaseQty =
    async (
      id: string,
      quantity: number,
    ) => {
      try {
        if (quantity <= 1) {
          await removeItem(id)

          return
        }

        await api.patch(
          `/cart/${id}`,
          {
            quantity:
              quantity - 1,
          },
        )

        fetchCart()
      } catch (error) {
        console.log(error)
      }
    }

  const removeItem =
    async (id: string) => {
      try {
        await api.delete(
          `/cart/${id}`,
        )

        fetchCart()

        toast.success(
          'Item removed',
        )
      } catch (error) {
        console.log(error)
      }
    }

  const totalPrice =
    cartItems.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.menu.price *
          item.quantity,
      0,
    )

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
          Cart
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your cart
          items
        </p>
      </div>

      {cartItems.length ===
      0 ? (
        <div className="rounded-3xl bg-white py-24 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <ShoppingBag className="h-10 w-10" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-gray-900">
            Cart Is Empty
          </h2>

          <p className="mt-2 text-gray-500">
            Add menu to cart
            first
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            {cartItems.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center"
                >
                  <img
                    src={
                      item.menu
                        .image ||
                      'https://placehold.co/300x300'
                    }
                    alt={
                      item.menu
                        .name
                    }
                    className="h-32 w-full rounded-3xl object-cover md:w-32"
                  />

                  <div className="flex-1">
                    <p className="text-sm text-orange-500">
                      {
                        item.menu
                          .seller
                          ?.storeName
                      }
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-gray-900">
                      {
                        item.menu
                          .name
                      }
                    </h2>

                    <h3 className="mt-3 text-2xl font-black text-orange-500">
                      Rp{' '}
                      {Number(
                        item.menu
                          .price,
                      ).toLocaleString()}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between gap-5 md:flex-col">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          decreaseQty(
                            item.id,
                            item.quantity,
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-8 text-center text-lg font-bold">
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item.id,
                            item.quantity,
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(
                          item.id,
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Total Items
                </span>

                <span className="font-semibold">
                  {
                    cartItems.length
                  }
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  Total Price
                </span>

                <span className="text-2xl font-black text-orange-500">
                  Rp{' '}
                  {Number(
                    totalPrice,
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                router.push(
                  '/dashboard/customer/checkout',
                )
              }
              className="mt-8 h-14 w-full rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}