// TenantSignupStatic.tsx
"use client";
import React from "react";

export default function Login() {
  return (
    <main>
      <h1>ImpCode NW</h1>
        <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
        <h2 className="text-center">ログイン</h2>
        < br />
        <p>テナントID、メールアドレス、パスワードを入力してください。</p>
        <br />
        <form action="/api/login" method="post" className="space-y-5">
            {/* テナントID */}
            <div>
                <label htmlFor="tenantid" className="block text-sm font-medium text-gray-900">
                テナントID <span className="text-orange-600">*</span>
                </label>
                <input
                type="text"
                id="tenantid"
                name="tenantid"
                placeholder="英数字　例）impcode123"
                required
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300"
                />
            </div>
            {/* メールアドレス */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                メールアドレス <span className="text-orange-600">*</span>
                </label>
                <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@example.com"
                required
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300"
                />
            </div>
            {/* パスワード */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                パスワード <span className="text-orange-600">*</span>
                </label>
                <input
                type="password"
                id="password"
                name="password"
                placeholder="8文字以上の英数字"
                required
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300"
                />
            </div>
            {/* ログインボタン */}
            <div>
                <button
                type="submit"
                className="w-full rounded-xl bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                ログイン
                </button>
            </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          パスワードをお忘れですか？{" "}
          <a href="/forgot-password" className="font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800">パスワード再設定</a>
        </p>
      </div>
    </main>
  );
}
