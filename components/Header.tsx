"use client"; // ← ユーザー操作や状態を持つ可能性がある場合に記載
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-blue-600 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">
          <Link href="/">IMPCODE ERP</Link>
        </h1>
        <nav className="space-x-6 text-sm">
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
