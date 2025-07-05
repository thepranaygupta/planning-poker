import Link from "next/link"
import { Spade, ExternalLink } from "lucide-react"

export default function Footer() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create Session" },
    { href: "/join", label: "Join Session" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">
                <Spade className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Planning Poker</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              A collaborative planning poker tool for agile teams to estimate story points and reach consensus on
              project tasks.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Built by</span>
              <a
                href="https://pranaygupta.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 font-medium inline-flex items-center space-x-1 transition-colors"
              >
                <span>Pranay Gupta</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Quick Actions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create" className="text-gray-400 hover:text-white transition-colors">
                  Start New Session
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-gray-400 hover:text-white transition-colors">
                  Join Existing Session
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Planning Poker. All rights reserved.</p>
            <div className="mt-4 sm:mt-0 flex items-center space-x-1 text-sm text-gray-400">
              <span>Created with ❤️ by</span>
              <a
                href="https://pranaygupta.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 font-medium inline-flex items-center space-x-1 transition-colors"
              >
                <span>Pranay Gupta</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
