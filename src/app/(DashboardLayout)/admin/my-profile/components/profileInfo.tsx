"use client";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Button,
  Chip,
  Divider,
  Skeleton,
} from "@heroui/react";
// import { Mail, Edit, Phone, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Edit, Mail, Phone, MapPin, FileText, Users } from "lucide-react";

import ErrorNewsfeed from "../../../user/newsfeed/components/errorNewsfeed";

import { useGetUserInfoQuery } from "@/src/redux/features/user/userApi";

const AdminProfileDashboard = () => {
  const router = useRouter();
  const { data: userInfo, isLoading, error } = useGetUserInfoQuery(undefined);
  const user = userInfo?.data;

  if (isLoading)
    return (
      <div className="me-1">
        <Card className="w-full max-w-3xl mx-auto shadow-md" radius="none">
          {/* Background header with a gradient skeleton */}
          <CardHeader className="h-[120px] overflow-hidden p-0 relative">
            <Skeleton className="w-full h-full" />
          </CardHeader>

          {/* Avatar skeleton */}
          <Skeleton className="absolute top-16 left-4 w-32 h-32 border-4 border-white z-10" />

          {/* Main card body skeleton */}
          <CardBody className="mt-16 ps-8">
            {/* Name and Edit button skeleton */}
            <div className="flex justify-between items-start text-black mb-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* Bio skeleton */}
            <Skeleton className="h-4 w-full mb-4" />

            {/* Additional profile details skeleton */}
            <div className="flex flex-wrap gap-y-2 text-sm text-gray-600 mb-4">
              <Skeleton className="h-4 w-1/4 mr-4" />
              <Skeleton className="h-4 w-1/4 mr-4" />
              <Skeleton className="h-4 w-1/4" />
            </div>

            {/* Followers and following count skeleton */}
            <div className="flex gap-4 mt-4 text-sm text-black/70">
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  if (error) return <ErrorNewsfeed />;

  if (!user) return <p>No user information available.</p>;

  const handleEditProfile = () => {
    router.push("/admin/edit-profile");
  };

  return (
    // <div className="flex justify-center items-center mt-6 w-[90%] mx-auto shadow-none">
    //   <Card className="w-full text-black/80 p-4 text-xs">
    //     <CardBody>
    //       <div className="text-left items-start flex flex-row">
    //         <div className="w-1/2">
    //           <Avatar
    //             alt={user.name}
    //             className="w-24 h-24 mx-auto"
    //             src={user.profilePhoto || "/default-avatar.jpg"}
    //           />
    //         </div>
    //         <div className="w-1/2">
    //           <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
    //           <Chip
    //             className="mt-2"
    //             color={user.role === "ADMIN" ? "danger" : "primary"}
    //             variant="flat"
    //           >
    //             {user.role}
    //           </Chip>
    //         </div>
    //       </div>
    //       <Divider className="my-4" />
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //         <div className="flex items-center gap-2">
    //           <Mail size={14} />
    //           <span>{user.email}</span>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <Phone size={14} />
    //           <span>{user.phone || "N/A"}</span>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <MapPin size={14} />
    //           <span>{user.address || "N/A"}</span>
    //         </div>
    //       </div>
    //       <Divider className="my-4" />
    //       {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //         <div className="text-right flex flex-row items-center gap-6">
    //           <p className="text-sm text-black/80">Articles </p>
    //           <p className="text-blue-500 text-base font-semibold">
    //             {user.articles.length}
    //           </p>
    //         </div>
    //         <div className="text-right flex flex-row items-center gap-6">
    //           <p className="text-sm text-black/80">Followers</p>
    //           <p className="text-blue-500 text-base font-semibold">
    //             {user.followers.length}
    //           </p>
    //         </div>

    //         <div className="text-right flex flex-row items-center gap-6 ">
    //           <p className="text-sm text-black/80">Following</p>
    //           <p className="text-blue-500 text-base font-semibold">
    //             {user.following.length}
    //           </p>
    //         </div>
    //       </div> */}
    //     </CardBody>
    //     <CardFooter>
    //       <Button
    //         className="w-full"
    //         color="primary"
    //         startContent={<Edit size={16} />}
    //         variant="flat"
    //         onPress={handleEditProfile}
    //       >
    //         Edit Profile
    //       </Button>
    //     </CardFooter>
    //   </Card>
    // </div>

    <div className="w-[95%] mx-auto  p-4">
      <Card className="bg-gradient-to-br from-blue-50 to-customBlue/10 shadow-xl">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar
                src={user.profilePhoto || "/default-avatar.jpg"}
                className="w-32 h-32 text-large"
                alt={user.name}
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user.name}
                  </h1>
                  <Chip
                    className="mt-2"
                    color={user.role === "ADMIN" ? "danger" : "primary"}
                    variant="flat"
                  >
                    {user.role}
                  </Chip>
                </div>
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Edit size={18} />}
                  onPress={handleEditProfile}
                >
                  Edit Profile
                </Button>
              </div>
              <Divider className="my-4" />
              <div className="grid grid-cols-1  gap-6 text-gray-600 pb-12">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>{user.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{user.address || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <Divider />
        {/* <CardFooter className="px-6 py-4">
          <div className="w-full grid grid-cols-3 gap-4">
            <StatCard
              icon={<FileText size={24} />}
              title="Articles"
              value={user.articles?.length || 0}
            />
            <StatCard
              icon={<Users size={24} />}
              title="Followers"
              value={user.followers?.length || 0}
            />
            <StatCard
              icon={<Users size={24} />}
              title="Following"
              value={user.following?.length || 0}
            />
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
};

// interface StatCardProps {
//   icon: React.ReactNode;
//   title: string;
//   value: number;
// }

// const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
//   <Card className="bg-white/50 backdrop-blur-sm">
//     <CardBody className="flex flex-row items-center justify-between p-4">
//       <div className="flex items-center gap-2">
//         {icon}
//         <span className="font-medium text-gray-700">{title}</span>
//       </div>
//       <span className="text-2xl font-bold text-blue-600">{value}</span>
//     </CardBody>
//   </Card>
// );

export default AdminProfileDashboard;
