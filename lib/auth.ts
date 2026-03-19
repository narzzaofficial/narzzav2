import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAIL ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function getCurrentUserEmail() {
  const user = await currentUser();
  if (!user) return null;

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
      ?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  return primaryEmail?.toLowerCase() ?? null;
}

export async function requireAdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  const email = await getCurrentUserEmail();
  const adminEmails = getAdminEmails();

  if (!email || !adminEmails.has(email)) {
    redirect("/");
  }

  return { userId, email };
}

export async function requireAdminApiRequest() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = await getCurrentUserEmail();
  const adminEmails = getAdminEmails();

  if (!email || !adminEmails.has(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

