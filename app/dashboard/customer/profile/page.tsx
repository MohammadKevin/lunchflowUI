'use client'

import { useEffect, useState } from 'react'

import {
  Camera,
  Mail,
  Phone,
  Shield,
  User,
} from 'lucide-react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Profile = {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  profileImage?: string
}

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<Profile | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [formData, setFormData] =
    useState({
      fullName: '',
      phone: '',
    })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile =
    async () => {
      try {
        const response =
          await api.get(
            '/users/me',
          )

        setProfile(
          response.data,
        )

        setFormData({
          fullName:
            response.data
              .fullName || '',

          phone:
            response.data
              .phone || '',
        })
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch profile',
        )
      } finally {
        setLoading(false)
      }
    }

  const updateProfile =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault()

      try {
        setSaving(true)

        const response =
          await api.patch(
            '/users/me',
            formData,
          )

        setProfile(
          response.data,
        )

        toast.success(
          'Profile updated successfully',
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to update profile',
        )
      } finally {
        setSaving(false)
      }
    }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Profile not found
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900">
          My Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your account
          information
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  profile.profileImage ||
                  'https://placehold.co/300x300'
                }
                alt={
                  profile.fullName
                }
                className="h-40 w-40 rounded-full object-cover"
              />

              <button className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-900">
              {
                profile.fullName
              }
            </h2>

            <div className="mt-3 flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-500">
              <Shield className="h-4 w-4" />

              {profile.role}
            </div>
          </div>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                <Mail className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <h3 className="font-semibold text-gray-900">
                  {profile.email}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                <Phone className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <h3 className="font-semibold text-gray-900">
                  {profile.phone ||
                    '-'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-500">
              <User className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Edit Profile
              </h2>

              <p className="mt-1 text-gray-500">
                Update your profile
                information
              </p>
            </div>
          </div>

          <form
            onSubmit={
              updateProfile
            }
            className="mt-10 space-y-6"
          >
            <div>
              <label className="mb-3 block font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={
                  formData.fullName
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName:
                      e.target
                        .value,
                  })
                }
                className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 outline-none transition focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-3 block font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                type="text"
                value={
                  formData.phone
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone:
                      e.target
                        .value,
                  })
                }
                className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 outline-none transition focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-orange-500 text-lg font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}