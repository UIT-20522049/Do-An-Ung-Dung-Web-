import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { FriendSidebar } from "@/components/friend/friend-sidebar";

const FriendIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { friendId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const friend = await db.server.findUnique({
    where: {
      id: params.friendId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!friend) {
    return redirect("/");
  }

  return ( 
    <div className="h-full">
      <div 
      className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <FriendSidebar friendId={params.friendId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
   );
}
 
export default FriendIdLayout;