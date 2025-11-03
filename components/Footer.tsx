export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-600 text-sm py-3 mt-auto border-t">
      <div className="max-w-7xl mx-auto px-4 text-center">
        © {new Date().getFullYear()} ImpCode Nexus Workspace. All rights reserved.
      </div>
    </footer>
  );
}
