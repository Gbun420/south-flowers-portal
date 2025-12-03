"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MemberLoginPage() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Mock login – navigate to member area
    router.push("/member");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl rounded-3xl bg-white/80 shadow-xl ring-1 ring-rose-100 backdrop-blur-sm grid grid-cols-1 md:grid-cols-[1.2fr_1fr] overflow-hidden">
        {/* Left hero */}
        <div className="relative p-10 md:p-14 flex flex-col justify-between bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 text-rose-50">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-100 mb-4">
              South Flowers Members
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
              A softer experience for your
              <span className="block font-bold">most important guests.</span>
            </h1>
            <p className="text-sm md:text-base text-rose-100/90 max-w-md">
              Manage recurring bouquets, private arrangements and priority support
              from a single, calm space made just for members.
            </p>
          </div>

          <div className="mt-10 md:mt-0 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-rose-100/10 border border-rose-100/20 flex items-center justify-center">
                <span className="text-lg">✿</span>
              </div>
              <div>
                <p className="text-sm font-medium">Seasonal standing orders</p>
                <p className="text-xs text-rose-100/80">
                  Lock-in designs for lobbies, villas and private residences.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-rose-100/10 border border-rose-100/20 flex items-center justify-center">
                <span className="text-lg">✦</span>
              </div>
              <div>
                <p className="text-sm font-medium">Member-only collections</p>
                <p className="text-xs text-rose-100/80">
                  Access palettes and stems reserved for South Flowers partners.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-rose-100/10 border border-rose-100/20 flex items-center justify-center">
                <span className="text-lg">☾</span>
              </div>
              <div>
                <p className="text-sm font-medium">Dedicated support</p>
                <p className="text-xs text-rose-100/80">
                  Direct line to our team for last‑minute changes and events.
                </p>
              </div>
            </div>
          </div>

          {/* Abstract petals */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-pink-300/30 blur-3xl" />
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-purple-400/25 blur-3xl" />
          </div>
        </div>

        {/* Right login card */}
        <div className="p-8 md:p-10 bg-white/90 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-rose-400 mb-3">
              MEMBER ACCESS
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-500">
              Use your South Flowers member credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:border-rose-300"
                placeholder="member@southflowers.mt"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:border-rose-300"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-gray-300 text-rose-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
                />
                <span>Keep me signed in on this device</span>
              </label>
              <button
                type="button"
                className="text-rose-500 hover:text-rose-600 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-1 focus-visible:ring-offset-rose-50"
            >
              Continue
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500 space-y-1.5">
            <p className="font-medium text-gray-700">Demo access</p>
            <p>
              Member: <span className="font-mono">member@southflowers.mt</span>
              <span className="mx-1">/</span>
              <span className="font-mono">MemberDemo!2024</span>
            </p>
            <p>
              Admin: <span className="font-mono">admin@southflowers.mt</span>
              <span className="mx-1">/</span>
              <span className="font-mono">AdminDemo!2024</span>
            </p>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            New to South Flowers?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-rose-500 hover:text-rose-600"
            >
              Request member access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
