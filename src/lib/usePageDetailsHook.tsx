import { useEffect, useState } from "react";

// interface PageDetail {
//   _id: string;
//   ownerName: string;
//   ownerPhoto: string;
//   pageName: string;
// }

interface PageDetail {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: Member[];
  admins: string[];
  pendingInvites: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Member {
  _id: string;
  name: string;
  profilePhoto?: string;
}

export const useFetchPageDetails = (inviteIds: string[]) => {
  const [pageDetails, setPageDetails] = useState<PageDetail[]>([]);

  useEffect(() => {
    const loadDetails = async () => {
      const details = await Promise.all(
        inviteIds.map(async (id) => {
          const result = await fetch(
            `http://localhost:5000/api/v1/pages/${id}`
          ).then((res) => res.json());

          return result;
        })
      );

      setPageDetails(details);
    };

    if (inviteIds?.length > 0) {
      loadDetails();
    }
  }, [inviteIds]);

  return pageDetails;
};
