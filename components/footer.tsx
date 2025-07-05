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
              <Link
                href="https://pranaygupta.in"
                target="_blank"
                prefetch
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 font-medium inline-flex items-center space-x-1 transition-colors"
              >
                <span>Pranay Gupta</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
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
              <a
                href="https://github.com/thepranaygupta/planning-poker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white font-medium inline-flex items-center space-x-1 transition-colors"
              >
                <svg width="16" height="16" fill="currentColor" className="mr-1" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
