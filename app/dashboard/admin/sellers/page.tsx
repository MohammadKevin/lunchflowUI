'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Seller = {
  id: string

  storeName: string

  description: string

  phone: string

  status: string

  isOpen: boolean

  createdAt: string

  user: {
    fullName: string

    email: string
  }
}

export default function SellersPage() {
  const [sellers, setSellers] =
    useState<Seller[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const fetchSellers =
    async () => {
      try {
        const response =
          await api.get('/sellers')

        setSellers(response.data)
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch sellers',
        )
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchSellers()
  }, [])

  const approveSeller =
    async (id: string) => {
      try {
        await api.patch(
          `/sellers/${id}/approve`,
        )

        toast.success(
          'Seller approved successfully',
        )

        fetchSellers()
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to approve seller',
        )
      }
    }

  const rejectSeller =
    async (id: string) => {
      try {
        await api.patch(
          `/sellers/${id}/reject`,
          {
            reason:
              'Rejected by admin',
          },
        )

        toast.success(
          'Seller rejected successfully',
        )

        fetchSellers()
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to reject seller',
        )
      }
    }

  const deleteSeller =
    async (id: string) => {
      const confirmDelete =
        confirm(
          'Are you sure you want to delete this seller?',
        )

      if (!confirmDelete) {
        return
      }

      try {
        await api.delete(
          `/sellers/${id}`,
        )

        toast.success(
          'Seller deleted successfully',
        )

        fetchSellers()
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to delete seller',
        )
      }
    }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading sellers...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Sellers
        </h1>

        <p className="mt-2 text-gray-500">
          Manage all LunchFlow
          sellers.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">
                  Store
                </th>

                <th className="px-6 py-4">
                  Owner
                </th>

                <th className="px-6 py-4">
                  Phone
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Store Status
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
              {sellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="border-b last:border-none"
                >
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {
                          seller.storeName
                        }
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          seller.description
                        }
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {
                          seller.user
                            ?.fullName
                        }
                      </h3>

                      <p className="text-sm text-gray-500">
                        {
                          seller.user
                            ?.email
                        }
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {seller.phone}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        seller.status ===
                        'APPROVED'
                          ? 'bg-green-100 text-green-600'
                          : seller.status ===
                              'REJECTED'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {seller.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {seller.isOpen ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
                        Open
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                        Closed
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(
                      seller.createdAt,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {seller.status ===
                        'PENDING' && (
                        <>
                          <button
                            onClick={() =>
                              approveSeller(
                                seller.id,
                              )
                            }
                            className="rounded-xl bg-green-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              rejectSeller(
                                seller.id,
                              )
                            }
                            className="rounded-xl bg-yellow-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        onClick={() =>
                          deleteSeller(
                            seller.id,
                          )
                        }
                        className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sellers.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No sellers found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}