import { createSupabaseAdmin, type SupabaseAdmin } from "./supabase-admin";

function printUsage() {
  console.log("Usage:");
  console.log(
    "  bun run make-admin <email>            Grant admin access to an existing account",
  );
  console.log("  bun run make-admin --remove <email>   Revoke admin access");
}

async function findUserIdByEmail(supabase: SupabaseAdmin, email: string) {
  let page = 1;

  for (;;) {
    const result = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (result.error) {
      throw new Error(`Failed to look up users: ${result.error.message}`);
    }

    const match = result.data.users.find(
      (user) => user.email?.toLowerCase() === email,
    );
    if (match) return match.id;

    if (result.data.nextPage === null) return null;
    page = result.data.nextPage;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const removeIndex = args.indexOf("--remove");
  const isRemove = removeIndex !== -1;
  const rawEmail = isRemove ? args[removeIndex + 1] : args[0];

  if (!rawEmail) {
    printUsage();
    throw new Error("Missing <email> argument.");
  }

  const email = rawEmail.toLowerCase().trim();
  const supabase = createSupabaseAdmin();
  const userId = await findUserIdByEmail(supabase, email);

  if (!userId) {
    throw new Error(
      `No account found for ${email}. They need to sign up first before they can be made an admin.`,
    );
  }

  if (isRemove) {
    const { error } = await supabase
      .from("admins")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw new Error(
        `Failed to remove admin access for ${email}: ${error.message}`,
      );
    }

    console.log(`Removed admin access for ${email}.`);
    return;
  }

  const { error } = await supabase.from("admins").insert({ user_id: userId });

  if (error) {
    if (error.code === "23505") {
      console.log(`${email} is already an admin.`);
      return;
    }
    throw new Error(`Failed to make ${email} an admin: ${error.message}`);
  }

  console.log(`${email} is now an admin.`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
