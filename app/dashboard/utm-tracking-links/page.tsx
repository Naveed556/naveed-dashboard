"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WPCategory {
  id: number;
  name: string;
}

interface WPPost {
  title: { rendered: string };
  link: string;
  slug: string;
}

const createRandomId = (length: number) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) =>
    characters.charAt(value % characters.length),
  ).join("");
};

export default function UTMTrackingLinksPage() {
  const searchParams = useSearchParams();
  const siteDomain = searchParams.get("site");
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<WPCategory | null>(
    null,
  );
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState<Set<string>>(new Set());

  const decode = (str: string) => {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&#(\d+);/g, (_, charCode) =>
        String.fromCharCode(Number(charCode)),
      );
  };

  const fetchAllPosts = async (
    categoryId: number,
    siteDomain: string,
  ): Promise<WPPost[]> => {
    let fetchedPosts: WPPost[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `https://${siteDomain}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=100&page=${page}&_fields=title,link,slug`,
      );

      if (response.status === 400) {
        return [];
      }

      const data: WPPost[] = await response.json();
      const postsFromPage = data.map((post) => ({
        ...post,
        title: { rendered: decode(post.title.rendered) },
      }));

      fetchedPosts = fetchedPosts.concat(postsFromPage);

      const header = response.headers.get("X-WP-TotalPages");
      totalPages = header ? Number(header) : page;
      page++;
    } while (page <= totalPages);

    return fetchedPosts;
  };

  useEffect(() => {
    if (!siteDomain) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading reflects the request lifecycle started by this effect
    setLoading(true);
    fetch(
      `https://${siteDomain}/wp-json/wp/v2/categories?per_page=100&_fields=id,name`,
    )
      .then((res) => res.json())
      .then((data: WPCategory[]) => {
        const decoded = data.map((cat) => ({
          ...cat,
          name: decode(cat.name),
        }));
        setCategories(decoded);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [siteDomain]);

  useEffect(() => {
    if (!selectedCategory || !siteDomain) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading reflects the request lifecycle started by this effect
    setLoading(true);
    fetchAllPosts(selectedCategory.id, siteDomain)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setPosts([]);
        setLoading(false);
      });
  }, [selectedCategory, siteDomain, user?.username]);

  const generateUTMLink = (post: WPPost) => {
    const username = user?.username || "";
    const slug = post.slug;
    const id = createRandomId(8);
    return `${post.link}?utm_campaign=${slug}_${username}&utm_medium=link&utm_source=link_${username}_${id}`;
  };

  const copyLink = async (post: WPPost) => {
    const utmLink = generateUTMLink(post);
    try {
      await navigator.clipboard.writeText(utmLink);
      setCopiedLinks((prev) => new Set(prev).add(post.slug));
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">UTM Tracking Links</h1>

      {!siteDomain ? (
        <div className="text-red-500">
          Invalid or inaccessible site selected.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">
              Selected Website: <Badge variant={"outline"}>{siteDomain}</Badge>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Category:
            </label>
            <Select
              onValueChange={(value) => {
                const cat = categories.find((c) => c.id === parseInt(value));
                setPosts([]);
                setSelectedCategory(cat || null);
              }}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && <p>Loading...</p>}

          {selectedCategory && posts.length > 0 && (
            <Card className="bg-transparent">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold mb-2">
                  Articles in {decode(selectedCategory?.name || "")}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {posts.map((post) => (
                    <div key={post.slug}>
                      {copiedLinks.has(post.slug) ? (
                        <Item variant="muted" className="text-muted-foreground">
                          <ItemContent>
                            <ItemTitle>{post.title.rendered}</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <Button variant="secondary" size="sm" disabled>
                              <CheckIcon />
                            </Button>
                          </ItemActions>
                        </Item>
                      ) : (
                        <Item variant="outline" className="hover:bg-muted">
                          <ItemContent>
                            <ItemTitle>{post.title.rendered}</ItemTitle>
                          </ItemContent>
                          <ItemActions>
                            <Button
                              onClick={() => copyLink(post)}
                              variant="outline"
                              size="sm"
                            >
                              <CopyIcon />
                            </Button>
                          </ItemActions>
                        </Item>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
