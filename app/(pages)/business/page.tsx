"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessLogin } from "@/components/BusinessLogin"
import { BusinessSignup } from "@/components/BusinessSignup"

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-400 to-slate-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <Card className="w-full max-w-md shadow-lg rounded-lg bg-white dark:bg-gray-800 transition-all">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Business Account</CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Log in or create a new business account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <TabsTrigger
                    value="login"
                    className="rounded-md py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                 data-[state=active]:bg-blue-500 data-[state=active]:text-white
                 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-md py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                 data-[state=active]:bg-green-500 data-[state=active]:text-white
                 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <BusinessLogin />
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <BusinessSignup />
                </TabsContent>
              </Tabs>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

