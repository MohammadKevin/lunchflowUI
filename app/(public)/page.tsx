import Link from 'next/link'

import {
  Bell,
  CreditCard,
  ShoppingBag,
  Truck,
} from 'lucide-react'

export default function HomePage() {
  return (
    <main>
      <section
        id="home"
        className="bg-gradient-to-b from-orange-50 to-white pt-32"
      >
        <div className="container mx-auto grid items-center gap-12 px-4 pb-20 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-500">
              Smart Canteen Platform
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight text-gray-900">
              Smart Canteen Ordering
              Made Simple
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              LunchFlow membantu
              kantin menjadi lebih
              modern dengan QRIS,
              smart queue, pickup &
              delivery, dan WhatsApp
              notification.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Get Started
              </Link>

              <Link
                href="#features"
                className="rounded-2xl border px-6 py-3 text-center font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
              >
                Explore Features
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="rounded-3xl bg-orange-500 p-6 text-white">
              <p className="text-sm text-white/80">
                Current Queue
              </p>

              <h2 className="mt-3 text-5xl font-black">
                A-21
              </h2>

              <div className="mt-6 rounded-2xl bg-white/20 p-4">
                <p className="text-sm text-white/80">
                  Estimated Wait
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  10 Minutes
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-5">
                <CreditCard className="h-10 w-10 text-orange-500" />

                <h3 className="mt-4 font-bold">
                  QRIS Payment
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Fast digital payment
                  for easier
                  transactions.
                </p>
              </div>

              <div className="rounded-2xl border p-5">
                <Bell className="h-10 w-10 text-orange-500" />

                <h3 className="mt-4 font-bold">
                  Notifications
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Get realtime updates
                  directly to WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-500">
              Features
            </span>

            <h2 className="mt-6 text-4xl font-black text-gray-900">
              Everything You Need
            </h2>

            <p className="mt-4 text-gray-600">
              Built for modern digital
              canteens.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <ShoppingBag className="h-12 w-12 text-orange-500" />

              <h3 className="mt-5 text-xl font-bold">
                Easy Ordering
              </h3>

              <p className="mt-3 text-gray-500">
                Order food quickly and
                easily.
              </p>
            </div>

            <div className="rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <CreditCard className="h-12 w-12 text-orange-500" />

              <h3 className="mt-5 text-xl font-bold">
                QRIS Payment
              </h3>

              <p className="mt-3 text-gray-500">
                Support QRIS and cash
                payments.
              </p>
            </div>

            <div className="rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <Truck className="h-12 w-12 text-orange-500" />

              <h3 className="mt-5 text-xl font-bold">
                Delivery
              </h3>

              <p className="mt-3 text-gray-500">
                Food can be delivered
                directly.
              </p>
            </div>

            <div className="rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <Bell className="h-12 w-12 text-orange-500" />

              <h3 className="mt-5 text-xl font-bold">
                Notifications
              </h3>

              <p className="mt-3 text-gray-500">
                Get order updates in
                realtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="bg-orange-50 py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-500">
            About LunchFlow
          </span>

          <h2 className="mt-6 text-4xl font-black text-gray-900">
            Modernize Your Canteen
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
            LunchFlow membantu
            sekolah dan kantin
            memiliki sistem pemesanan
            makanan yang lebih cepat,
            modern, dan efisien tanpa
            antre panjang.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] bg-orange-500 px-8 py-16 text-center text-white">
            <h2 className="text-4xl font-black">
              Ready To Use LunchFlow?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
              Create a smarter and
              faster canteen
              experience today.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-orange-500"
              >
                Start Now
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white px-6 py-3 font-semibold text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}