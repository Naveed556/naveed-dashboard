import { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { BadgeCheckIcon } from "lucide-react";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user as User;
  const accessibleSites: string[] =
    (user as any).accessibleSites ?? (user as any).data?.accessibleSites ?? [];
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-center gap-2 w-full text-center">
            <Avatar className="h-40 w-40">
              <AvatarImage src={user.image as string} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">
                {user.name}
              </CardTitle>
              <CardDescription className="text-sm">
                @{user.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <div className="space-y-1">
              <div className="flex gap-2 flex-wrap">
                Email:
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {user.email}
                  {user.emailVerified && (
                    <BadgeCheckIcon className="size-4 text-green-600" />
                  )}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                Gender:
                <p className="text-sm text-muted-foreground">
                  {user.gender && (
                    <Badge variant="secondary">{user.gender}</Badge>
                  )}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                Accessible Sites :{" "}
                {accessibleSites.map((site) => (
                  <Badge key={site} variant="default">
                    {site}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                Joined At:
                <p className="text-xs text-muted-foreground">
                  {format(new Date(user.createdAt), "PPP")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
