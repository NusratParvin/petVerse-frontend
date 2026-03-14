"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Avatar,
} from "@heroui/react";
import { Bell, Check, X } from "lucide-react";

// const InvitationsPopover = ({
//   invitations,
//   handleAccept,
//   handleReject,
// }: any) => {
//   console.log(invitations);

//   return (
//     // <div className="border-2">
//     <Popover placement="bottom" showArrow={true}>
//       <PopoverTrigger>
//         <Button isIconOnly className="relative" color="primary" variant="light">
//           <Bell />
//           {invitations.length > 0 && (
//             <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">
//               {invitations.length}
//             </span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent>
//         <div className="px-4 py-2">
//           {invitations.length > 0 ? (
//             invitations.map((invite: any) => (
//               <div
//                 key={invite._id}
//                 className="flex items-center justify-between gap-2 py-2 border-b last:border-none"
//               >
//                 <div className="flex items-center gap-2">
//                   <Avatar src={invite.profilePhoto} />
//                   <div>
//                     <div className="font-bold text-sm">{invite.name}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {invite.pageName}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     isIconOnly
//                     color="success"
//                     size="sm"
//                     onClick={() => handleAccept(invite._id)}
//                   >
//                     <Check />
//                   </Button>
//                   <Button
//                     isIconOnly
//                     color="danger"
//                     size="sm"
//                     onClick={() => handleReject(invite._id)}
//                   >
//                     <X />
//                   </Button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-center text-muted-foreground">
//               No pending invitations
//             </div>
//           )}
//         </div>
//       </PopoverContent>
//     </Popover>
//     // </div>
//   );
// };

const InvitationsPopover = ({
  invitations: invitationsData,
  handleAccept,
  handleReject,
}: any) => {
  console.log(invitationsData);

  const invitations = invitationsData?.map((item: any) => {
    return { name: item.data.name, id: item.data._id };
  });
  // .flat();
  console.log("Processed Invitations:", invitations);

  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button isIconOnly className="relative" color="primary" variant="light">
          <Bell />
          {invitations?.length > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">
              {invitations?.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-4 py-2">
          {invitations?.length > 0 ? (
            invitations?.map((invite: any) => (
              <div
                key={invite.id}
                className="flex items-center justify-between gap-8 py-2 border-b last:border-none"
              >
                <div className="flex items-center gap-2">
                  {/* <Avatar src={invite.profilePhoto} /> */}
                  <div>
                    <div className="font-semibold text-sm text-customBlue">
                      Join {invite.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    onClick={() => handleAccept(invite.id)}
                    className="w-4 h-3.5 text-green-600"
                  />

                  <X
                    onClick={() => handleReject(invite.id)}
                    className="w-4 h-3.5 text-red-600"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-center text-muted-foreground">
              No pending invitations
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InvitationsPopover;
