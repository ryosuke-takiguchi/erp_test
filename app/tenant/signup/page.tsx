"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";
import Checkbox from "@/components/Checkbox/Checkbox";
import Alert from "@/components/Alert/Alert";
import styles from "./Signup.module.scss";

const API_BASE_URL =
  (process as any)?.env?.NEXT_PUBLIC_API_BASE_URL ||
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  "http://localhost:8080";

export default function SignupPage() {
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!tenantName || !email || !password || password !== password2 || !agree) {
      setError("入力内容を確認してください。");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/public/tenants/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_name: tenantName, email, password, agree_terms: agree }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "サインアップに失敗しました。");

      setSuccess("確認メールを送信しました。メール内のリンクから有効化してください。");
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
    <main className={styles.surface}>
      <div className={styles.frame}>
        <h1 className={styles.title}>テナント登録</h1>
        <p className={styles.subtitle}>
          会社の管理者アカウントを作成します。確認メールが送られます。
        </p>

        {success && <Alert type="success">{success}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            id="tenantName"
            label="会社名（テナント名）"
            placeholder="例）山田商事"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
          />
          <TextField
            id="email"
            label="メールアドレス"
            placeholder="admin@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            id="password2"
            label="パスワード（確認）"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <Checkbox
            id="agree"
            label="利用規約に同意します。"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <Button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "送信中…" : "テナントを作成する"}
          </Button>
        </form>

        <p className={styles.footer}>
          既にアカウントをお持ちですか？{" "}
          <Link href="/login" className={styles.link}>
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
}
