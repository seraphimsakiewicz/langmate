import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { AlignJustify, Apple } from "lucide-react"
import Link from "next/link"

export const MobileNav = () => {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger>
                    <AlignJustify /></SheetTrigger>
                <SheetContent side="left">
                    <Link href="/" className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">Lang<span className="font-normal">mate</span></h1>
                    </Link>
                    {/* <nav className="flex flex-col gap-3 lg:gap-4 mt-4">
                        <Link href="/project">Project</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                    </nav> */}
                </SheetContent>
            </Sheet>
        </div>
    )
}