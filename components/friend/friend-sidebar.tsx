import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { FriendHeader } from "./friend-header";
import { FriendSearch } from "./friend-search";
import { FriendSection } from "./friend-section";
import { FriendMember } from "./friend-member";

interface FriendSidebarProps {
  friendId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}

export const FriendSidebar = async ({
  friendId
}: FriendSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }


  const friend = await db.server.findFirst({
    where: {
      id: friendId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  const members = friend?.members.filter((member) => member.profileId !== profile.id)

  if (!friend) {
    return redirect("/");
  }

  const role = friend.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <FriendHeader
        friend={friend}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <FriendSearch
            data={[
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                }))
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!members?.length && (
          <div className="mb-2">
            <div className="space-y-[2px]">
              {members.map((member) => (
                <FriendMember
                  key={member.id}
                  member={member}
                  server={friend}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}