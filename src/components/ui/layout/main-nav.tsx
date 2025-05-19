import { Apple } from "lucide-react"
import Link from "next/link"

export const MainNav = () => {
    return (
        <div className="hidden md:flex">
            <nav className="flex items-center gap-3 ml-8 lg:gap-4">
                <Link href="/project">Project</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </nav>
            {/* Desktop & mobile */}
            <div className="flex items-center justify-end flex-1 gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
                <Link href="/signup" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Signup</Link>
            </div>
        </div>
    )
}