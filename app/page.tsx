export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">IMPCODE ERP SYSTEM</h1>
      <p className="text-sm text-gray-600">
        クラウド型ERPシステム（開発中）へようこそ。
      </p>

      <div className="mt-6 space-x-4">
        <a
          href="/tenant/signup"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          テナント登録
        </a>
        <a
          href="/login"
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
        >
          ログイン
        </a>
      </div>
    </main>
  );
}