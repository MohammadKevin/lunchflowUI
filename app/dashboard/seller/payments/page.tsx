'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Payment = {
  id: string
  paymentMethod: string
  paymentStatus: string
  paymentProof: string
  paidAt: string
  createdAt: string

  order: {
    id: string
    orderCode: string
    totalPrice: number

    user: {
      fullName: string
      email: string
    }
  }
}

export default function SellerPaymentsPage() {
  const [payments, setPayments] =
    useState<Payment[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments =
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
            `/payments/seller/${seller.id}`,
          )

        setPayments(
          response.data,
        )
      } catch (error: any) {
        console.log(
          error.response?.data,
        )

        toast.error(
          'Failed to fetch payments',
        )
      } finally {
        setIsLoading(false)
      }
    }

  const updatePaymentStatus =
    async (
      paymentId: string,
      paymentStatus: string,
    ) => {
      try {
        await api.patch(
          `/payments/${paymentId}/status`,
          {
            paymentStatus,
          },
        )

        toast.success(
          'Payment updated successfully',
        )

        fetchPayments()
      } catch (error: any) {
        console.log(
          error.response?.data,
        )

        toast.error(
          'Failed to update payment',
        )
      }
    }

  const getStatusColor = (
    status: string,
  ) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-600'

      case 'UNPAID':
        return 'bg-yellow-100 text-yellow-600'

      case 'FAILED':
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Payments
        </h1>

        <p className="mt-2 text-gray-500">
          Manage customer payments.
        </p>
      </div>

      <div className="grid gap-6">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {
                    payment.order
                      .orderCode
                  }
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {
                    payment.order
                      .user
                      .fullName
                  }{' '}
                  •{' '}
                  {
                    payment.order
                      .user.email
                  }
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                    payment.paymentStatus,
                  )}`}
                >
                  {
                    payment.paymentStatus
                  }
                </span>

                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                  {
                    payment.paymentMethod
                  }
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Total Payment
                  </p>

                  <h3 className="text-3xl font-black text-orange-500">
                    Rp{' '}
                    {Number(
                      payment.order
                        .totalPrice,
                    ).toLocaleString()}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Payment Date
                  </p>

                  <h3 className="font-semibold text-gray-900">
                    {payment.paidAt
                      ? new Date(
                          payment.paidAt,
                        ).toLocaleString()
                      : '-'}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updatePaymentStatus(
                        payment.id,
                        'PAID',
                      )
                    }
                    className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Mark Paid
                  </button>

                  <button
                    onClick={() =>
                      updatePaymentStatus(
                        payment.id,
                        'FAILED',
                      )
                    }
                    className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Mark Failed
                  </button>

                  <button
                    onClick={() =>
                      updatePaymentStatus(
                        payment.id,
                        'UNPAID',
                      )
                    }
                    className="rounded-2xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Mark Unpaid
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-500">
                  Payment Proof
                </p>

                {payment.paymentProof ? (
                  <img
                    src={
                      payment.paymentProof
                    }
                    alt="Payment Proof"
                    className="h-72 w-full rounded-3xl object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                    No Payment Proof
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {payments.length ===
          0 && (
          <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              No Payments Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Customer payments will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}