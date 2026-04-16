import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Card,
  CardBody,
  Chip,
  Divider,
} from "@heroui/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { TUser } from "@/src/types";

interface AdminUserModalProps {
  user: TUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminUserModal({
  user,
  isOpen,
  onClose,
}: AdminUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              User Information
            </ModalHeader>
            <ModalBody>
              <Card>
                <CardBody>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col items-center">
                      <Avatar
                        src={user.profilePhoto}
                        className="w-24 h-24 text-large"
                        alt={user.name}
                      />
                      <h2 className="text-xl font-bold mt-2">{user.name}</h2>
                      <Chip
                        color={user.role === "ADMIN" ? "danger" : "primary"}
                        variant="flat"
                        className="mt-2"
                      >
                        {user.role}
                      </Chip>
                    </div>
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail size={18} />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={18} />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={18} />
                          <span>{user.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={18} />
                          <span>
                            Joined:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <Users size={24} />
                          <div className="text-right">
                            <p className="text-small text-default-500">
                              Followers
                            </p>
                            <p className="text-large font-semibold">
                              {user.followers.length}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <Users size={24} />
                          <div className="text-right">
                            <p className="text-small text-default-500">
                              Following
                            </p>
                            <p className="text-large font-semibold">
                              {user.following.length}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <FileText size={24} />
                          <div className="text-right">
                            <p className="text-small text-default-500">
                              Articles
                            </p>
                            <p className="text-large font-semibold">
                              {user.articles.length}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                  <Divider className="my-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Purchased Articles
                    </h3>
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={18} />
                      <span>
                        {user.purchasedArticles.length} articles purchased
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
