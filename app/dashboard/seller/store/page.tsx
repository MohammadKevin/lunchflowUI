'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Seller = {
  id: string
  storeNumber: string
  storeName: string
  ownerName: string
  phone: string
  address: string
  description: string
  storeLogo: string
  openTime: string
  closeTime: string
  qrisImage: string
  isOpen: boolean
}

export default function SellerStorePage() {
  const [seller, setSeller] = useState<Seller | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [storeLogo, setStoreLogo] = useState<File | null>(null)
  const [qrisImage, setQrisImage] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    address: '',
    description: '',
    openTime: '',
    closeTime: '',
    isOpen: true,
  })

  useEffect(() => {
    fetchStore()
  }, [])

  const fetchStore = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await api.get('/sellers')
      const sellerData = response.data.find((item: any) => item.userId === user.id)

      if (!sellerData) return

      setSeller(sellerData)
      setFormData({
        storeName: sellerData.storeName || '',
        ownerName: sellerData.ownerName || '',
        phone: sellerData.phone || '',
        address: sellerData.address || '',
        description: sellerData.description || '',
        openTime: sellerData.openTime || '',
        closeTime: sellerData.closeTime || '',
        isOpen: sellerData.isOpen,
      })
    } catch (error: any) {
      console.log(error.response?.data)
      toast.error('Gagal memuat data toko')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  // Toggle buka/tutup — endpoint terpisah: PATCH /sellers/:id/store-status
  const toggleStoreStatus = async (isOpen: boolean) => {
    if (!seller) return

    try {
      await api.patch(`/sellers/${seller.id}/store-status`, { isOpen })
      setFormData((prev) => ({ ...prev, isOpen }))
      toast.success(isOpen ? 'Toko sekarang buka' : 'Toko sekarang tutup')
    } catch (error: any) {
      console.log(error.response?.data)
      toast.error('Gagal mengubah status toko')
    }
  }

  const updateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!seller) return

    try {
      const form = new FormData()
      form.append('storeName', formData.storeName)
      form.append('ownerName', formData.ownerName)
      form.append('phone', formData.phone)
      form.append('address', formData.address)
      form.append('description', formData.description)
      form.append('openTime', formData.openTime)
      form.append('closeTime', formData.closeTime)
      if (storeLogo) form.append('storeLogo', storeLogo)
      if (qrisImage) form.append('qrisImage', qrisImage)

      await api.patch(`/sellers/${seller.id}`, form)
      toast.success('Toko berhasil diperbarui')
      fetchStore()
    } catch (error: any) {
      console.log(error.response?.data)
      toast.error('Gagal memperbarui toko')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Memuat...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Toko Saya</h1>
        <p className="mt-2 text-gray-500">Kelola informasi toko Anda.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <form onSubmit={updateStore} className="grid gap-6">

          {/* Status Toko — toggle paling atas supaya mudah diakses */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
            <div>
              <p className="font-semibold text-gray-900">Status Toko</p>
              <p className="text-sm text-gray-500">
                {formData.isOpen ? 'Toko sedang buka' : 'Toko sedang tutup'}
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => toggleStoreStatus(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-7 w-12 rounded-full bg-gray-200 transition peer-checked:bg-orange-500 after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Kolom kiri */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nama Toko
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Masukkan nama toko"
                  className="h-12 w-full rounded-2xl border px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nama Pemilik
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Masukkan nama pemilik"
                  className="h-12 w-full rounded-2xl border px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Contoh: 08123456789"
                  className="h-12 w-full rounded-2xl border px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    name="closeTime"
                    value={formData.closeTime}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            {/* Kolom kanan */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Alamat
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat toko"
                  className="min-h-[120px] w-full rounded-2xl border p-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ceritakan tentang toko Anda"
                  className="min-h-[120px] w-full rounded-2xl border p-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {/* Upload gambar */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Logo Toko
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition hover:border-orange-300 hover:bg-orange-50">
                <span className="text-sm font-semibold text-gray-500">
                  {storeLogo ? storeLogo.name : 'Klik untuk unggah logo'}
                </span>
                <span className="mt-1 text-xs text-gray-400">PNG, JPG hingga 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setStoreLogo(e.target.files?.[0] || null)}
                />
              </label>

              {seller?.storeLogo && (
                <img
                  src={seller.storeLogo}
                  alt="Logo Toko"
                  className="mt-4 h-32 w-32 rounded-3xl object-cover shadow-sm"
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Gambar QRIS
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition hover:border-orange-300 hover:bg-orange-50">
                <span className="text-sm font-semibold text-gray-500">
                  {qrisImage ? qrisImage.name : 'Klik untuk unggah QRIS'}
                </span>
                <span className="mt-1 text-xs text-gray-400">PNG, JPG hingga 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setQrisImage(e.target.files?.[0] || null)}
                />
              </label>

              {seller?.qrisImage && (
                <img
                  src={seller.qrisImage}
                  alt="QRIS"
                  className="mt-4 h-52 w-52 rounded-3xl object-cover shadow-sm"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="h-12 rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  )
}