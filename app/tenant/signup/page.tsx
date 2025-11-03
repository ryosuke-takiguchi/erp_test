// TenantSignupStatic.tsx
"use client";
import React, { useRef, useState } from "react";

type FormValues = {
  tenantname: string;
  tenantid: string;
  email: string;
  password: string;
  passwordConfirm: string;
  tos: boolean;
};

function validate(values: FormValues) {
  const errs: Record<string, string> = {};

  // テナント名称：2〜80
  if (values.tenantname.trim().length < 2 || values.tenantname.trim().length > 80) {
    errs.tenantname = "テナント名称は2〜80文字で入力してください。";
  }

  // テナントID：英数字のみ（※必要なら長さや小文字限定などを追加）
  if (!/^[a-zA-Z0-9]+$/.test(values.tenantid)) {
    errs.tenantid = "テナントIDは英数字のみで入力してください。";
  }

  // メール形式
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errs.email = "有効なメールアドレスを入力してください。";
  }

  // パスワード：8+ / 大小数字記号
  const pw = values.password;
  let typeCount = 0;
  if (/[a-z]/.test(pw)) typeCount++;
  if (/[A-Z]/.test(pw)) typeCount++;
  if (/[0-9]/.test(pw)) typeCount++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) typeCount++;

  if (pw.length < 8 || typeCount < 2) {
   errs.password = "パスワードは8文字以上で、大文字、小文字、数字、記号のうち２種類を含めてください。";
  }

  // 確認一致
  if (values.password !== values.passwordConfirm) {
    errs.passwordConfirm = "パスワード（確認）が一致しません。";
  }

  // 規約
  if (!values.tos) {
    errs.tos = "利用規約に同意してください。";
  }

  return errs;
}

export default function TenantSignupStatic() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values: FormValues = {
      tenantname: String(form.get("tenantname") || ""),
      tenantid: String(form.get("tenantid") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      passwordConfirm: String(form.get("passwordConfirm") || ""),
      tos: form.get("tos") === "on",
    };

    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // 先頭エラーにフォーカス
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(firstKey);
      if (el) el.focus();
      // 要約にもフォーカス（スクリーンリーダー向け）
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      // バックエンド契約に合わせてキー名を変換（例）
      const payload = {
        tenantId: values.tenantid,
        tenantName: values.tenantname,
        adminEmail: values.email,
        password: values.password,
        tosAgreed: values.tos,
      };

      const res = await fetch("/api/tenants/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.location.href = "/tenant/signup/sent";
      } else {
        const text = await res.text().catch(() => "");
        alert(text || "送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch {
      alert("ネットワークエラーが発生しました。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>ImpCode NW </h1>

      <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">テナント新規登録</h2>
        <p className="text-sm text-gray-600">新規テナント及び管理者アカウントを作成します。</p>

        {/* エラー要約（必要時のみ） */}
        {Object.keys(errors).length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            aria-live="assertive"
            className="mt-4 mb-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            入力に誤りがあります。各項目をご確認ください。
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5 mt-4">
          {/* テナント名称 */}
          <div>
            <label htmlFor="tenantname" className="block text-sm font-medium text-gray-900">
              テナント名称 <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              id="tenantname"
              name="tenantname"
              placeholder="2〜80文字 例）株式会社インプコード"
              required
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.tenantname ? "border-red-400" : "border-gray-300 focus:border-orange-300"
              }`}
            />
            {errors.tenantname && <p className="mt-1 text-xs text-red-700">{errors.tenantname}</p>}
          </div>

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
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.tenantid ? "border-red-400" : "border-gray-300 focus:border-orange-300"
              }`}
            />
            {errors.tenantid && <p className="mt-1 text-xs text-red-700">{errors.tenantid}</p>}
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
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.email ? "border-red-400" : "border-gray-300 focus:border-orange-300"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
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
              placeholder="8文字以上。大/小/数字/記号を含む"
              required
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.password ? "border-red-400" : "border-gray-300 focus:border-orange-300"
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-700">{errors.password}</p>}
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
              className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.passwordConfirm ? "border-red-400" : "border-gray-300 focus:border-orange-300"
              }`}
            />
            {errors.passwordConfirm && <p className="mt-1 text-xs text-red-700">{errors.passwordConfirm}</p>}
          </div>

          {/* 利用規約 */}
          <div className="pt-1">
            <label className="flex items-start gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                name="tos"
                id="tos"
                required
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span>
                利用規約に同意します（
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline decoration-orange-400 underline-offset-2 hover:text-orange-700">
                  利用規約ページ
                </a>
                ）
              </span>
            </label>
            {errors.tos && <p className="mt-1 text-xs text-red-700">{errors.tos}</p>}
          </div>

          {/* 登録ボタン */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={busy}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                busy ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {busy ? "送信中…" : "登録する"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{" "}
          <a href="/login" className="font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800">
            ログイン
          </a>
        </p>
      </div>
    </main>
  );
}
