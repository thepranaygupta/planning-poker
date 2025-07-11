"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Spade } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create Session" },
    { href: "/join", label: "Join Session" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" prefetch className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">
              <Spade className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Planning Poker</span>
          </Link>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="https://www.producthunt.com/products/planning-poker-5?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-planning&#0045;poker&#0045;5"
              target="_blank">
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=988568&theme=light&t=1751742584238"
                alt="Planning Poker - Estimate Story Points, Achieve Consensus | Product Hunt"
                className="w-40 h-14"
              />
            </Link>
            <Link href="/join">
              <Button variant="outline" size="sm">
                Join Session
              </Button>
            </Link>
            <Link href="/create">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Create Session
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-200 ease-in-out overflow-hidden",
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          )}>
          <div className="py-4 space-y-2 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="my-4 flex flex-col space-y-2">
              <Link href="/join" prefetch onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Join Session
                </Button>
              </Link>
              <Link href="/create" prefetch onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                  Create Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
