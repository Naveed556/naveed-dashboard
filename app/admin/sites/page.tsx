"use client";
import { useState, useEffect } from "react";
import {
  addSiteAction,
  deleteSiteAction,
  getSitesAction,
} from "@/lib/server-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Trash2Icon, PlusIcon, CopyIcon, CheckCheckIcon } from "lucide-react";
import type { Sites } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Client_Email } from "@/lib/utils";

export default function SitesPage() {
  const [sites, setSites] = useState<Sites[]>([]);
  const [url, setUrl] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [adding, setAdding] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    getSitesAction().then(setSites);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addSiteAction(url, propertyId);
      toast.success("Site added successfully");
      setUrl("");
      setPropertyId("");
      setSites(await getSitesAction());
    } catch (err) {
      toast.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (domain: string) => {
    await deleteSiteAction(domain);
    setSites(await getSitesAction());
    toast.success("Site removed");
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(Client_Email);
    // check if the email was copied successfully then make the button text "Copied!" for 2 seconds
    if (navigator.clipboard) {
      setEmailCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setEmailCopied(false), 2000);
    } else {
      toast.error("Failed to copy email");
    }
  };

  return (
    <div className="container mx-auto p-5 space-y-6">
      <h1 className="text-2xl font-bold">Manage Sites</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Site</CardTitle>
          <CardDescription>
            In order to get data from Google analytics,
            <br />
            Visit Google Analytics &gt; Admin &gt; Property Access Management
            &gt; Add Users &gt; Add the service email below with atleast
            "Viewer" role
            <Badge variant={"outline"} className="ml-2 py-4">
              {Client_Email}{" "}
              <Button
                variant={"outline"}
                size={"icon-xs"}
                onClick={() => handleCopyEmail()}
                disabled={emailCopied}
              >
                {" "}
                {emailCopied ? <CheckCheckIcon /> : <CopyIcon />}
              </Button>
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Site URL</FieldLabel>
                  <Input
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>GA4 Property ID</FieldLabel>
                  <Input
                    placeholder="123456789"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    required
                  />
                </Field>
              </div>
              <Button type="submit" disabled={adding}>
                <PlusIcon /> {adding ? "Adding..." : "Add Site"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Sites ({sites.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sites.map((site) => (
            <div
              key={site.domain}
              className="flex items-center justify-between p-3 border rounded-none"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={site.favicon} />
                  <AvatarFallback>{site.domain[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{site.domain}</p>
                  <p className="text-xs text-muted-foreground">
                    Property: {site.propertyId}
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => handleDelete(site.domain)}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
          {sites.length === 0 && (
            <p className="text-center text-muted-foreground py-6">
              No sites added yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
