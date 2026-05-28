'use client'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import { useState } from 'react'

import {
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] =
    useState(false)

  const [isLoading, setIsLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
    })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const response =
        await api.post(
          '/auth/login',
          formData,
        )

      const data = response.data

      localStorage.setItem(
        'accessToken',
        data.accessToken,
      )

      localStorage.setItem(
        'user',
        JSON.stringify(data.user),
      )

      toast.success(
        'Login berhasil',
      )

      switch (
        data.user.role
      ) {
        case 'ADMIN':
          router.push(
            '/dashboard/admin',
          )
          break

        case 'SELLER':
          router.push(
            '/dashboard/seller',
          )
          break

        case 'CUSTOMER':
          router.push(
            '/dashboard/customer',
          )
          break

        default:
          router.push('/')
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data
          ?.message ||
          'Login gagal',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-orange-50 px-4 py-6 sm:px-6 lg:px-8">
      <button
        onClick={() =>
          router.push('/')
        }
        className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition hover:text-orange-500 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />

        <span>Kembali</span>
      </button>

      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Selamat Datang
          </h1>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            Masuk untuk menggunakan
            LunchFlow
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={
                handleChange
              }
              required
              placeholder="Masukkan email"
              className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Masukkan password"
                className="h-12 w-full rounded-2xl border border-gray-200 px-4 pr-12 text-sm outline-none transition focus:border-orange-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-2xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? 'Loading...'
              : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="font-semibold text-orange-500 hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </section>
  )
}