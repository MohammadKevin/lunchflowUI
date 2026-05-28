'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Category = {
  id: string

  name: string

  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] =
    useState<Category[]>([])

  const [name, setName] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(true)

  const fetchCategories =
    async () => {
      try {
        const response =
          await api.get(
            '/categories',
          )

        setCategories(
          response.data,
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch categories',
        )
      } finally {
        setIsLoading(false)
      }
    }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory =
    async () => {
      if (!name) {
        toast.error(
          'Category name is required',
        )

        return
      }

      try {
        await api.post(
          '/categories',
          {
            name,
          },
        )

        toast.success(
          'Category created successfully',
        )

        setName('')

        fetchCategories()
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to create category',
        )
      }
    }

  const deleteCategory =
    async (id: string) => {
      const confirmDelete =
        confirm(
          'Are you sure you want to delete this category?',
        )

      if (!confirmDelete) {
        return
      }

      try {
        await api.delete(
          `/categories/${id}`,
        )

        toast.success(
          'Category deleted successfully',
        )

        fetchCategories()
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to delete category',
        )
      }
    }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading categories...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">
          Categories
        </h1>

        <p className="mt-2 text-gray-500">
          Manage menu categories.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Create Category
        </h2>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value,
              )
            }
            className="h-12 flex-1 rounded-2xl border px-4 outline-none focus:border-orange-500"
          />

          <button
            onClick={
              createCategory
            }
            className="h-12 rounded-2xl bg-orange-500 px-6 font-medium text-white transition hover:bg-orange-600"
          >
            Create
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">
                  Name
                </th>

                <th className="px-6 py-4">
                  Created At
                </th>

                <th className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map(
                (category) => (
                  <tr
                    key={
                      category.id
                    }
                    className="border-b last:border-none"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {
                        category.name
                      }
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(
                        category.createdAt,
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          deleteCategory(
                            category.id,
                          )
                        }
                        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          {categories.length ===
            0 && (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                No categories found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}