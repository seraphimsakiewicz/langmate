"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "../button"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"

export function Header() {
    return (
        <header className="sticky top-0 w-full border-b">
            <div className="h-14 container flex items-center">
                {/* desktop nav */}
                <MainNav />
                {/* mobile */}
                <MobileNav />

                {/* Desktop & mobile */}
                <h1 className="flex items-center justify-end flex-1">
                    <Link href="/">some social media icons</Link>
                </h1>
            </div>
        </header>
    );
}
