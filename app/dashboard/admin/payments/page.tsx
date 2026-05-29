'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Payment = {
  id: string
  paymentMethod: string
  paymentStatus: string
  paymentProof: string | null
  createdAt: string
  paidAt: string | null

  order: {
    orderCode: string
    totalPrice: number
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const fetchPayments =
    async () => {
      try {
        const response =
          await api.get('/payments')

        setPayments(response.data)
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch payments',
        )
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchPayments()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading payments...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Payments
        </h1>

        <p className="mt-2 text-gray-500">
          Manage all payment
          transactions.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">
                  Order
                </th>

                <th className="px-6 py-4">
                  Method
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Total
                </th>

                <th className="px-6 py-4">
                  Proof
                </th>

                <th className="px-6 py-4">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map(
                (payment) => (
                  <tr
                    key={payment.id}
                    className="border-b last:border-none"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {
                        payment.order
                          ?.orderCode
                      }
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                        {
                          payment.paymentMethod
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          payment.paymentStatus ===
                          'PAID'
                            ? 'bg-green-100 text-green-600'
                            : payment.paymentStatus ===
                                'FAILED'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {
                          payment.paymentStatus
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      Rp{' '}
                      {Number(
                        payment.order
                          ?.totalPrice,
                      ).toLocaleString(
                        'id-ID',
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {payment.paymentProof ? (
                        <a
                          href={
                            payment.paymentProof
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-orange-500 hover:underline"
                        >
                          View Proof
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No Proof
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        payment.createdAt,
                      ).toLocaleDateString(
                        'id-ID',
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {payments.length ===
            0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No payments found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}