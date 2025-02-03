
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stock Management System',
  description: 'Efficiently manage your inventory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col md:flex-row h-screen">
            {/* Sidebar */}
            <Sidebar className="w-full md:w-64 h-auto md:h-screen bg-gray-800 text-white" />

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-background">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

