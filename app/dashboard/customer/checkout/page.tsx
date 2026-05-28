'use client'

import Image from 'next/image'

import { useRouter } from 'next/navigation'

import {
  useEffect,
  useState,
} from 'react'

import {
  Banknote,
  Loader2,
  MapPin,
  Store,
  Truck,
  X,
} from 'lucide-react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type CartItem = {
  id: string

  quantity: number

  menu: {
    id: string
    sellerId: string
    name: string
    image: string
    price: number

    seller: {
      storeName: string
    }
  }
}

export default function CheckoutPage() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [showQris, setShowQris] =
    useState(false)

  const [cartItems, setCartItems] =
    useState<CartItem[]>([])

  const [deliveryAddress, setDeliveryAddress] =
    useState('')

  const [notes, setNotes] =
    useState('')

  const [paymentMethod, setPaymentMethod] =
    useState<
      'CASH' | 'QRIS'
    >('CASH')

  const [orderType, setOrderType] =
    useState<
      'DELIVERY' | 'PICKUP'
    >('DELIVERY')

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

  const createOrder =
    async () => {
      try {
        setLoading(true)

        if (
          cartItems.length ===
          0
        ) {
          toast.error(
            'Cart is empty',
          )

          return
        }

        const payload = {
          sellerId:
            cartItems[0].menu
              .sellerId,

          orderType,

          paymentMethod,

          deliveryAddress:
            orderType ===
            'DELIVERY'
              ? deliveryAddress
              : undefined,

          notes,
        }

        await api.post(
          '/orders',
          payload,
        )

        await api.delete(
          '/cart',
        )

        toast.success(
          'Order created successfully',
        )

        router.push(
          '/dashboard/customer/orders',
        )
      } catch (error: any) {
        console.log(error)

        toast.error(
          error.response?.data
            ?.message ||
            'Failed to create order',
        )
      } finally {
        setLoading(false)

        setShowQris(false)
      }
    }

  const handlePlaceOrder =
    async () => {
      if (
        cartItems.length ===
        0
      ) {
        toast.error(
          'Cart is empty',
        )

        return
      }

      if (
        orderType ===
          'DELIVERY' &&
        !deliveryAddress
      ) {
        toast.error(
          'Delivery address is required',
        )

        return
      }

      if (
        paymentMethod ===
        'QRIS'
      ) {
        setShowQris(true)

        return
      }

      await createOrder()
    }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Truck className="h-6 w-6 text-orange-500" />

              <h2 className="text-3xl font-black text-gray-900">
                Order Type
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <button
                onClick={() =>
                  setOrderType(
                    'DELIVERY',
                  )
                }
                className={`rounded-3xl border-2 p-6 text-left transition ${
                  orderType ===
                  'DELIVERY'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                <Truck className="h-8 w-8 text-orange-500" />

                <h3 className="mt-4 text-2xl font-black text-gray-900">
                  Delivery
                </h3>
              </button>

              <button
                onClick={() =>
                  setOrderType(
                    'PICKUP',
                  )
                }
                className={`rounded-3xl border-2 p-6 text-left transition ${
                  orderType ===
                  'PICKUP'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                <Store className="h-8 w-8 text-orange-500" />

                <h3 className="mt-4 text-2xl font-black text-gray-900">
                  Pickup
                </h3>
              </button>
            </div>
          </div>

          {orderType ===
            'DELIVERY' && (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <MapPin className="h-6 w-6 text-orange-500" />

                <h2 className="text-3xl font-black text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <textarea
                value={
                  deliveryAddress
                }
                onChange={(e) =>
                  setDeliveryAddress(
                    e.target.value,
                  )
                }
                className="h-40 w-full rounded-3xl border border-gray-200 p-5 outline-none"
              />
            </div>
          )}

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Banknote className="h-6 w-6 text-orange-500" />

              <h2 className="text-3xl font-black text-gray-900">
                Payment Method
              </h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() =>
                  setPaymentMethod(
                    'CASH',
                  )
                }
                className={`w-full rounded-3xl border-2 p-5 text-left ${
                  paymentMethod ===
                  'CASH'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                Cash
              </button>

              <button
                onClick={() =>
                  setPaymentMethod(
                    'QRIS',
                  )
                }
                className={`w-full rounded-3xl border-2 p-5 text-left ${
                  paymentMethod ===
                  'QRIS'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                QRIS
              </button>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-5">
            {cartItems.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4"
                >
                  <Image
                    src={
                      item.menu.image
                    }
                    alt={
                      item.menu.name
                    }
                    width={80}
                    height={80}
                    unoptimized
                    className="h-20 w-20 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {
                        item.menu.name
                      }
                    </h3>

                    <p className="text-sm text-gray-500">
                      Qty:{' '}
                      {
                        item.quantity
                      }
                    </p>
                  </div>

                  <h3 className="font-black text-orange-500">
                    Rp{' '}
                    {(
                      item.menu.price *
                      item.quantity
                    ).toLocaleString()}
                  </h3>
                </div>
              ),
            )}
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black text-gray-900">
                Total
              </h3>

              <h3 className="text-5xl font-black text-orange-500">
                Rp{' '}
                {totalPrice.toLocaleString()}
              </h3>
            </div>
          </div>

          <button
            onClick={
              handlePlaceOrder
            }
            disabled={loading}
            className="mt-8 flex h-16 w-full items-center justify-center rounded-3xl bg-orange-500 text-xl font-black text-white"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>

      {showQris && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black text-gray-900">
                QRIS Payment
              </h2>

              <button
                onClick={() =>
                  setShowQris(
                    false,
                  )
                }
              >
                <X className="h-8 w-8 text-gray-500" />
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border">
              <Image
                src="/qris.jpeg"
                alt="QRIS"
                width={500}
                height={700}
                priority
                className="w-full"
              />
            </div>

            <button
              onClick={
                createOrder
              }
              disabled={loading}
              className="mt-6 flex h-16 w-full items-center justify-center rounded-3xl bg-orange-500 text-xl font-black text-white"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                'I Have Paid'
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}