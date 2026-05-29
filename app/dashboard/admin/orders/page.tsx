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
          <table className="w-full min-w-[900px]">
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
              </tr>
            </thead>

            <tbody>
              {orders.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-none"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {
                        order.orderCode
                      }
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
                      ).toLocaleString(
                        'id-ID',
                      )}
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
                        {
                          order.status
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        order.createdAt,
                      ).toLocaleDateString(
                        'id-ID',
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {orders.length ===
            0 && (
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