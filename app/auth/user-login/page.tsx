import { ActivateRoleSession } from "@/components/activate-role-session";
import { RoleLoginForm } from "@/components/role-login-form";
import { getRoleSession } from "@/lib/role-session";
import { redirect } from "next/navigation";

export default async function UserLoginPage() {
  const roleSession = await getRoleSession("user");

  if (roleSession.status === "active") {
    redirect("/dashboard");
  }

  if (roleSession.status === "switch") {
    return (
      <ActivateRoleSession
        sessionToken={roleSession.sessionToken}
        homePath={roleSession.homePath}
        loginPath={roleSession.loginPath}
        label="user"
      />
    );
  }
  return (
    <RoleLoginForm
      targetRole="user"
      title="User Login"
      description="Sign in to view your dashboard, earnings, and payments."
    />
  );
}
