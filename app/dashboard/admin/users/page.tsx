'use client'

import { useEffect, useState } from 'react'

import { api } from '@/lib/api'

type User = {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<
    User[]
  >([])

  const [isLoading, setIsLoading] =
    useState(true)

  const fetchUsers = async () => {
    try {
      const response =
        await api.get('/users')

      setUsers(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading users...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Users
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all LunchFlow
            users.
          </p>
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
                  Email
                </th>

                <th className="px-6 py-4">
                  Phone
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-none"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.fullName}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.phone}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-500">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}