import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";
import { ServerCrash } from "lucide-react";

interface FriendIdPageProps {
  params: {
    friendId: string;
  }
};

const FriendIdPage = async ({
  params
}: FriendIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const friend = await db.server.findUnique({
    where: {
      id: params.friendId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  const initialChannel = friend?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name=""
        serverId=""
        type="channel"
      />
    </div>
   );
}
 
export default FriendIdPage;