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

  // 各フィールドのエラー（ARIA用）
  const nameInvalid = submitted && (tenantName.trim().length < 2 || tenantName.trim().length > 80);
  const emailInvalid = submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
  const pwMismatch = submitted && password !== password2;
  const pwWeak = submitted && pwScore < 4;
  const agreeInvalid = submitted && !agree;

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
      setSubmitted(false);
    } catch (err: any) {
      setError(err.message || "通信に失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gray-50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">テナント登録</h1>
        <p className="text-sm text-gray-600 mb-5">
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
          <div
            className="rounded-lg border border-amber-200 bg-amber-50 p-3 mb-4 text-amber-800 text-sm leading-relaxed"
            role="alert"
            aria-live="assertive"
          >
            <ul className="list-disc pl-5 space-y-1">
              {fieldErrors.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="tenantName" className="block text-sm font-medium mb-2">
              会社名（テナント名）
            </label>
            <input
              id="tenantName"
              type="text"
              className="w-full rounded-xl border px-3 py-3 text-base outline-none focus:ring-4 focus:ring-blue-200"
              placeholder="例）山田商事"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              autoComplete="organization"
              aria-invalid={nameInvalid}
              aria-describedby={nameInvalid ? "tenantName-help" : undefined}
            />
            <p id="tenantName-help" className="sr-only">
              会社名は2〜80文字で入力してください。
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              メールアドレス（管理者）
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border px-3 py-3 text-base outline-none focus:ring-4 focus:ring-blue-200"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
              aria-invalid={emailInvalid}
              aria-describedby={emailInvalid ? "email-help" : undefined}
            />
            <p id="email-help" className="sr-only">
              メールアドレスの形式が正しくありません。
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                className="w-full rounded-xl border px-3 py-3 pr-28 text-base outline-none focus:ring-4 focus:ring-blue-200"
                placeholder="12文字以上、英大小・数字・記号"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                aria-invalid={pwWeak}
                aria-describedby={pwWeak ? "password-help" : "password-meter"}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm h-9 px-3 flex items-center text-blue-700 hover:underline"
                aria-pressed={showPw}
                aria-label={showPw ? "パスワードを隠す" : "パスワードを表示"}
              >
                {showPw ? "隠す" : "表示"}
              </button>
            </div>
            {password.length > 0 && (
              <div
                id="password-meter"
                className="mt-2 flex items-center gap-2 text-xs text-gray-600"
              >
                <div className="flex-1 h-2 rounded bg-gray-200" aria-hidden>
                  <div
                    className="h-2 rounded"
                    style={{ width: `${(pwScore / 5) * 100}%`, background: "#60a5fa" }}
                  />
                </div>
                <span>{strengthLabel[pwScore]}</span>
              </div>
            )}
            <p id="password-help" className="sr-only">
              パスワードは12文字以上で、英大文字・小文字・数字・記号を含めてください。
            </p>
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-medium mb-2">
              パスワード（確認）
            </label>
            <input
              id="password2"
              type={showPw ? "text" : "password"}
              className="w-full rounded-xl border px-3 py-3 text-base outline-none focus:ring-4 focus:ring-blue-200"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
              aria-invalid={pwMismatch}
              aria-describedby={pwMismatch ? "password2-help" : undefined}
            />
            <p id="password2-help" className="sr-only">
              パスワード（確認）が一致しません。
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="agree"
              type="checkbox"
              className="mt-0.5 w-5 h-5"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
              aria-invalid={agreeInvalid}
              aria-describedby={agreeInvalid ? "agree-help" : undefined}
            />
            <label htmlFor="agree" className="text-sm text-gray-700 select-none">
              <span className="font-medium">利用規約</span>に同意します。
            </label>
            <p id="agree-help" className="sr-only">
              利用規約に同意してください。
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || fieldErrors.length > 0}
            className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            {loading ? "送信中…" : "テナントを作成する"}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 break-all">
          API: {API_BASE_URL}/public/tenants/signup
        </div>

        <div className="mt-2 text-sm">
          既にアカウントをお持ちですか?{" "}
          <Link className="text-blue-700 underline" href="/login">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
