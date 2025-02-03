import Link from 'next/link';
import { Home, Package, PlusCircle, FileText, ChartBarStacked } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={`w-64 bg-green-300 dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-lg ${className}`}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Stock Manager</h1>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/products" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/dashboard/categories" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
            <ChartBarStacked size={20} />
            <span>Categories</span>
          </Link>
          <Link href="/dashboard/add-product" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
            <PlusCircle size={20} />
            <span>Add Product</span>
          </Link>
          <Link href="/dashboard/sales" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
            <FileText size={20} />
            <span>Sales</span>
          </Link>
          <Link href="/dashboard/reports" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary">
            <FileText size={20} />
            <span>Reports</span>
          </Link>
        </nav>
      </div>
      <div className="absolute bottom-4 left-4">
        <ModeToggle />
      </div>
    </aside>
  );
}

