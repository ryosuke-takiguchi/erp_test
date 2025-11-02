"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-orange-200 text-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 pt-1 pb-1 flex items-center justify-between">
        <h1 className="text-base font-bold">
          <Link href="/">IMPCODE ERP</Link>
        </h1>
        <nav className="space-x-4 text-base">
          <Link href="/tenant/signup" className="hover:underline">
            テナント登録
          </Link>
          <Link href="/login" className="hover:underline">
            ログイン
          </Link>
        </nav>
      </div>
    </header>
  );
}
