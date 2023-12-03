"use client"
import { Contact2 } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { redirect, useParams, useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface NavigationItemProps {
  id: string;
};

export const NavigationFriend = async ({
  id
}: NavigationItemProps) => {

    const router = useRouter();
    const onClick = () => {
      router.push(`/friends/${id}`);
    }

  return (
    <div>
      <ActionTooltip
        side="right"
        align="center"
        label="My Friend"
      >
        <button
          onClick={onClick}
          className="group flex items-center"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Contact2
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}