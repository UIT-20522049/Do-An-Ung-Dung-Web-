import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

import { NavigationAction } from "./navigation-action";
import { NavigationFriend } from "./navigation-friend";
import { NavigationItem } from "./navigation-item";
import { MemberRole } from "@prisma/client";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      friend: false,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  let friends = await db.server.findFirst({
    where: {
      friend: true,
      members: {
        some: {
          profileId: profile.id,
          role: "ADMIN"
        }
      }
    }
  });

  if(!friends){
    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: "Friends",
        imageUrl: "",
        friend: true,
        inviteCode: uuidv4(),
        channels: {
          create: [
            { name: "general", profileId: profile.id }
          ]
        },
        members: {
          create: [
            { id: profile.id, profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      }
    });
  }
  
  friends = await db.server.findFirst({
    where: {
      profileId: profile.id,
      friend: true,
      members: {
        some: {
          role: "ADMIN"
        }
      }
    }
  });

  if (!friends) {
    return redirect("/");
  }

  return (
    <div
      className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
      <NavigationFriend 
              id={friends.id}/>
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />
      <NavigationAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => server.friend == false &&(
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]"
            }
          }}
        />
      </div>
    </div>
  )
}