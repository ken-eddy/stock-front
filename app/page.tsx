import Link from "next/link"

export default function Home() {
  return (
    <div>
    <div className="min-h-screen bg-slate-500 py-6 flex flex-col justify-center sm:py-12">
    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div className="max-w-md mx-auto">

        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Stock App</h1>
        <p className="mt-2 text-gray-600">Get started by signing up or logging in</p>
        <div className="mt-5 space-y-2">
          <Link
            href="/signup"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
          >
            Log In
          </Link>
        </div>
      </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

