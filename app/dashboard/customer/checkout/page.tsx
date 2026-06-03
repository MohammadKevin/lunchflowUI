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
  ] = useState(false)

  const [
    showQris,
    setShowQris,
  ] = useState(false)

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
  ] = useState<CartItem[]>(
    [],
  )

  const [
    deliveryAddress,
    setDeliveryAddress,
  ] = useState('')

  const [
    notes,
    setNotes,
  ] = useState('')

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<
    'CASH' | 'QRIS'
  >('CASH')

  const [
    orderType,
    setOrderType,
  ] = useState<
    'DELIVERY' | 'PICKUP'
  >('DELIVERY')

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
          res.data.items ||
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
        setLoading(true)

        const payload = {
          sellerId:
            cartItems[0]
              .menu
              .sellerId,

          orderType,

          paymentMethod,

          deliveryAddress:
            orderType ===
            'DELIVERY'
              ? deliveryAddress
              : undefined,

          notes,
        }

        const order =
          await api.post(
            '/orders',
            payload,
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

          const paymentId =
            order.data
              ?.payment?.id

          if (
            !paymentId
          ) {
            throw new Error(
              'Payment ID not found',
            )
          }

          const form =
            new FormData()

          form.append(
            'paymentProof',
            paymentProof,
          )

          await api.patch(
            `/payments/${paymentId}/upload-proof`,
            form,
            {
              headers: {
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
          'Order created successfully',
        )

        router.push(
          '/dashboard/customer/orders',
        )
      } catch (
        error: any
      ) {
        console.log(
          error,
        )

        toast.error(
          error.response
            ?.data
            ?.message ||
            error.message ||
            'Failed create order',
        )
      } finally {
        setLoading(false)
        setShowQris(false)
      }
    }

  const handlePlaceOrder =
    async () => {
      if (
        cartItems.length ===
        0
      ) {
        toast.error(
          'Cart is empty',
        )
        return
      }

      if (
        orderType ===
          'DELIVERY' &&
        !deliveryAddress
      ) {
        toast.error(
          'Delivery address required',
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
      <button
        onClick={
          handlePlaceOrder
        }
      >
        Place Order
      </button>

      {showQris && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6">

            <div className="flex justify-between">

              <h2 className="text-3xl font-black">
                QRIS Payment
              </h2>

              <button
                onClick={() =>
                  setShowQris(
                    false,
                  )
                }
              >
                <X />
              </button>

            </div>

            <div className="mt-6">

              <Image
                src="/qris.jpeg"
                alt="QRIS"
                width={500}
                height={700}
                className="rounded-3xl"
              />

            </div>

            <div className="mt-5">

              <label>
                Upload Bukti
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(
                  e,
                ) =>
                  setPaymentProof(
                    e
                      .target
                      .files?.[0] ||
                      null,
                  )
                }
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <button
              onClick={
                createOrder
              }
              disabled={
                loading
              }
              className="mt-6 w-full rounded-3xl bg-orange-500 p-4 text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'I Have Paid'
              )}
            </button>

          </div>

        </div>
      )}
    </>
  )
}