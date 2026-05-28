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

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] =
    useState(false)

  const [isLoading, setIsLoading] =
    useState(false)

  const [selectedRole, setSelectedRole] =
    useState<
      'CUSTOMER' | 'SELLER'
    >('CUSTOMER')

  const [formData, setFormData] =
    useState({
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
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

      const endpoint =
        selectedRole ===
        'SELLER'
          ? '/auth/register/seller'
          : '/auth/register/customer'

      const payload =
        selectedRole ===
        'SELLER'
          ? {
              fullName:
                formData.fullName,
              email:
                formData.email,
              password:
                formData.password,
              phone:
                formData.phone,
              storeName:
                formData.storeName,
              ownerName:
                formData.ownerName,
              address:
                formData.address,
              description:
                formData.description,
              openTime:
                formData.openTime,
              closeTime:
                formData.closeTime,
            }
          : {
              fullName:
                formData.fullName,
              email:
                formData.email,
              password:
                formData.password,
              phone:
                formData.phone,
            }

      await api.post(
        endpoint,
        payload,
      )

      toast.success(
        `Berhasil daftar sebagai ${selectedRole}`,
      )

      router.push('/login')
    } catch (error: any) {
      console.log(error)

      toast.error(
        error?.response?.data
          ?.message ||
          error?.message ||
          'Register gagal',
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

      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Daftar Akun
          </h1>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            Pilih jenis akun yang ingin dibuat
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setSelectedRole(
                'CUSTOMER',
              )
            }
            className={`h-12 rounded-2xl text-sm font-semibold transition ${
              selectedRole ===
              'CUSTOMER'
                ? 'bg-orange-500 text-white'
                : 'border border-gray-200 bg-white text-gray-700'
            }`}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedRole(
                'SELLER',
              )
            }
            className={`h-12 rounded-2xl text-sm font-semibold transition ${
              selectedRole ===
              'SELLER'
                ? 'bg-orange-500 text-white'
                : 'border border-gray-200 bg-white text-gray-700'
            }`}
          >
            Seller
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>

              <input
                type="text"
                name="fullName"
                value={
                  formData.fullName
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Masukkan nama lengkap"
                className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Masukkan email"
                className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nomor Telepon
              </label>

              <input
                type="text"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                required={
                  selectedRole ===
                  'SELLER'
                }
                placeholder="Masukkan nomor telepon"
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
          </div>

          {selectedRole ===
            'SELLER' && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nama Toko
                  </label>

                  <input
                    type="text"
                    name="storeName"
                    value={
                      formData.storeName
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Masukkan nama toko"
                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nama Owner
                  </label>

                  <input
                    type="text"
                    name="ownerName"
                    value={
                      formData.ownerName
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Masukkan nama owner"
                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alamat
                </label>

                <textarea
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Masukkan alamat toko"
                  className="min-h-[100px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Deskripsi toko"
                  className="min-h-[100px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jam Buka
                  </label>

                  <input
                    type="time"
                    name="openTime"
                    value={
                      formData.openTime
                    }
                    onChange={
                      handleChange
                    }
                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jam Tutup
                  </label>

                  <input
                    type="time"
                    name="closeTime"
                    value={
                      formData.closeTime
                    }
                    onChange={
                      handleChange
                    }
                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-2xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? 'Loading...'
              : `Daftar sebagai ${selectedRole}`}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="font-semibold text-orange-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}