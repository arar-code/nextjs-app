'use client';

import './globals.css';
import Navbar from './navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Render Navbar only on /users and /posts pages
  const shouldRenderNavbar = pathname === '/users' || pathname === '/posts';

  // Apply padding conditionally based on the current path
  const paddingClass = pathname === '/users' || pathname === '/posts' ? 'pt-20' : '';

  return (
    <html lang="en">
      <body className={paddingClass}>
        {shouldRenderNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
