"use client";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import { Edit, Eye, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/src/redux/features/user/userApi";
import { TUser } from "@/src/types";
import AdminUserModal from "./components/viewUser";

const UserManagement = () => {
  const {
    data: allUsers,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery(undefined);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUser] = useDeleteUserMutation();

  // Handle View
  const handleView = (userId: string) => {
    const user = allUsers?.data?.find((usr: TUser) => usr._id === userId);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    } else {
      console.error("User not found");
    }
  };

  const handleDelete = async (userId: string) => {
    const toastId = toast("Processing...");

    try {
      const res = await deleteUser(userId);

      if (res) {
        refetch();
        toast.success("User deleted successfully", {
          id: toastId,
          className: "text-green-500",
        });
      }
    } catch (error) {
      toast.error("Failed to delete user", {
        id: toastId,
        className: "text-red-500",
      });
      console.error("Failed to delete user:", error);
    }
  };

  const handleEdit = (userId: string) => {
    console.log(`Editing user with ID: ${userId}`);
    // Add edit logic here
  };

  return (
    <div>
      <Card className="mb-8 min-h-[80vh]" radius="none">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black/80">
            User Management
          </h2>
          <p className="text-gray-500">
            Total Users: {allUsers?.data?.length || 0}
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="User management table" className="text-black/80">
            <TableHeader>
              <TableColumn>#</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>JOINED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {allUsers?.data?.map((user: TUser, index: number) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <User
                      avatarProps={{
                        src: user.profilePhoto || "/default-avatar.png",
                      }}
                      name={user.name}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={user.role === "ADMIN" ? "danger" : "primary"}
                      variant="flat"
                    >
                      {user.role}
                    </Chip>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip content="View">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleView(user?._id ?? "")}
                        >
                          <Eye size={20} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleEdit(user?._id ?? "")}
                        >
                          <Edit size={20} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() => handleDelete(user?._id ?? "")}
                        >
                          <Trash size={20} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal for viewing user details */}
      {selectedUser && (
        <AdminUserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;
