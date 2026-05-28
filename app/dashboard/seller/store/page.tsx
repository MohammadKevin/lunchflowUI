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
  const [seller, setSeller] =
    useState<Seller | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [storeLogo, setStoreLogo] =
    useState<File | null>(null)

  const [qrisImage, setQrisImage] =
    useState<File | null>(null)

  const [formData, setFormData] =
    useState({
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

  const fetchStore =
    async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem(
            'user',
          ) || '{}',
        )

        const response =
          await api.get('/sellers')

        const sellerData =
          response.data.find(
            (item: any) =>
              item.userId ===
              user.id,
          )

        if (!sellerData) {
          return
        }

        setSeller(sellerData)

        setFormData({
          storeName:
            sellerData.storeName ||
            '',

          ownerName:
            sellerData.ownerName ||
            '',

          phone:
            sellerData.phone ||
            '',

          address:
            sellerData.address ||
            '',

          description:
            sellerData.description ||
            '',

          openTime:
            sellerData.openTime ||
            '',

          closeTime:
            sellerData.closeTime ||
            '',

          isOpen:
            sellerData.isOpen,
        })
      } catch (error: any) {
        console.log(
          error.response?.data,
        )

        toast.error(
          'Failed to fetch store',
        )
      } finally {
        setIsLoading(false)
      }
    }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target as HTMLInputElement

    setFormData({
      ...formData,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    })
  }

  const updateStore =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault()

      if (!seller) {
        return
      }

      try {
        const form =
          new FormData()

        form.append(
          'storeName',
          formData.storeName,
        )

        form.append(
          'ownerName',
          formData.ownerName,
        )

        form.append(
          'phone',
          formData.phone,
        )

        form.append(
          'address',
          formData.address,
        )

        form.append(
          'description',
          formData.description,
        )

        form.append(
          'openTime',
          formData.openTime,
        )

        form.append(
          'closeTime',
          formData.closeTime,
        )

        form.append(
          'isOpen',
          String(
            formData.isOpen,
          ),
        )

        if (storeLogo) {
          form.append(
            'storeLogo',
            storeLogo,
          )
        }

        if (qrisImage) {
          form.append(
            'qrisImage',
            qrisImage,
          )
        }

        await api.patch(
          `/sellers/${seller.id}`,
          form,
        )

        toast.success(
          'Store updated successfully',
        )

        fetchStore()
      } catch (error: any) {
        console.log(
          error.response?.data,
        )

        toast.error(
          'Failed to update store',
        )
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
          Store
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your store information.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <form
          onSubmit={updateStore}
          className="grid gap-6"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Store Name
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
                  className="h-12 w-full rounded-2xl border px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Owner Name
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
                  className="h-12 w-full rounded-2xl border px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone
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
                  className="h-12 w-full rounded-2xl border px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Open Time
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
                  className="h-12 w-full rounded-2xl border px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Close Time
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
                  className="h-12 w-full rounded-2xl border px-4"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  className="min-h-[120px] w-full rounded-2xl border p-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  className="min-h-[120px] w-full rounded-2xl border p-4"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Store Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setStoreLogo(
                    e.target.files?.[0] ||
                      null,
                  )
                }
                className="w-full rounded-2xl border p-3"
              />

              {seller?.storeLogo && (
                <img
                  src={
                    seller.storeLogo
                  }
                  alt="Store Logo"
                  className="mt-4 h-32 w-32 rounded-3xl object-cover"
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                QRIS Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setQrisImage(
                    e.target.files?.[0] ||
                      null,
                  )
                }
                className="w-full rounded-2xl border p-3"
              />

              {seller?.qrisImage && (
                <img
                  src={
                    seller.qrisImage
                  }
                  alt="QRIS"
                  className="mt-4 h-52 w-52 rounded-3xl object-cover"
                />
              )}
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isOpen"
              checked={
                formData.isOpen
              }
              onChange={
                handleChange
              }
            />

            <span className="font-medium">
              Store Open
            </span>
          </label>

          <button
            type="submit"
            className="h-12 rounded-2xl bg-orange-500 font-semibold text-white"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}