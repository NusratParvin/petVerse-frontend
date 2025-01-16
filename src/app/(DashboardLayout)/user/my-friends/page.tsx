"use client";
import { Card, CardHeader, CardBody, Avatar, Button } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetFriendsListQuery,
  useRejectFriendRequestMutation,
} from "@/src/redux/features/friends/friendsApi";
import { useEffect } from "react";
import Link from "next/link";

interface FriendRequest {
  _id: string;
  status: string;
  requestedAt: string;
  isSentRequest: boolean; // Flag to identify sent requests
  friend: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
}

interface Friend {
  _id: string;
  friend: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
}

const MyFriends = () => {
  const { data, isLoading, refetch } = useGetFriendsListQuery(undefined);

  useEffect(() => {
    refetch(); // Force a refetch when the component mounts
  }, [refetch]);
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();
  const [cancelFriendRequest] = useCancelFriendRequestMutation();
  //   console.log(data);
  const friendsData = data?.data || {};
  const pendingRequestsReceived = friendsData?.pendingRequestsReceived || [];
  const pendingRequestsSent = friendsData?.pendingRequestsSent || [];

  const sentRequests = pendingRequestsSent.filter(
    (req: FriendRequest) => req.isSentRequest
  ); // Requests sent by user
  const receivedRequests = pendingRequestsReceived.filter(
    (req: FriendRequest) => !req.isSentRequest
  ); // Requests received by user
  const friends = friendsData?.friends || [];

  console.log(friends);

  const handleRequestResponse = async (
    requestId: string,
    action: "accept" | "reject" | "cancel"
  ) => {
    try {
      if (action === "accept") {
        await acceptFriendRequest(requestId).unwrap();
      } else if (action === "reject") {
        await rejectFriendRequest(requestId).unwrap();
      } else if (action === "cancel") {
        await cancelFriendRequest(requestId).unwrap();
      }
      toast(`Request ${action}ed successfully`);
    } catch (error) {
      console.error(error);
      toast(`Failed to ${action} the friend request`);
    }
  };

  const FriendCard = ({ friend }: { friend: Friend }) => (
    <Card className="hover:shadow-lg border-none shadow-none transition-all text-black">
      <CardBody className="flex flex-row items-center justify-between gap-4  ">
        {/* Left Side: Image and Name */}
        <div className="flex items-center gap-4">
          <Avatar
            alt={friend.friend.name}
            className="h-12 w-12"
            src={friend.friend.profilePhoto}
          />
          <h3 className="font-medium">{friend.friend.name}</h3>
        </div>

        {/* Right Side: Button */}
        {/* <Button size="sm" variant="faded"> */}
        <Link href={`/user/friend/${friend.friend._id}`}>Visit</Link>
        {/* Visit */}
        {/* </Button> */}
      </CardBody>
    </Card>
  );

  const RequestCard = ({
    request,
    type,
  }: {
    request: FriendRequest;
    type: "received" | "sent";
  }) => (
    <Card className="hover:shadow-lg transition-all">
      <CardBody className="flex flex-row items-center gap-4 text-black">
        <Avatar
          alt={request.friend.name}
          className="h-12 w-12"
          src={request.friend.profilePhoto}
        />
        <div className="flex-1">
          <h3 className="font-medium">{request.friend.name}</h3>
          <p className="text-xs ">
            {type === "received" ? "Received" : "Sent"}{" "}
            {formatDistanceToNow(new Date(request.requestedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        {type === "received" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="light"
              onClick={() => handleRequestResponse(request._id, "accept")}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="shadow"
              onClick={() => handleRequestResponse(request._id, "reject")}
            >
              Decline
            </Button>
          </div>
        )}
        {type === "sent" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleRequestResponse(request._id, "cancel")}
          >
            Cancel Request
          </Button>
        )}
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full text-black mx-auto   p-3">
      <div className="grid  gap-8">
        {/* Friends Section */}
        <section>
          <Card className="text-black">
            <CardHeader>Friends ({friends.length})</CardHeader>
            <CardBody className="grid gap-4">
              {friends.map((friend: Friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
              {friends.length === 0 && (
                <p className="text-center text-black">
                  No friends yet. Start connecting!
                </p>
              )}
            </CardBody>
          </Card>
        </section>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          {/* Received Requests Section */}
          <section>
            <Card className="text-black">
              <CardHeader>
                Friend Requests Received ({receivedRequests.length})
              </CardHeader>
              <CardBody className="grid gap-4">
                {receivedRequests.map((request: FriendRequest) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    type="received"
                  />
                ))}
                {receivedRequests.length === 0 && (
                  <p className="text-center text-black">No received requests</p>
                )}
              </CardBody>
            </Card>
          </section>

          {/* Sent Requests Section */}
          <section>
            <Card className="text-black">
              <CardHeader>
                Friend Requests Sent ({sentRequests.length})
              </CardHeader>
              <CardBody className="grid gap-4">
                {sentRequests.map((request: FriendRequest) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    type="sent"
                  />
                ))}
                {sentRequests.length === 0 && (
                  <p className="text-center text-black">No sent requests</p>
                )}
              </CardBody>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyFriends;
