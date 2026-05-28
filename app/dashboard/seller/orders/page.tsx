'use client'

import { useEffect, useState } from 'react'

import {
  CheckCircle2,
  Clock3,
  CookingPot,
  PackageCheck,
  ShoppingBag,
  XCircle,
} from 'lucide-react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type OrderItem = {
  id: string
  quantity: number
  subtotal: number

  menu: {
    name: string
    image: string
  }
}

type Order = {
  id: string
  orderCode: string
  orderType: string
  status: string
  totalPrice: number
  createdAt: string

  user: {
    fullName: string
    email: string
  }

  items: OrderItem[]
}

export default function SellerOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders =
    async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem(
            'user',
          ) || '{}',
        )

        const sellerResponse =
          await api.get('/sellers')

        const seller =
          sellerResponse.data.find(
            (item: any) =>
              item.userId ===
              user.id,
          )

        if (!seller) {
          return
        }

        const response =
          await api.get(
            `/orders/seller/${seller.id}`,
          )

        setOrders(response.data)
      } catch (error: any) {
        console.log(
          error.response?.data,
        )

        toast.error(
          'Failed to fetch orders',
        )
      } finally {
        setIsLoading(false)
      }
    }

  const updateStatus =
    async (
      orderId: string,
      status: string,
    ) => {
      try {
        await api.patch(
          `/orders/${orderId}/status`,
          {
            status,
          },
        )

        toast.success(
          'Order updated',
        )

        fetchOrders()
      } catch (error: any) {
        console.log(
          error.response?.data,
        )

        toast.error(
          'Failed to update order',
        )
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

      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-600'

      case 'CANCELLED':
        return 'bg-red-100 text-red-600'

      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900">
          Orders
        </h1>

        <p className="mt-2 text-gray-500">
          Manage customer orders
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[32px] bg-white p-7 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-3 text-5xl font-black text-gray-900">
            {orders.length}
          </h2>
        </div>

        <div className="rounded-[32px] bg-white p-7 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Orders
          </p>

          <h2 className="mt-3 text-5xl font-black text-yellow-500">
            {
              orders.filter(
                (item) =>
                  item.status ===
                  'PENDING',
              ).length
            }
          </h2>
        </div>

        <div className="rounded-[32px] bg-white p-7 shadow-sm">
          <p className="text-sm text-gray-500">
            Completed Orders
          </p>

          <h2 className="mt-3 text-5xl font-black text-green-500">
            {
              orders.filter(
                (item) =>
                  item.status ===
                  'COMPLETED',
              ).length
            }
          </h2>
        </div>
      </div>

      {orders.length ===
      0 ? (
        <div className="rounded-[32px] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <ShoppingBag className="h-12 w-12" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-gray-900">
            No Orders Yet
          </h2>

          <p className="mt-3 text-gray-500">
            Customer orders will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          {orders.map(
            (order) => (
              <div
                key={order.id}
                className="rounded-[32px] border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 border-b border-gray-100 pb-7 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black tracking-tight text-gray-900">
                        {
                          order.orderCode
                        }
                      </h2>

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-bold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {
                          order.status
                        }
                      </span>
                    </div>

                    <p className="mt-3 text-gray-500">
                      {
                        order.user
                          .fullName
                      }{' '}
                      •{' '}
                      {
                        order.user
                          .email
                      }
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      {
                        order.items
                          .length
                      }{' '}
                      items •{' '}
                      {
                        order.orderType
                      }
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-sm text-gray-500">
                      Total Price
                    </p>

                    <h3 className="mt-2 text-4xl font-black tracking-tight text-orange-500">
                      Rp{' '}
                      {Number(
                        order.totalPrice,
                      ).toLocaleString()}
                    </h3>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  {order.items.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-3xl bg-gray-50 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              item.menu
                                .image ||
                              'https://placehold.co/100x100'
                            }
                            alt={
                              item.menu
                                .name
                            }
                            className="h-20 w-20 rounded-3xl object-cover"
                          />

                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {
                                item
                                  .menu
                                  .name
                              }
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity:{' '}
                              {
                                item.quantity
                              }
                            </p>
                          </div>
                        </div>

                        <h3 className="text-xl font-black text-gray-900">
                          Rp{' '}
                          {Number(
                            item.subtotal,
                          ).toLocaleString()}
                        </h3>
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-7 flex flex-col gap-6 border-t border-gray-100 pt-7 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order Date
                    </p>

                    <h3 className="mt-1 font-semibold text-gray-900">
                      {new Date(
                        order.createdAt,
                      ).toLocaleString()}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          'CONFIRMED',
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.03]"
                    >
                      <CheckCircle2 className="h-4 w-4" />

                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          'COOKING',
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.03]"
                    >
                      <CookingPot className="h-4 w-4" />

                      Cooking
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          'READY',
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.03]"
                    >
                      <Clock3 className="h-4 w-4" />

                      Ready
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          'COMPLETED',
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.03]"
                    >
                      <PackageCheck className="h-4 w-4" />

                      Complete
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          order.id,
                          'CANCELLED',
                        )
                      }
                      className="flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.03]"
                    >
                      <XCircle className="h-4 w-4" />

                      Cancel
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