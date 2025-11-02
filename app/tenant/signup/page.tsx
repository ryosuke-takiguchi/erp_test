// TenantSignupStatic.tsx
"use client";
import React from "react";

export default function TenantSignupStatic() {
  return (
    <main>
      <h1>ImpCode ERP</h1>
        <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
        <h2>テナント新規登録</h2>
        <p>会社単位での管理アカウントを作成します。</p>

        <form action="/public/tenants/signup" method="post" className="space-y-5">
          {/* 会社名 */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-900">
              会社名 <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="株式会社インプコード"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300"
            />
            <small className="mt-1 block text-xs text-gray-500">2〜80文字</small>
          </div>

          {/* 管理者メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              管理者メールアドレス <span className="text-orange-600">*</span>
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
              placeholder="12文字以上。大/小/数字/記号を含む"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300"
            />
          </div>

          {/* パスワード（確認） */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-900">
              パスワード（確認） <span className="text-orange-600">*</span>
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="もう一度入力"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300"
            />
          </div>

          {/* 利用規約 */}
          <div className="pt-1">
            <label className="flex items-start gap-2 text-sm text-gray-800">
              <input type="checkbox" name="tos" required className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
              <span>
                利用規約に同意します（
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline decoration-orange-400 underline-offset-2 hover:text-orange-700">
                  利用規約ページ
                </a>
                ）
              </span>
            </label>
          </div>

          {/* 登録ボタン */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              登録する
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{" "}
          <a href="/login" className="font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800">ログイン</a>
        </p>
      </div>
    </main>
  );
}
