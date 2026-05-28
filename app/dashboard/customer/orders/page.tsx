'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import {
  Clock3,
  Eye,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react'

import { api } from '@/lib/api'

type Order = {
  id: string
  orderCode: string
  status: string
  orderType: string
  totalPrice: number
  createdAt: string

  seller: {
    storeName: string
  }

  payment: {
    paymentMethod: string
    paymentStatus: string
  }

  items: {
    id: string

    quantity: number

    menu: {
      name: string
      image: string
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders =
    async () => {
      try {
        const response =
          await api.get(
            '/orders/me',
          )

        setOrders(
          response.data,
        )
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
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
          <Clock3 className="h-4 w-4" />
        )

      case 'ON_DELIVERY':
        return (
          <Truck className="h-4 w-4" />
        )

      case 'COMPLETED':
        return (
          <PackageCheck className="h-4 w-4" />
        )

      case 'CANCELLED':
        return (
          <XCircle className="h-4 w-4" />
        )

      default:
        return (
          <ShoppingBag className="h-4 w-4" />
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
          My Orders
        </h1>

        <p className="mt-2 text-gray-500">
          Track your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white py-24 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <ShoppingBag className="h-10 w-10" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-gray-900">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Start ordering your
            favorite food
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(
            (order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black text-gray-900">
                        {
                          order.orderCode
                        }
                      </h2>

                      <div
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {getStatusIcon(
                          order.status,
                        )}

                        {order.status}
                      </div>
                    </div>

                    <p className="mt-3 text-gray-500">
                      {
                        order.seller
                          ?.storeName
                      }
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        {
                          order.orderType
                        }
                      </span>

                      <span>
                        {
                          order.payment
                            ?.paymentMethod
                        }
                      </span>

                      <span>
                        {new Date(
                          order.createdAt,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <h3 className="text-3xl font-black text-orange-500">
                        Rp{' '}
                        {Number(
                          order.totalPrice,
                        ).toLocaleString()}
                      </h3>
                    </div>

                    <Link
                      href={`/dashboard/customer/orders/${order.id}`}
                      className="flex h-14 items-center gap-3 rounded-2xl bg-orange-500 px-6 font-semibold text-white transition hover:bg-orange-600"
                    >
                      <Eye className="h-5 w-5" />

                      Detail
                    </Link>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {order.items.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4"
                      >
                        <img
                          src={
                            item.menu
                              ?.image ||
                            'https://placehold.co/200x200'
                          }
                          alt={
                            item.menu
                              ?.name
                          }
                          className="h-20 w-20 rounded-2xl object-cover"
                        />

                        <div>
                          <h3 className="font-bold text-gray-900">
                            {
                              item.menu
                                ?.name
                            }
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Qty:{' '}
                            {
                              item.quantity
                            }
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}