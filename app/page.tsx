import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Spade, BarChart3, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">Planning Poker</h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Help your agile team estimate story points with our interactive planning poker tool. Create sessions,
              invite team members, and reach consensus faster.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/create">
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
                    Create Session
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/join">
                  <Button variant="outline" size="lg" className="w-full bg-transparent">
                    Join Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Planning Poker?</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need for effective story point estimation</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Real-time Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Invite team members to join your session and estimate together in real-time
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Spade className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Multiple Card Sets</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from Fibonacci, T-shirt sizes, or custom card sets that fit your team's needs
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Instant Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get average and median calculations automatically when cards are revealed
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-red-600 mb-2" />
                <CardTitle>Scrum Master Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Full session control with options to reveal cards, clear estimates, and manage participants
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <span className="text-xl font-bold text-red-600">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Create a Session</h3>
              <p className="mt-2 text-gray-600">
                Set up your planning poker session with a name and choose your preferred card set
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <span className="text-xl font-bold text-red-600">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Invite Your Team</h3>
              <p className="mt-2 text-gray-600">
                Share the session ID with your team members so they can join and participate
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <span className="text-xl font-bold text-red-600">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Start Estimating</h3>
              <p className="mt-2 text-gray-600">
                Everyone selects their cards, then reveal them together to see the results and statistics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Start Planning?</h2>
            <p className="mt-4 text-xl text-red-100">Create your first planning poker session now</p>
            <div className="mt-8">
              <Link href="/create">
                <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
