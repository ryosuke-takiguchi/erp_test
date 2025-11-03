// TenantSignupStatic.tsx
"use client";
import React from "react";

export default function TenantSignupSendStatic() {
  return (
    <main>
        <h1>ImpCode NW</h1>
        <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
            <h2 className="text-center">テナント仮登録完了</h2>
            <br />
            <p>ご登録ありがとうございます。仮登録が完了しました。</p>
            <p>入力いただいたメールアドレス宛に、本登録用のURLを送信しました。</p>
            <p>メールに記載されたURLから本登録を完了してください。</p>
            <br />
            <a href="/login" className="text-orange-600 hover:underline">ログイン画面へ</a>
        </div>
    </main>
  );
}
