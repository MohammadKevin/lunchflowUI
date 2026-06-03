'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  useEffect,
  useState,
} from 'react'

import {
  Banknote,
  Loader2,
  MapPin,
  Store,
  Truck,
  X,
} from 'lucide-react'

import { toast } from 'sonner'
import { api } from '@/lib/api'

type CartItem = {
  id: string
  quantity: number

  menu: {
    id: string
    sellerId: string
    name: string
    image: string
    price: number

    seller: {
      storeName: string
    }
  }
}

export default function CheckoutPage() {
  const router =
    useRouter()

  const [
    loading,
    setLoading,
  ] =
    useState(false)

  const [
    showQris,
    setShowQris,
  ] =
    useState(false)

  const [
    paymentProof,
    setPaymentProof,
  ] =
    useState<File | null>(
      null,
    )

  const [
    cartItems,
    setCartItems,
  ] =
    useState<CartItem[]>([])

  const [
    deliveryAddress,
    setDeliveryAddress,
  ] =
    useState('')

  const [
    notes,
    setNotes,
  ] =
    useState('')

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<
      'CASH' |
      'QRIS'
    >('CASH')

  const [
    orderType,
    setOrderType,
  ] =
    useState<
      'DELIVERY' |
      'PICKUP'
    >(
      'DELIVERY',
    )

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart =
    async () => {
      try {
        const res =
          await api.get(
            '/cart',
          )

        setCartItems(
          res.data
            .items ||
          [],
        )
      } catch {
        toast.error(
          'Failed to fetch cart',
        )
      }
    }

  const totalPrice =
    cartItems.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.menu.price *
        item.quantity,
      0,
    )

  const createOrder =
    async () => {
      try {
        setLoading(
          true,
        )

        const order =
          await api.post(
            '/orders',
            {
              sellerId:
                cartItems[0]
                  .menu
                  .sellerId,

              orderType,

              paymentMethod,

              notes,

              deliveryAddress:
                orderType ===
                  'DELIVERY'
                  ? deliveryAddress
                  : undefined,
            },
          )

        if (
          paymentMethod ===
          'QRIS'
        ) {
          if (
            !paymentProof
          ) {
            toast.error(
              'Upload bukti pembayaran',
            )

            return
          }

          const form =
            new FormData()

          form.append(
            'paymentProof',
            paymentProof,
          )

          await api.patch(
            `/payments/${order.data.payment.id}/upload-proof`,
            form,
            {
              headers:
              {
                'Content-Type':
                  'multipart/form-data',
              },
            },
          )
        }

        await api.delete(
          '/cart',
        )

        toast.success(
          'Order berhasil dibuat',
        )

        router.push(
          '/dashboard/customer/orders',
        )
      } catch (
      error: any
      ) {
        toast.error(
          error
            .response
            ?.data
            ?.message ||
          'Gagal checkout',
        )
      } finally {
        setLoading(
          false,
        )

        setShowQris(
          false,
        )
      }
    }

  const handleCheckout =
    async () => {
      if (
        cartItems.length ===
        0
      ) {
        toast.error(
          'Cart kosong',
        )

        return
      }

      if (
        orderType ===
        'DELIVERY' &&
        !deliveryAddress
      ) {
        toast.error(
          'Alamat wajib',
        )

        return
      }

      if (
        paymentMethod ===
        'QRIS'
      ) {
        setShowQris(
          true,
        )

        return
      }

      await createOrder()
    }

  return (
    <>

      <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1fr_420px]">

        <div className="space-y-6">

          <div className="rounded-3xl bg-white p-6">

            <h2 className="mb-5 text-3xl font-black">
              Order Type
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <button
                onClick={() =>
                  setOrderType(
                    'DELIVERY'
                  )}
                className={`rounded-3xl border p-6 ${orderType === 'DELIVERY'
                    ? 'border-orange-500'
                    : ''
                  }`}
              >
                <Truck />
                Delivery
              </button>

              <button
                onClick={() =>
                  setOrderType(
                    'PICKUP'
                  )}
                className={`rounded-3xl border p-6 ${orderType === 'PICKUP'
                    ? 'border-orange-500'
                    : ''
                  }`}
              >
                <Store />
                Pickup
              </button>

            </div>

          </div>

          {orderType === 'DELIVERY' && (

            <div className="rounded-3xl bg-white p-6">

              <h2 className="mb-4 text-3xl font-black">
                Alamat
              </h2>

              <textarea
                value={
                  deliveryAddress
                }
                onChange={(e) =>
                  setDeliveryAddress(
                    e.target.value
                  )}
                className="w-full rounded-3xl border p-4 h-40"
              />

            </div>

          )}

          <div className="rounded-3xl bg-white p-6">

            <h2 className="mb-4 text-3xl font-black">
              Pembayaran
            </h2>

            <div className="space-y-3">

              <button
                onClick={() =>
                  setPaymentMethod(
                    'CASH'
                  )}
                className="w-full rounded-xl border p-4"
              >
                Cash
              </button>

              <button
                onClick={() =>
                  setPaymentMethod(
                    'QRIS'
                  )}
                className="w-full rounded-xl border p-4"
              >
                QRIS
              </button>

            </div>

          </div>

        </div>

        <div className="rounded-3xl bg-white p-6">

          <h2 className="text-3xl font-black">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">

            {cartItems.map(
              (item) => (

                <div
                  key={item.id}
                  className="flex gap-4"
                >

                  <Image
                    src={
                      item.menu.image
                    }
                    alt=""
                    width={80}
                    height={80}
                    unoptimized
                    className="rounded-2xl"
                  />

                  <div>

                    <h3>
                      {
                        item.menu.name
                      }
                    </h3>

                    <p>
                      Qty {
                        item.quantity
                      }
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

          <div className="mt-8">

            <h2 className="text-5xl font-black text-orange-500">

              Rp {
                totalPrice.toLocaleString()
              }

            </h2>

          </div>

          <button
            onClick={
              handleCheckout
            }
            disabled={
              loading
            }
            className="mt-8 h-16 w-full rounded-3xl bg-orange-500 text-white"
          >

            {
              loading
                ?
                <Loader2 className="animate-spin" />
                :
                'Place Order'
            }

          </button>

        </div>

      </div>

      {showQris && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white rounded-3xl p-6 w-[420px]">

            <div className="flex justify-between">

              <h2 className="text-3xl font-black">
                QRIS
              </h2>

              <button
                onClick={() =>
                  setShowQris(
                    false
                  )}
              >

                <X />

              </button>

            </div>

            <Image
              src="/qris.jpeg"
              alt=""
              width={500}
              height={700}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPaymentProof(
                  e.target.files?.[0]
                  ||
                  null
                )
              }
              className="mt-5"
            />

            <button
              onClick={
                createOrder
              }
              className="mt-6 h-14 w-full rounded-3xl bg-orange-500 text-white"
            >

              I Have Paid

            </button>

          </div>

        </div>

      )}

    </>

  )
}