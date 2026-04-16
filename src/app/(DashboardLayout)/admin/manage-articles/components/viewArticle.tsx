import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Image,
  Chip,
  Divider,
} from "@heroui/react";
import {
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  DollarSign,
  Tag,
} from "lucide-react";

import { TArticle } from "@/src/types";

interface AdminArticleViewProps {
  article: TArticle;
  isOpen?: boolean;
  onClose?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AdminArticleView({
  article,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: AdminArticleViewProps) {
  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="4xl" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-0 text-base text-orange-500 ">
              {article.title}
            </ModalHeader>
            <ModalBody>
              <Card radius="none" shadow="none">
                <CardBody className="text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Image
                        alt={article.title}
                        className="object-cover rounded-none"
                        height={150}
                        src={article.images}
                        width={400}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User size={16} />
                        <span>{article.authorId.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} />
                        <span>
                          Created:{" "}
                          {new Date(article.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} />
                        <span>
                          Updated:{" "}
                          {new Date(article.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag size={16} />
                        <Chip color="primary">{article.category}</Chip>
                      </div>
                      {article.isPremium && (
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign size={16} />
                          <Chip color="warning">
                            Premium - ${article.price}
                          </Chip>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider className="my-4" />
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Content:</h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </div>
                  <Divider className="my-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={16} />
                        <span>{article.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown size={16} />
                        <span>{article.downvotes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span>{article.comments.length} comments</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
