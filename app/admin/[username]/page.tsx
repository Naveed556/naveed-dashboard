export default async function UserStats({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { username } = await params;
  const userID = (await searchParams).id;

  return (
    <div>
      Username:{username} & UserId: {userID}
    </div>
  );
}
