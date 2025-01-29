import { signIn } from "@/lib/auth";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/" });
      }}
    >
      <button type="submit">Signin with GitHub</button>
    </form>
  );
}
