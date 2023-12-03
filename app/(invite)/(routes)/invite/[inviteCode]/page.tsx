import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });

  // Tìm server của invite code  là server friend
  const ownerProfile = await db.profile.findFirst({
    where: {
      servers: {
        some: {
          inviteCode: params.inviteCode,
          friend: true,
        },
      },
    },
  });
  
  if (ownerProfile) {
    // Tìm server có friend: true của profile.id
    const friendServer = await db.server.findFirst({
      where: {
        friend: true,
        members: {
          some: {
            profileId: profile.id,
            role: 'ADMIN'
          },
        },
      },
    });
  
    if (friendServer) {
      // Thêm chủ invitecode vào member của server
      await db.server.update({
        where: {
          id: friendServer.id,
        },
        data: {
          members: {
            create: [
              {
                profileId: ownerProfile.id,
                role: 'GUEST', // Có thể thay đổi vai trò theo yêu cầu của bạn
              },
            ],
          },
        },
      });
  
      console.log("Chủ nhân đã được thêm vào member của server.");
    } else {
      console.log("Không tìm thấy server có friend: true.");
    }
  } else {
    console.log("Không tìm thấy chủ nhân với invite code đã cho.");
  }
  

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  
  return null;
}
 
export default InviteCodePage;