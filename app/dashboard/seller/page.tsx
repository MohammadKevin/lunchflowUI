'use client'

import { useEffect, useState } from 'react'

import {
  CreditCard,
  Package,
  ShoppingBag,
  Store,
} from 'lucide-react'

import { api } from '@/lib/api'

export default function SellerDashboardPage() {
  const [totalMenus, setTotalMenus] =
    useState(0)

  const [totalOrders, setTotalOrders] =
    useState(0)

  const [totalPayments, setTotalPayments] =
    useState(0)

  const [storeStatus, setStoreStatus] =
    useState(true)

  const [recentOrders, setRecentOrders] =
    useState<any[]>([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard =
    async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem(
            'user',
          ) || '{}',
        )

        const sellerResponse =
          await api.get(
            `/sellers`,
          )

        const seller =
          sellerResponse.data.find(
            (item: any) =>
              item.userId ===
              user.id,
          )

        if (!seller) {
          return
        }

        setStoreStatus(
          seller.isOpen,
        )

        const menusResponse =
          await api.get(
            '/menus',
          )

        const sellerMenus =
          menusResponse.data.filter(
            (menu: any) =>
              menu.sellerId ===
              seller.id,
          )

        setTotalMenus(
          sellerMenus.length,
        )

        const ordersResponse =
          await api.get(
            `/orders/seller/${seller.id}`,
          )

        setTotalOrders(
          ordersResponse.data.length,
        )

        setRecentOrders(
          ordersResponse.data.slice(
            0,
            5,
          ),
        )

        const paymentsResponse =
          await api.get(
            '/payments',
          )

        const sellerPayments =
          paymentsResponse.data.filter(
            (payment: any) =>
              payment.order
                ?.sellerId ===
              seller.id,
          )

        setTotalPayments(
          sellerPayments.length,
        )
      } catch (error) {
        console.log(error)
      }
    }

  const cards = [
    {
      title: 'Total Menus',
      value: totalMenus,
      icon: ShoppingBag,
    },

    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Package,
    },

    {
      title: 'Payments',
      value: totalPayments,
      icon: CreditCard,
    },

    {
      title: 'Store Status',
      value: storeStatus
        ? 'Open'
        : 'Closed',
      icon: Store,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Seller Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome back 👋
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon =
            card.icon

          return (
            <div
              key={card.title}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-gray-900">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest customer orders
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3">
                  Order Code
                </th>

                <th className="px-4 py-3">
                  Customer
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map(
                (order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-none"
                  >
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {
                        order.orderCode
                      }
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {
                        order.user
                          ?.fullName
                      }
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-500">
                        {
                          order.status
                        }
                      </span>
                    </td>

                    <td className="px-4 py-4 font-medium text-gray-900">
                      Rp{' '}
                      {Number(
                        order.totalPrice,
                      ).toLocaleString()}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {recentOrders.length ===
            0 && (
            <div className="py-10 text-center text-gray-500">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}