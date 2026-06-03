'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Banknote,
  Loader2,
  MapPin,
  Store,
  Truck,
  X,
  UploadCloud,
  CheckCircle2
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
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showQris, setShowQris] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH')
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart')
      setCartItems(res.data.items || [])
    } catch {
      toast.error('Failed to fetch cart')
    }
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.menu.price * item.quantity,
    0,
  )

  const createOrder = async () => {
    try {
      setLoading(true)
      const order = await api.post('/orders', {
        sellerId: cartItems[0].menu.sellerId,
        orderType,
        paymentMethod,
        notes,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
      })

      if (paymentMethod === 'QRIS') {
        if (!paymentProof) {
          toast.error('Upload bukti pembayaran')
          return
        }

        const form = new FormData()
        form.append('paymentProof', paymentProof)

        await api.patch(
          `/payments/${order.data.payment.id}/upload-proof`,
          form,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      }

      await api.delete('/cart')
      toast.success('Order berhasil dibuat')
      router.push('/dashboard/customer/orders')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal checkout')
    } finally {
      setLoading(false)
      setShowQris(false)
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart kosong')
      return
    }

    if (orderType === 'DELIVERY' && !deliveryAddress) {
      toast.error('Alamat wajib diisi')
      return
    }

    if (paymentMethod === 'QRIS') {
      setShowQris(true)
      return
    }

    await createOrder()
  }

  return (
    <>
      <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1fr_420px] p-4 lg:p-8 min-h-screen bg-gray-50">
        
        {/* LEFT COLUMN: Form Options */}
        <div className="space-y-6">
          {/* Order Type Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">Order Type</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setOrderType('DELIVERY')}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all duration-200 ${
                  orderType === 'DELIVERY'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Truck className="h-6 w-6" />
                <span>Delivery</span>
              </button>

              <button
                onClick={() => setOrderType('PICKUP')}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all duration-200 ${
                  orderType === 'PICKUP'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Store className="h-6 w-6" />
                <span>Pickup</span>
              </button>
            </div>
          </div>

          {/* Delivery Address Section */}
          {orderType === 'DELIVERY' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" /> Alamat Pengiriman
              </h2>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Tuliskan alamat lengkap pengiriman Anda..."
                className="w-full rounded-xl border border-gray-200 p-4 h-32 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none text-gray-700"
              />
            </div>
          )}

          {/* Notes Section (Optional but good for UI) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Catatan Pesanan (Opsional)</h2>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Sambal dipisah, sendok plastik..."
              className="w-full rounded-xl border border-gray-200 p-4 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-700"
            />
          </div>

          {/* Payment Method Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Metode Pembayaran</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                  paymentMethod === 'CASH'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Banknote className="h-5 w-5" />
                <span>Tunai (Cash)</span>
              </button>

              <button
                onClick={() => setPaymentMethod('QRIS')}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                  paymentMethod === 'QRIS'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="font-bold text-xs border border-current px-1.5 py-0.5 rounded">QRIS</span>
                <span>QRIS Digital</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-fit sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 py-6 text-center">Keranjang Anda kosong.</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex gap-3 items-center">
                    <Image
                      src={item.menu.image}
                      alt={item.menu.name}
                      width={64}
                      height={64}
                      unoptimized
                      className="rounded-xl object-cover border border-gray-100"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{item.menu.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">
                    Rp {(item.menu.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Total Pembayaran</span>
              <span className="text-2xl font-black text-orange-500">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className="flex items-center justify-center h-14 w-full rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600 active:scale-[0.99] disabled:bg-gray-300 disabled:pointer-events-none transition-all shadow-md shadow-orange-500/20"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                `Bayar Sekarang (${paymentMethod})`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* QRIS MODAL MODIFICATION */}
      {showQris && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Pembayaran QRIS</h2>
              <button
                onClick={() => {
                  setShowQris(false)
                  setPaymentProof(null)
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl flex justify-center border border-gray-100 mb-5">
              <div className="relative bg-white p-3 rounded-lg shadow-sm">
                <Image
                  src="/qris.jpeg"
                  alt="QRIS Code"
                  width={240}
                  height={320}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Custom Styled File Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Bukti Pembayaran <span className="text-red-500">*</span>
              </label>
              
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                paymentProof 
                  ? 'border-green-400 bg-green-50/30' 
                  : 'border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50/10'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  {paymentProof ? (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-green-700 line-clamp-1">{paymentProof.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Klik untuk mengganti gambar</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Klik untuk upload bukti bayar</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG atau JPEG (Max. 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={createOrder}
              disabled={loading || !paymentProof}
              className="mt-6 h-12 w-full rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Memproses...</span>
                </div>
              ) : (
                'Saya Sudah Bayar'
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}