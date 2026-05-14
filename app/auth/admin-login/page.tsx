import { ActivateRoleSession } from "@/components/activate-role-session";
import { RoleLoginForm } from "@/components/role-login-form";
import { getRoleSession } from "@/lib/role-session";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const roleSession = await getRoleSession("admin");
  
    if (roleSession.status === "active") {
      redirect("/admin");
    }
  
    if (roleSession.status === "switch") {
      return (
        <ActivateRoleSession
          sessionToken={roleSession.sessionToken}
          homePath={roleSession.homePath}
          loginPath={roleSession.loginPath}
          label="admin"
        />
      );
    }
  return (
    <RoleLoginForm
      targetRole="admin"
      title="Admin Login"
      description="Sign in to manage users, sites, and payment operations."
    />
  );
}
