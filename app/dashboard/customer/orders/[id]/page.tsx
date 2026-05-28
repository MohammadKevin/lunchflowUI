'use client'

import Link from 'next/link'

import {
  use,
  useEffect,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Clock3,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  Wallet,
  XCircle,
} from 'lucide-react'

import { api } from '@/lib/api'

type Order = {
  id: string
  orderCode: string
  status: string
  orderType: string
  totalPrice: number
  deliveryAddress?: string
  notes?: string
  pickupCode?: string
  queueNumber?: number
  createdAt: string

  seller: {
    storeName: string
  }

  payment: {
    paymentMethod: string
    paymentStatus: string
    paymentProof?: string
  }

  items: {
    id: string
    quantity: number
    price: number
    subtotal: number
    notes?: string

    menu: {
      name: string
      image: string
    }
  }[]
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = use(params)

  const router = useRouter()

  const [order, setOrder] =
    useState<Order | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [cancelLoading, setCancelLoading] =
    useState(false)

  useEffect(() => {
    fetchOrder()
  }, [])

  const fetchOrder =
    async () => {
      try {
        const response =
          await api.get(
            `/orders/${id}`,
          )

        setOrder(
          response.data,
        )
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

  const cancelOrder =
    async () => {
      try {
        setCancelLoading(true)

        await api.patch(
          `/orders/${id}/cancel`,
        )

        fetchOrder()
      } catch (error) {
        console.log(error)
      } finally {
        setCancelLoading(false)
      }
    }

  const getStatusColor = (
    status: string,
  ) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-600'

      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-600'

      case 'COOKING':
        return 'bg-orange-100 text-orange-600'

      case 'READY':
        return 'bg-green-100 text-green-600'

      case 'ON_DELIVERY':
        return 'bg-purple-100 text-purple-600'

      case 'COMPLETED':
        return 'bg-green-100 text-green-700'

      case 'CANCELLED':
        return 'bg-red-100 text-red-600'

      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (
    status: string,
  ) => {
    switch (status) {
      case 'PENDING':
        return (
          <Clock3 className="h-5 w-5" />
        )

      case 'ON_DELIVERY':
        return (
          <Truck className="h-5 w-5" />
        )

      case 'COMPLETED':
        return (
          <PackageCheck className="h-5 w-5" />
        )

      case 'CANCELLED':
        return (
          <XCircle className="h-5 w-5" />
        )

      default:
        return (
          <ShoppingBag className="h-5 w-5" />
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

  if (!order) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Order not found
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

      <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-4xl font-black text-gray-900">
                    {
                      order.orderCode
                    }
                  </h1>

                  <div
                    className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {getStatusIcon(
                      order.status,
                    )}

                    {order.status}
                  </div>
                </div>

                <p className="mt-4 text-gray-500">
                  {new Date(
                    order.createdAt,
                  ).toLocaleString()}
                </p>
              </div>

              {order.status !==
                'COMPLETED' &&
                order.status !==
                  'CANCELLED' && (
                  <button
                    onClick={
                      cancelOrder
                    }
                    disabled={
                      cancelLoading
                    }
                    className="h-14 rounded-2xl bg-red-500 px-6 font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                  >
                    {cancelLoading
                      ? 'Cancelling...'
                      : 'Cancel Order'}
                  </button>
                )}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900">
              Order Items
            </h2>

            <div className="mt-8 space-y-5">
              {order.items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-3xl bg-gray-50 p-5 md:flex-row md:items-center"
                  >
                    <img
                      src={
                        item.menu
                          ?.image ||
                        'https://placehold.co/300x300'
                      }
                      alt={
                        item.menu
                          ?.name
                      }
                      className="h-32 w-full rounded-3xl object-cover md:w-32"
                    />

                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900">
                        {
                          item.menu
                            ?.name
                        }
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
                        <span>
                          Qty:{' '}
                          {
                            item.quantity
                          }
                        </span>

                        <span>
                          Price:
                          Rp{' '}
                          {Number(
                            item.price,
                          ).toLocaleString()}
                        </span>
                      </div>

                      {item.notes && (
                        <div className="mt-4 rounded-2xl bg-white p-4">
                          <p className="text-sm text-gray-500">
                            Notes
                          </p>

                          <p className="mt-1 font-medium text-gray-900">
                            {
                              item.notes
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    <h3 className="text-3xl font-black text-orange-500">
                      Rp{' '}
                      {Number(
                        item.subtotal,
                      ).toLocaleString()}
                    </h3>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900">
              Order Info
            </h2>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                  <Store className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Seller
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900">
                    {
                      order.seller
                        ?.storeName
                    }
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-500">
                  <Truck className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Order Type
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900">
                    {
                      order.orderType
                    }
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-500">
                  <Wallet className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Payment
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900">
                    {
                      order.payment
                        ?.paymentMethod
                    }
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {
                      order.payment
                        ?.paymentStatus
                    }
                  </p>
                </div>
              </div>

              {order.orderType ===
                'DELIVERY' &&
                order.deliveryAddress && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                      <MapPin className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Delivery
                        Address
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-gray-900">
                        {
                          order.deliveryAddress
                        }
                      </h3>
                    </div>
                  </div>
                )}

              {order.orderType ===
                'PICKUP' && (
                <div className="rounded-3xl bg-orange-50 p-6">
                  <h3 className="text-xl font-black text-orange-500">
                    Pickup Info
                  </h3>

                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Queue Number
                      </p>

                      <h4 className="mt-1 text-3xl font-black text-gray-900">
                        #
                        {
                          order.queueNumber
                        }
                      </h4>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Pickup Code
                      </p>

                      <h4 className="mt-1 text-3xl font-black text-orange-500">
                        {
                          order.pickupCode
                        }
                      </h4>
                    </div>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="rounded-3xl bg-gray-50 p-6">
                  <p className="text-sm text-gray-500">
                    Notes
                  </p>

                  <p className="mt-2 text-lg font-medium text-gray-900">
                    {
                      order.notes
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-500">
                Total
              </span>

              <h2 className="text-4xl font-black text-orange-500">
                Rp{' '}
                {Number(
                  order.totalPrice,
                ).toLocaleString()}
              </h2>
            </div>

            <Link
              href="/dashboard/customer/orders"
              className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
            >
              Back To Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}