'use client'

import { useEffect, useState } from 'react'

import {
  Bell,
  Check,
  Clock3,
  Trash2,
} from 'lucide-react'

import { toast } from 'sonner'

import { api } from '@/lib/api'

type Notification = {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications =
    async () => {
      try {
        const response =
          await api.get(
            '/notifications',
          )

        setNotifications(
          response.data,
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to fetch notifications',
        )
      } finally {
        setLoading(false)
      }
    }

  const markAsRead =
    async (id: string) => {
      try {
        await api.patch(
          `/notifications/${id}/read`,
        )

        setNotifications(
          (prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isRead: true,
                  }
                : item,
            ),
        )

        toast.success(
          'Notification marked as read',
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to update notification',
        )
      }
    }

  const deleteNotification =
    async (id: string) => {
      try {
        await api.delete(
          `/notifications/${id}`,
        )

        setNotifications(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== id,
            ),
        )

        toast.success(
          'Notification deleted',
        )
      } catch (error) {
        console.log(error)

        toast.error(
          'Failed to delete notification',
        )
      }
    }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900">
            Notifications
          </h1>

          <p className="mt-2 text-gray-500">
            Stay updated with your orders
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-500">
          <Bell className="h-8 w-8" />
        </div>
      </div>

      {notifications.length ===
      0 ? (
        <div className="rounded-[32px] bg-white py-24 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <Bell className="h-12 w-12" />
          </div>

          <h2 className="mt-6 text-3xl font-black text-gray-900">
            No Notifications
          </h2>

          <p className="mt-3 text-gray-500">
            You don't have any notifications yet
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {notifications.map(
            (
              notification,
            ) => (
              <div
                key={
                  notification.id
                }
                className={`rounded-[32px] border p-6 shadow-sm transition ${
                  notification.isRead
                    ? 'border-gray-200 bg-white'
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-5">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl ${
                        notification.isRead
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      <Bell className="h-7 w-7" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black text-gray-900">
                          {
                            notification.title
                          }
                        </h2>

                        {!notification.isRead && (
                          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-gray-600">
                        {
                          notification.message
                        }
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                        <Clock3 className="h-4 w-4" />

                        {new Date(
                          notification.createdAt,
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          markAsRead(
                            notification.id,
                          )
                        }
                        className="flex h-12 items-center gap-2 rounded-2xl bg-green-500 px-5 font-semibold text-white transition hover:bg-green-600"
                      >
                        <Check className="h-5 w-5" />

                        Read
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteNotification(
                          notification.id,
                        )
                      }
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-500 transition hover:bg-red-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}