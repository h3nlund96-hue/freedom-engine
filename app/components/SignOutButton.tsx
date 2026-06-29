"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="font-display text-[0.58rem] tracking-[0.18em] uppercase text-muted/28 transition-colors duration-300 hover:text-muted/55 focus-visible:outline-none"
    >
      Leave HQ
    </button>
  );
}
