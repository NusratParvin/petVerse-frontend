import { useState } from "react";
import { Button, Avatar } from "@heroui/react";
import { toast } from "sonner";
import { ScrollShadow } from "@heroui/scroll-shadow";

import { useInviteToPageMutation } from "@/src/redux/features/pages/pagesApi";

export type Member = {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  acceptedAt?: string;
  requestedAt: string;
  friend: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  isSentRequest: boolean;
};

interface PageMembersListProps {
  pageId: string;
  members: Member[];
  pendingInvites: Member[];
  friends: Member[];
}

export const PageMembersList = ({
  pageId,
  members,
  pendingInvites: initialPendingInvites,
  friends,
}: PageMembersListProps) => {
  const [inviteToPage] = useInviteToPageMutation();
  const [pendingInvites, setPendingInvites] = useState(initialPendingInvites);

  const handleInvite = async (userId: string) => {
    try {
      await inviteToPage({ pageId, userId }).unwrap();
      toast("Invitation sent successfully");

      // Add the invited friend to the pending invites list
      const invitedFriend = friends.find(
        (friend) => friend.friend._id === userId,
      );

      if (invitedFriend) {
        setPendingInvites((prev) => [
          ...prev,
          {
            _id: invitedFriend.friend._id,
            status: "pending",
            requestedAt: new Date().toISOString(),
            friend: {
              _id: invitedFriend.friend._id,
              name: invitedFriend.friend.name,
              profilePhoto: invitedFriend.friend.profilePhoto,
            },
            isSentRequest: false,
          },
        ]);
      }
    } catch (error) {
      toast("Failed to send invitation");
    }
  };
  // console.log(pendingInvites);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Members ({members?.length})
        </h3>
        <ScrollShadow className="h-[200px] rounded-md border p-4">
          <div className="space-y-4">
            {members?.map((member: any) => (
              <div key={member._id} className="flex items-center gap-3">
                <Avatar src={member?.profilePhoto} />
                <span className="flex-1">{member.name}</span>
              </div>
            ))}
          </div>
        </ScrollShadow>
      </div>
      {/* Pending Invites Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Pending Invites ({pendingInvites?.length})
        </h3>
        <div
          className={`rounded-md border p-4 ${
            pendingInvites.length > 0 ? "" : "text-center"
          }`}
        >
          {pendingInvites?.length > 0 ? (
            <div className="space-y-4">
              {pendingInvites?.map((invite: any) => (
                <div key={invite._id} className="flex items-center gap-3">
                  <Avatar
                    src={invite?.friend?.profilePhoto || invite?.profilePhoto}
                  />
                  <span className="flex-1">
                    {invite?.friend?.name || invite?.name}
                  </span>
                  <span className="text-sm text-yellow-600">Pending</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending invites</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Invite Friends</h3>
        <ScrollShadow className="h-[200px] rounded-md border p-4">
          <div className="space-y-4">
            {friends
              ?.filter(
                (friend) =>
                  !members?.find((m) => m._id === friend?.friend._id) &&
                  !pendingInvites?.find((p) => p._id === friend?.friend._id),
              )
              .map((friend) => (
                <div
                  key={friend?.friend._id}
                  className="flex items-center gap-3"
                >
                  <Avatar src={friend?.friend?.profilePhoto} />
                  <span className="flex-1">{friend?.friend?.name}</span>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => handleInvite(friend?.friend._id)}
                  >
                    Invite
                  </Button>
                </div>
              ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};
