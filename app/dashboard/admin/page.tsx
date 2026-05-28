'use client'

import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type DashboardData = {
  totalUsers: number
  totalSellers: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
}

export default function AdminPage() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>({
      totalUsers: 0,
      totalSellers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
    })

  const [isLoading, setIsLoading] =
    useState(true)

  const fetchDashboard =
    async () => {
      try {
        const [
          usersRes,
          sellersRes,
          ordersRes,
        ] = await Promise.all([
          api.get('/users'),

          api.get('/sellers'),

          api.get('/orders'),
        ])

        const users =
          usersRes.data || []

        const sellers =
          sellersRes.data || []

        const orders =
          ordersRes.data || []

        const totalRevenue =
          orders.reduce(
            (
              acc: number,
              order: any,
            ) =>
              acc +
              Number(
                order.totalPrice ||
                  0,
              ),

            0,
          )

        setDashboardData({
          totalUsers:
            users.length,

          totalSellers:
            sellers.length,

          totalOrders:
            orders.length,

          totalRevenue,

          recentOrders:
            orders.slice(0, 5),
        })
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor your LunchFlow
          system easily.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Users
          </p>

          <h2 className="mt-4 text-4xl font-black text-gray-900">
            {
              dashboardData.totalUsers
            }
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Sellers
          </p>

          <h2 className="mt-4 text-4xl font-black text-gray-900">
            {
              dashboardData.totalSellers
            }
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-4 text-4xl font-black text-gray-900">
            {
              dashboardData.totalOrders
            }
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <h2 className="mt-4 text-4xl font-black text-gray-900">
            Rp{' '}
            {dashboardData.totalRevenue.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">
            Recent Orders
          </h2>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-4">
                  Order ID
                </th>

                <th className="pb-4">
                  Customer
                </th>

                <th className="pb-4">
                  Status
                </th>

                <th className="pb-4">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {dashboardData.recentOrders.map(
                (order: any) => (
                  <tr
                    key={order.id}
                    className="border-b"
                  >
                    <td className="py-4 font-medium">
                      {
                        order.orderCode
                      }
                    </td>

                    <td className="py-4">
                      {
                        order.user
                          ?.fullName
                      }
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-500">
                        {
                          order.status
                        }
                      </span>
                    </td>

                    <td className="py-4">
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
        </div>
      </div>
    </div>
  )
}