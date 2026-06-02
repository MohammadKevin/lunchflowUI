'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response = await api.post('/auth/login', formData)
      const data = response.data

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      document.cookie = `accessToken=${data.accessToken}; path=/`

      toast.success('Login berhasil')

      switch (data.user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin')
          break
        case 'SELLER':
          router.push('/dashboard/seller')
          break
        case 'CUSTOMER':
          router.push('/dashboard/customer')
          break
        default:
          router.push('/')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-white">
      {/* Tombol Kembali - Ditempatkan mengambang dengan glassmorphism */}
      <button
        onClick={() => router.push('/')}
        className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali</span>
      </button>

      {/* SISI KIRI: Branding Visual (Hanya muncul di layar desktop/md ke atas) */}
      <section className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-12 text-white md:flex lg:p-16">
        {/* Dekorasi Ornamen Latar Belakang */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-70" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-yellow-400/20 blur-3xl" />
        
        {/* Logo / Brand Name */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider">LunchFlow</span>
        </div>

        {/* Kalimat Marketing / Copywriting */}
        <div className="relative z-10 my-auto max-w-lg space-y-4">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
            Sajian Lezat, <br />
            Dipesan Lebih Cepat.
          </h2>
          <p className="text-lg text-orange-50/90 leading-relaxed">
            Kelola, pesan, dan nikmati makan siang Anda tanpa ribet. Platform terbaik untuk menghubungkan penjual makanan dan pelanggan kelaparan!
          </p>
        </div>

        {/* Footer Sisi Kiri */}
        <div className="relative z-10 text-xs text-orange-100/70">
          &copy; {new Date().getFullYear()} LunchFlow. All rights reserved.
        </div>
      </section>

      {/* SISI KANAN: Form Login Container */}
      <section className="flex w-full items-center justify-center p-6 sm:p-12 md:w-1/2 lg:p-16 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Form */}
          <div className="space-y-2">
            {/* Logo kecil untuk mobile (sembunyi di desktop) */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white md:hidden mb-6 shadow-lg shadow-orange-500/30">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Selamat Datang
            </h1>
            <p className="text-sm font-medium text-gray-500 sm:text-base">
              Silakan masuk untuk melanjutkan ke <span className="text-orange-600 font-semibold">LunchFlow</span>
            </p>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              
              {/* Input Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                />
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-800">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 hover:border-gray-300"
                  />

                  {/* Tombol Show/Hide Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-orange-600 hover:shadow-orange-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  {/* Simple Spinner */}
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memproses...</span>
                </div>
              ) : (
                'Masuk ke Akun'
              )}
            </button>
          </form>

          {/* Footer Form Register */}
          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-bold text-orange-600 transition-colors hover:text-orange-700 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}