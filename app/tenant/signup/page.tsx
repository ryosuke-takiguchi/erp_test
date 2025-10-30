"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

// ✅ APIのベースURLは環境変数から取得（例: .env.local に NEXT_PUBLIC_API_BASE_URL）
// 例: NEXT_PUBLIC_API_BASE_URL=http://192.168.1.101:8080
const API_BASE_URL =
  (process as any)?.env?.NEXT_PUBLIC_API_BASE_URL ||
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  "http://localhost:8080";

function scorePassword(pw: string) {
  let s = 0;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-5
}

const strengthLabel = [
  "とても弱い",
  "弱い",
  "普通",
  "やや強い",
  "強い",
  "とても強い",
];

export default function TenantSignupPage() {
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const pwScore = useMemo(() => scorePassword(password), [password]);

  const fieldErrors = useMemo(() => {
    const e: string[] = [];
    const nameTrim = tenantName.trim();
    if (nameTrim.length < 2 || nameTrim.length > 80) {
      e.push("会社名は2〜80文字で入力してください。");
    }
    const mail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      e.push("メールアドレスの形式が正しくありません。");
    }
    if (password !== password2) {
      e.push("パスワード（確認）が一致しません。");
    }
    if (scorePassword(password) < 4) {
      e.push("パスワードは12文字以上で、英大/小・数字・記号を含めてください。");
    }
    if (!agree) {
      e.push("利用規約に同意してください。");
    }
    return e;
  }, [tenantName, email, password, password2, agree]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitted(true);
    if (fieldErrors.length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/public/tenants/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_name: tenantName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          agree_terms: agree,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message ||
            "サインアップに失敗しました。時間をおいて再度お試しください。"
        );
      }

      setSuccessMsg(
        data?.message ||
          "確認メールを送信しました。メール内のリンクから有効化してください。"
      );
      setTenantName("");
      setEmail("");
      setPassword("");
      setPassword2("");
      setAgree(false);
    } catch (err: any) {
      setError(err.message || "通信に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-1">テナント登録</h1>
        <p className="text-sm text-gray-600 mb-6">
          会社の管理者アカウントを作成します。確認メールが送られます。
        </p>

        {successMsg ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-green-200 bg-green-50 p-4 mb-4 text-green-800"
          >
            {successMsg}
            <div className="mt-2 text-sm">
              <Link href="/login" className="underline text-green-700">
                ログインページへ移動
              </Link>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4 text-red-800"
          >
            {error}
          </div>
        ) : null}

        {submitted && fieldErrors.length > 0 && !successMsg ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 mb-4 text-amber-800 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              {fieldErrors.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="tenantName" className="block text-sm font-medium mb-1">
              会社名（テナント名）
            </label>
            <input
              id="tenantName"
              type="text"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="例）山田商事"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              autoComplete="organization"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              メールアドレス（管理者）
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                className="w-full rounded-lg border px-3 py-2 pr-24 outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="12文字以上、英大小・数字・記号"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-700 hover:underline"
                aria-pressed={showPw}
                aria-label={showPw ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPw ? "隠す" : "表示"}
              </button>
            </div>
            {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <div className="flex-1 h-1 rounded bg-gray-200" aria-hidden>
                <div
                  className="h-1 rounded"
                  style={{ width: `${(pwScore / 5) * 100}%`, background: "#60a5fa" }}
                />
              </div>
              <span>{strengthLabel[pwScore]}</span>
            </div>
          )}
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-medium mb-1">
              パスワード（確認）
            </label>
            <input
              id="password2"
              type={showPw ? "text" : "password"}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              className="mt-1"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <label htmlFor="agree" className="text-sm text-gray-700 select-none">
              <span className="font-medium">利用規約</span>に同意します。
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || fieldErrors.length > 0}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            {loading ? "送信中…" : "テナントを作成する"}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500">
          API: {API_BASE_URL}/public/tenants/signup
        </div>

        <div className="mt-2 text-sm">
          既にアカウントをお持ちですか？{" "}
          <Link className="text-blue-700 underline" href="/login">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
