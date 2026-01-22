import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutClientPage from "./CheckoutClientPage"; // We are about to create this

export default async function CheckoutPage() {
  // Get the current user's session from the server
  const session = await auth();

  // If there's no user in the session, they are not logged in.
  if (!session?.user) {
    // Redirect them to the login page.
    // The `callbackUrl` tells the login page where to send the user back to after they successfully log in.
    redirect("/login?callbackUrl=/checkout");
  }

  // If they are logged in, we can show them the actual checkout form.
  // We pass the user object down so we can pre-fill their name.
  return <CheckoutClientPage user={session.user} />;
}