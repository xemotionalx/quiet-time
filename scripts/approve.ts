import { isValidEmail } from "../src/lib/validation";
import { createSupabaseAdmin, type SupabaseAdmin } from "./supabase-admin";

function printUsage() {
  console.log("Usage:");
  console.log(
    "  bun run approve <email>            Add an email to the approved list",
  );
  console.log(
    "  bun run approve --remove <email>   Remove an email from the approved list",
  );
  console.log("  bun run approve --list             List every approved email");
}

async function listApproved(supabase: SupabaseAdmin) {
  const { data, error } = await supabase
    .from("approved_emails")
    .select("email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list approved emails: ${error.message}`);
  }

  const rows = data ?? [];
  if (rows.length === 0) {
    console.log("No approved emails yet.");
    return;
  }

  for (const row of rows) {
    console.log(
      `${row.email}  (added ${new Date(row.created_at).toLocaleString()})`,
    );
  }
}

async function addApproved(supabase: SupabaseAdmin, email: string) {
  const { data: existing } = await supabase
    .from("approved_emails")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    console.log(`${email} is already on the approved list.`);
    return;
  }

  const { error } = await supabase.from("approved_emails").insert({ email });

  if (error) {
    throw new Error(`Failed to add ${email}: ${error.message}`);
  }

  console.log(`Added ${email} to the approved list.`);
}

async function removeApproved(supabase: SupabaseAdmin, email: string) {
  const { error } = await supabase
    .from("approved_emails")
    .delete()
    .eq("email", email);

  if (error) {
    throw new Error(`Failed to remove ${email}: ${error.message}`);
  }

  console.log(`Removed ${email} from the approved list.`);
  console.log(
    "Note: this does not delete any existing account for that email.",
  );
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--list")) {
    await listApproved(createSupabaseAdmin());
    return;
  }

  const removeIndex = args.indexOf("--remove");
  const isRemove = removeIndex !== -1;
  const rawEmail = isRemove ? args[removeIndex + 1] : args[0];

  if (!rawEmail) {
    printUsage();
    throw new Error("Missing <email> argument.");
  }

  const email = rawEmail.toLowerCase().trim();

  if (!isValidEmail(email)) {
    throw new Error(`"${rawEmail}" doesn't look like a valid email address.`);
  }

  const supabase = createSupabaseAdmin();

  if (isRemove) {
    await removeApproved(supabase, email);
  } else {
    await addApproved(supabase, email);
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
