"use client";

import { createClient } from "@/lib/supabase/client";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

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
        console.log("Setting logged in true");
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
    <div className="flex">
      <div className="flex items-center justify-end flex-1 gap-4">
        {loggedIn ? (
          <Button onClick={logOut}>Sign Out</Button>
        ) : (
          <Fragment>
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </Fragment>
        )}
      </div>
    </div>
  );
};
