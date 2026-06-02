'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, UtensilsCrossed, Store, User } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'SELLER'>('CUSTOMER')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    ownerName: '',
    address: '',
    description: '',
    openTime: '',
    closeTime: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const endpoint =
        selectedRole === 'SELLER'
          ? '/auth/register/seller'
          : '/auth/register/customer'

      const payload =
        selectedRole === 'SELLER'
          ? {
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              storeName: formData.storeName,
              ownerName: formData.ownerName,
              address: formData.address,
              description: formData.description,
              openTime: formData.openTime,
              closeTime: formData.closeTime,
            }
          : {
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
            }

      await api.post(endpoint, payload)

      toast.success(`Berhasil daftar sebagai ${selectedRole}`)
      router.push('/login')
    } catch (error: any) {
      console.log(error)
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Register gagal',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-white">
      {/* Floating Back Button - Glassmorphism style */}
      <button
        onClick={() => router.push('/')}
        className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali</span>
      </button>

      {/* SISI KIRI: Branding Visual (Hanya muncul di desktop/md ke atas) */}
      <section className="relative hidden w-5/12 flex-col justify-between bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-12 text-white md:flex lg:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-70" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-yellow-400/20 blur-3xl" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider">LunchFlow</span>
        </div>

        {/* Copywriting */}
        <div className="relative z-10 my-auto max-w-md space-y-4">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            Bergabung <br /> Bersama Kami.
          </h2>
          <p className="text-base text-orange-50/90 leading-relaxed">
            Mulai langkah Anda di LunchFlow. Baik sebagai penikmat kuliner yang mencari kemudahan makan siang, maupun sebagai mitra merchant yang ingin mengembangkan bisnis kuliner secara digital.
          </p>
        </div>

        {/* Footer Sisi Kiri */}
        <div className="relative z-10 text-xs text-orange-100/70">
          &copy; {new Date().getFullYear()} LunchFlow. All rights reserved.
        </div>
      </section>

      {/* SISI KANAN: Form Register Area dengan Scroll Container */}
      <section className="flex w-full items-center justify-center p-6 sm:p-12 md:w-7/12 lg:p-16 bg-gray-50/50 overflow-y-auto max-h-screen pt-24 pb-12 sm:pt-24 md:pt-16">
        <div className="w-full max-w-xl space-y-8">
          
          {/* Header Form */}
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white md:hidden mb-6 shadow-lg shadow-orange-500/30">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Daftar Akun
            </h1>
            <p className="text-sm font-medium text-gray-500 sm:text-base">
              Pilih jenis akun yang ingin Anda buat hari ini
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-gray-200/60 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setSelectedRole('CUSTOMER')}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="h-4 w-4" />
              Customer
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('SELLER')}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                selectedRole === 'SELLER'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store className="h-4 w-4" />
              Seller
            </button>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* GRUP 1: Data Autentikasi Dasar */}
            <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Informasi Akun</h3>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Nomor Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={selectedRole === 'SELLER'}
                    placeholder="081234567890"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* GRUP 2: Data Spesifik Toko (Hanya dirender jika role SELLER) */}
            {selectedRole === 'SELLER' && (
              <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Detail Toko & Operasional</h3>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Nama Toko</label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      required
                      placeholder="Dapur Lezat Citra"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Nama Owner</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      placeholder="Nama pemilik usaha"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Alamat Lengkap Toko</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Jl. Hang Tuah No. 45, Kebayoran Baru..."
                    className="min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Deskripsi Singkat Toko</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Menyediakan katering makan siang sehat harian tanpa MSG..."
                    className="min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300 resize-none"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Jam Buka</label>
                    <input
                      type="time"
                      name="openTime"
                      value={formData.openTime}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Jam Tutup</label>
                    <input
                      type="time"
                      name="closeTime"
                      value={formData.closeTime}
                      onChange={handleChange}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-orange-600 hover:shadow-orange-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Mendaftarkan akun...</span>
                </div>
              ) : (
                `Daftar sebagai ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}`
              )}
            </button>
          </form>

          {/* Footer Form Navigation */}
          <p className="text-center text-sm text-gray-500">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-bold text-orange-600 transition-colors hover:text-orange-700 hover:underline"
            >
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}