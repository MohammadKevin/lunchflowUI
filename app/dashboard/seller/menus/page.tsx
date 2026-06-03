'use client'

import { useEffect, useState, useRef } from 'react'
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

  // State untuk Fitur Search & Filter Kategori
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('')

  // Ref untuk mereset input file secara manual
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      if (!seller) return

      setSellerId(seller.id)

      const [menusResponse, categoriesResponse] = await Promise.all([
        api.get(`/menus/seller/${seller.id}`),
        api.get('/categories'),
      ])

      setMenus(menusResponse.data)
      setCategories(categoriesResponse.data)
    } catch (error: any) {
      console.error(error.response?.data)
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
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
      if (image) form.append('image', image)

      await api.post(`/menus/${sellerId}`, form)

      toast.success('Menu created successfully')
      resetForm()
      fetchData()
    } catch (error: any) {
      console.error(error.response?.data)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const updateMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMenu) return

    setIsSubmitting(true)

    try {
      const form = buildFormData()
      if (editImage) form.append('image', editImage)

      await api.patch(`/menus/${editingMenu.id}`, form)

      toast.success('Menu updated successfully')
      resetForm()
      fetchData()
    } catch (error: any) {
      console.error(error.response?.data)
      toast.error(getErrorMessage(error, 'Failed to update menu'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteMenu = async (id: string) => {
    const confirmDelete = confirm('Delete this menu?')
    if (!confirmDelete) return

    try {
      await api.delete(`/menus/${id}`)
      toast.success('Menu deleted')
      fetchData()
    } catch (error: any) {
      console.error(error.response?.data)
      toast.error('Failed to delete menu')
    }
  }

  // Logika Filter dan Search Menu (Client-side)
  const filteredMenus = menus.filter((menu) => {
    const matchesSearch =
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategoryFilter === '' || menu.categoryId === selectedCategoryFilter

    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center font-medium text-gray-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Menus</h1>
        <p className="mt-2 text-gray-500">Manage your store menus efficiently.</p>
      </div>

      {/* Form Card (Create / Edit) */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900">
          {editingMenu ? 'Edit Menu' : 'Create Menu'}
        </h2>

        <form
          onSubmit={editingMenu ? updateMenu : createMenu}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="h-12 rounded-2xl border bg-gray-50 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category *</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="name"
              placeholder="Menu name *"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-12 rounded-2xl border px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="h-12 rounded-2xl border px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="number"
              name="price"
              placeholder="Price *"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
              className="h-12 rounded-2xl border px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="number"
              name="stock"
              placeholder="Stock *"
              value={formData.stock}
              onChange={handleChange}
              required
              min={0}
              className="h-12 rounded-2xl border px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="number"
              name="preparationTime"
              placeholder="Preparation Time (Minutes)"
              value={formData.preparationTime}
              onChange={handleChange}
              min={1}
              className="h-12 rounded-2xl border px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (editingMenu) {
                  setEditImage(file)
                } else {
                  setImage(file)
                }
              }}
              className="rounded-2xl border p-[7px] text-sm bg-gray-50 focus:outline-none"
            />

            <div className="flex gap-6 h-12 items-center px-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Available</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isRecommended"
                  checked={formData.isRecommended}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Recommended</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-2xl bg-orange-500 px-6 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
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
                className="h-12 rounded-2xl bg-gray-100 px-6 font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bagian Filter, Search & Tabel */}
      <div className="space-y-4">
        {/* Toolbar Search dan Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-2xl border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="h-12 rounded-2xl border bg-white px-4 text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Menu</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMenus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={menu.image || 'https://placehold.co/100x100'}
                          alt={menu.name}
                          className="h-14 w-14 rounded-2xl object-cover border"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                          <p className="text-sm text-gray-500 max-w-xs truncate">
                            {menu.description || '-'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {menu.category?.name || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Rp {Number(menu.price).toLocaleString('id-ID')}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {menu.stock}
                    </td>

                    <td className="px-6 py-4">
                      {menu.isAvailable ? (
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200">
                          Unavailable
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(menu)}
                          className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteMenu(menu.id)}
                          className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMenus.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500 font-medium">
                No menus match your search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}