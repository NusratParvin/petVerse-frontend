"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Avatar,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Member, PageMembersList } from "./components/PageMembersList";

import { useGetFriendsListQuery } from "@/src/redux/features/friends/friendsApi";
import {
  useCreatePageMutation,
  useGetPagesQuery,
} from "@/src/redux/features/pages/pagesApi";

interface Page {
  _id: string;
  name: string;
  description?: string;
  members: Member[];
  pendingInvites: Member[];
}

const PagesManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pageName, setPageName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const { data: friendsData } = useGetFriendsListQuery(undefined);
  const { data: pagesData, isLoading, refetch } = useGetPagesQuery(undefined);
  const [createPage] = useCreatePageMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);
  const friends = friendsData?.data?.friends || [];
  const pages = pagesData?.data || [];

  // Handles creating a new page
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPage({ name: pageName, description }).unwrap();
      toast.success("Page created successfully");
      onClose();
      setPageName("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to create page");
    }
  };

  // Handles viewing a page
  const handleViewPage = (page: any) => {
    setSelectedPage(page);
  };

  //   console.log(selectedPage, friends);

  return (
    <div className="p-2  space-y-6 border-2 ">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">My Pages</h1>
        <Button
          color="primary"
          endContent={<Plus className="h-4 w-4" />}
          onPress={onOpen}
        >
          Create Page
        </Button>
      </div>

      {/* Create Page Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <form onSubmit={handleCreatePage}>
            <ModalHeader className="flex flex-col gap-1">
              Create New Page
            </ModalHeader>
            <ModalBody>
              <Input
                required
                label="Page Name"
                placeholder="Enter page name"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
              />
              <Textarea
                label="Description"
                placeholder="Enter page description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Create Page
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Pages List */}
      <div className="grid grid-cols-1 gap-2 w-full">
        {isLoading ? (
          <p>Loading pages...</p>
        ) : (
          pages.map((page: any) => (
            <Card
              key={page._id}
              className="hover:shadow-lg transition-shadow text-black"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-xl font-bold">{page.name}</h3>
                <Users className="h-4 w-4 text-default-500" />
              </CardHeader>
              <CardBody className="flex flex-row items-center justify-between">
                <p className="text-sm text-default-500 mb-4">
                  {page.description}
                </p>
                <div className="flex -space-x-2">
                  {page.members.slice(0, 3).map((member: any, i: number) => (
                    <Avatar
                      key={i}
                      className="border-2 border-background"
                      src={member.profilePhoto}
                    />
                  ))}
                  {page.members.length > 3 && (
                    <Avatar
                      className="border-2 border-background bg-default-100 text-default-500"
                      content={`+${page.members.length - 3}`}
                    />
                  )}
                </div>
              </CardBody>
              <CardBody>
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => handleViewPage(page)}
                >
                  View Page Details
                </Button>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Selected Page Details */}
      {selectedPage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Page Details</h2>
          <PageMembersList
            friends={friends}
            members={selectedPage.members || []}
            pageId={selectedPage._id}
            pendingInvites={selectedPage.pendingInvites || []}
          />
        </div>
      )}
    </div>
  );
};

export default PagesManagement;
