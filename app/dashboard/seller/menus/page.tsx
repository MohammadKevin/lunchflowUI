'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Menu = {
  id: string
  name: string
  description: string
  image: string
  price: number
  stock: number
  isAvailable: boolean
  isRecommended: boolean
  preparationTime: number
  categoryId: string
  category: {
    name: string
  }
}

type Category = {
  id: string
  name: string
}

export default function SellerMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [sellerId, setSellerId] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [editImage, setEditImage] = useState<File | null>(null)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    isAvailable: true,
    isRecommended: false,
    preparationTime: '5',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const user =
        typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('user') || '{}')
          : {}

      const sellerResponse = await api.get('/sellers')

      const seller = sellerResponse.data.find(
        (item: any) => item.userId === user.id,
      )

      if (!seller) {
        return
      }

      setSellerId(seller.id)

      const menusResponse = await api.get(`/menus/seller/${seller.id}`)
      setMenus(menusResponse.data)

      const categoriesResponse = await api.get('/categories')
      setCategories(categoriesResponse.data)
    } catch (error: any) {
      console.log(error.response?.data)
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const resetForm = () => {
    setFormData({
      categoryId: '',
      name: '',
      description: '',
      price: '',
      stock: '',
      isAvailable: true,
      isRecommended: false,
      preparationTime: '5',
    })

    setImage(null)
    setEditImage(null)
    setEditingMenu(null)
  }

  const buildFormData = () => {
    const form = new FormData()
    form.append('categoryId', formData.categoryId)
    form.append('name', formData.name)
    form.append('description', formData.description)
    form.append('price', formData.price)
    form.append('stock', formData.stock)
    form.append('preparationTime', formData.preparationTime)
    form.append('isAvailable', String(formData.isAvailable))
    form.append('isRecommended', String(formData.isRecommended))
    return form
  }

  const getErrorMessage = (error: any, fallback: string) => {
    const msg = error.response?.data?.message
    return Array.isArray(msg) ? msg[0] : msg || fallback
  }

  const createMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = buildFormData()

      if (image) {
        form.append('image', image)
      }

      await api.post(`/menus/${sellerId}`, form)

      toast.success('Menu created successfully')
      resetForm()
      fetchData()
    } catch (error: any) {
      console.log(error.response?.data)
      toast.error(getErrorMessage(error, 'Failed to create menu'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (menu: Menu) => {
    setEditingMenu(menu)

    setFormData({
      categoryId: menu.categoryId,
      name: menu.name,
      description: menu.description || '',
      price: String(menu.price),
      stock: String(menu.stock),
      isAvailable: menu.isAvailable,
      isRecommended: menu.isRecommended,
      preparationTime: String(menu.preparationTime),
    })
  }

  const updateMenu = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingMenu) {
      return
    }

    setIsSubmitting(true)

    try {
      const form = buildFormData()

      if (editImage) {
        form.append('image', editImage)
      }

      await api.patch(`/menus/${editingMenu.id}`, form)

      toast.success('Menu updated successfully')
      resetForm()
      fetchData()
    } catch (error: any) {
      console.log(error.response?.data)
      toast.error(getErrorMessage(error, 'Failed to update menu'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteMenu = async (id: string) => {
    const confirmDelete = confirm('Delete this menu?')

    if (!confirmDelete) {
      return
    }

    try {
      await api.delete(`/menus/${id}`)
      toast.success('Menu deleted')
      fetchData()
    } catch (error: any) {
      console.log(error.response?.data)
      toast.error('Failed to delete menu')
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
        <h1 className="text-3xl font-black text-gray-900">Menus</h1>
        <p className="mt-2 text-gray-500">Manage your menus.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900">
          {editingMenu ? 'Edit Menu' : 'Create Menu'}
        </h2>

        <form
          onSubmit={editingMenu ? updateMenu : createMenu}
          className="mt-6 grid gap-4"
        >
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border px-4"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Menu name"
            value={formData.name}
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border px-4"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="h-12 rounded-2xl border px-4"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            min={0}
            className="h-12 rounded-2xl border px-4"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min={0}
            className="h-12 rounded-2xl border px-4"
          />

          <input
            type="number"
            name="preparationTime"
            placeholder="Preparation Time"
            value={formData.preparationTime}
            onChange={handleChange}
            min={1}
            className="h-12 rounded-2xl border px-4"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]

              if (!file) {
                return
              }

              if (editingMenu) {
                setEditImage(file)
              } else {
                setImage(file)
              }
            }}
            className="rounded-2xl border p-3"
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            <span>Available</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isRecommended"
              checked={formData.isRecommended}
              onChange={handleChange}
            />
            <span>Recommended</span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-2xl bg-orange-500 px-6 font-semibold text-white disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : editingMenu
                  ? 'Update Menu'
                  : 'Create Menu'}
            </button>

            {editingMenu && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="h-12 rounded-2xl bg-gray-200 px-6 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Menu</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id} className="border-b">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={menu.image || 'https://placehold.co/100x100'}
                        alt={menu.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />

                      <div>
                        <h3 className="font-semibold">{menu.name}</h3>
                        <p className="text-sm text-gray-500">
                          {menu.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">{menu.category?.name}</td>

                  <td className="px-6 py-4">
                    Rp {Number(menu.price).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">{menu.stock}</td>

                  <td className="px-6 py-4">
                    {menu.isAvailable ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
                        Unavailable
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(menu)}
                        className="rounded-xl bg-blue-500 px-4 py-2 text-sm text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMenu(menu.id)}
                        className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {menus.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No menus found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}