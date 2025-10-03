import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-vault-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <img src="/vault22.png" alt="Vault22" className="h-10 w-10 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-vault-green opacity-0 group-hover:opacity-20 rounded-full transition-opacity" />
            </div>
            <span className="ml-3 text-2xl font-bold font-display text-vault-black">
              Vault22
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'text-vault-green bg-vault-green bg-opacity-10'
                  : 'text-vault-gray-700 hover:text-vault-green hover:bg-vault-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/about')
                  ? 'text-vault-green bg-vault-green bg-opacity-10'
                  : 'text-vault-gray-700 hover:text-vault-green hover:bg-vault-gray-50'
              }`}
            >
              About
            </Link>
            <Link
              href="/products"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/products')
                  ? 'text-vault-green bg-vault-green bg-opacity-10'
                  : 'text-vault-gray-700 hover:text-vault-green hover:bg-vault-gray-50'
              }`}
            >
              Products
            </Link>
            <Link
              href="/faq"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/faq')
                  ? 'text-vault-green bg-vault-green bg-opacity-10'
                  : 'text-vault-gray-700 hover:text-vault-green hover:bg-vault-gray-50'
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/contact')
                  ? 'text-vault-green bg-vault-green bg-opacity-10'
                  : 'text-vault-gray-700 hover:text-vault-green hover:bg-vault-gray-50'
              }`}
            >
              Contact
            </Link>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="ml-4 px-6 py-2.5 bg-vault-green text-vault-black rounded-full font-semibold hover:bg-vault-green-light transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg text-vault-gray-700 hover:bg-vault-gray-50">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
