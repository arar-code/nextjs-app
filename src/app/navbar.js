"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsAdmin(userEmail === "admin@admin.com");
    setIsLoggedIn(!!localStorage.getItem("isLoggedIn"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <ul className="flex gap-8">
          {isAdmin && (
            <li>
              <Link
                href="/users"
                className="text-white text-lg font-semibold hover:text-gray-200 transition-colors"
              >
                Users
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/posts"
              className="text-white text-lg font-semibold hover:text-gray-200 transition-colors"
            >
              Posts
            </Link>
          </li>
        </ul>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-white text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
