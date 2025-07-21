"use client";

import { Apple, SubscriptIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, Fragment } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../button";

export const MainNav = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const supabase = createClient();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setLoggedIn(true);
      }
    };
    fetchUser();
  }, [pathName]);

  const logOut = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    // navigate to home
    router.push("/");
  };

  return (
    <div className="hidden md:flex">
      {/* <nav className="flex items-center gap-3 ml-8 lg:gap-4">
                <Link href="/project">Project</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </nav> */}
      {/* Desktop & mobile */}
      <div className="flex items-center justify-end flex-1 gap-4">
        {loggedIn ? (
          <Button
            onClick={logOut}
            // className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </Button>
        ) : (
          <Fragment>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Signup
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};
