'use client'

import Link from 'next/link'
import { ShoppingBag, MessageCircle, X, ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const features = [
  'QRIS Payment',
  'Smart Queue',
  'Pickup & Delivery',
  'WhatsApp Notification',
]

// SVG inline untuk brand icons (lucide-react v1 sudah hapus brand icons)
const IconInstagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const IconWhatsApp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)

const IconXTwitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const socials = [
  { Icon: IconInstagram, href: '#', label: 'Instagram' },
  { Icon: IconWhatsApp, href: '#', label: 'WhatsApp' },
  { Icon: IconXTwitter, href: '#', label: 'X (Twitter)' },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0A0A0A] text-white">

      {/* Decorative grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top glow accent */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

      {/* CTA Banner */}
      <div className="relative border-b border-white/[0.06]">
        <div className="container mx-auto px-6 py-14 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-orange-500">
                Ready to modernize?
              </p>
              <h2 className="text-4xl font-black leading-[1.1] tracking-tight md:text-5xl">
                Start serving smarter
                <br />
                <span className="text-white/20">with LunchFlow.</span>
              </h2>
            </div>
            <a
              href="mailto:lunchflow@gmail.com"
              className="group flex items-center gap-3 rounded-2xl bg-orange-500 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-400 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">

          {/* Brand column */}
          <div className="md:col-span-4">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                LunchFlow
              </span>
            </Link>

            <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/40">
              Smart canteen ordering platform with QRIS, smart queue,
              pickup &amp; delivery, and WhatsApp notifications — built
              for modern Indonesian schools and offices.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/40 transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:col-span-1 md:block" />

          {/* Navigation */}
          <div className="md:col-span-2">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Navigation
            </p>
            <ul className="space-y-3">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-orange-500 transition-all duration-200 group-hover:w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Features
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="h-1 w-1 rounded-full bg-orange-500/60" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Contact
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:lunchflow@gmail.com"
                  className="flex items-start gap-3 text-sm text-white/50 transition-colors duration-200 hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-500/70" />
                  lunchflow@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+6281234567890"
                  className="flex items-start gap-3 text-sm text-white/50 transition-colors duration-200 hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange-500/70" />
                  +62 812 3456 7890
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/50">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500/70" />
                Indonesia Digital Canteen Platform
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-5 md:flex-row md:px-10">
          <p className="font-mono text-[11px] text-white/20">
            © 2026 LunchFlow. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-white/20">
            Built for modern digital canteens 🚀
          </p>
        </div>
      </div>
    </footer>
  )
}
