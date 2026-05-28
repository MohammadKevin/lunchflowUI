'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Order = {
  id: string

  orderCode: string

  orderType: string

  totalPrice: number

  status: string

  createdAt: string

  user: {
    fullName: string

    email: string
  }

  seller: {
    storeName: string
  }

  payment: {
    paymentMethod: string

    paymentStatus: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const fetchOrders =
    async () => {
      try {
        const response =
          await api.get('/orders')

        setOrders(response.data)
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch orders',
        )
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderStatus =
    async (
      id: string,
      status: string,
    ) => {
      try {
        await api.patch(
          `/orders/${id}/status`,
          {
            status,
          },
        )

        toast.success(
          'Order status updated',
        )

        fetchOrders()
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to update order',
        )
      }
    }

  const cancelOrder =
    async (id: string) => {
      const confirmCancel =
        confirm(
          'Are you sure you want to cancel this order?',
        )

      if (!confirmCancel) {
        return
      }

      try {
        await api.patch(
          `/orders/${id}/cancel`,
        )

        toast.success(
          'Order cancelled',
        )

        fetchOrders()
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to cancel order',
        )
      }
    }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading orders...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Orders
        </h1>

        <p className="mt-2 text-gray-500">
          Manage all customer
          orders.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">
                  Order Code
                </th>

                <th className="px-6 py-4">
                  Customer
                </th>

                <th className="px-6 py-4">
                  Seller
                </th>

                <th className="px-6 py-4">
                  Order Type
                </th>

                <th className="px-6 py-4">
                  Payment
                </th>

                <th className="px-6 py-4">
                  Total
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Created At
                </th>

                <th className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b last:border-none"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.orderCode}
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {
                          order.user
                            ?.fullName
                        }
                      </h3>

                      <p className="text-sm text-gray-500">
                        {
                          order.user
                            ?.email
                        }
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {
                      order.seller
                        ?.storeName
                    }
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                      {
                        order.orderType
                      }
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {
                          order.payment
                            ?.paymentMethod
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        {
                          order.payment
                            ?.paymentStatus
                        }
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900">
                    Rp{' '}
                    {Number(
                      order.totalPrice,
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.status ===
                        'COMPLETED'
                          ? 'bg-green-100 text-green-600'
                          : order.status ===
                              'CANCELLED'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(
                      order.createdAt,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            'CONFIRMED',
                          )
                        }
                        className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            'COOKING',
                          )
                        }
                        className="rounded-xl bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                      >
                        Cooking
                      </button>

                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            'READY',
                          )
                        }
                        className="rounded-xl bg-green-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                      >
                        Ready
                      </button>

                      <button
                        onClick={() =>
                          cancelOrder(
                            order.id,
                          )
                        }
                        className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No orders found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}