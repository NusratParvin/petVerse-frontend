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
  Chip,
} from "@heroui/react";
import {
  DollarSign,
  User,
  FileText,
  Calendar,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { TTransaction } from "@/src/types";

interface AdminTransactionModalProps {
  transaction: TTransaction;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminTransactionModal({
  transaction,
  isOpen,
  onClose,
}: AdminTransactionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Transaction Details
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={20} />
                  <div>
                    <p className="text-small text-default-500">
                      Transaction ID
                    </p>
                    <p className="text-sm font-semibold">
                      {transaction.transactionId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={20} />
                  <div>
                    <p className="text-small text-default-500">Amount</p>
                    <p className="text-sm font-semibold">
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <div>
                    <p className="text-small text-default-500">User ID</p>
                    <p className="text-sm font-semibold">
                      {transaction.userId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={20} />
                  <div>
                    <p className="text-small text-default-500">Article ID</p>
                    <p className="text-sm font-semibold">
                      {transaction.articleId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={20} />
                  <div>
                    <p className="text-small text-default-500">Email</p>
                    <p className="text-sm font-semibold">{transaction.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <div>
                    <p className="text-small text-default-500">Author ID</p>
                    <p className="text-sm font-semibold">
                      {transaction.authorId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <div>
                    <p className="text-small text-default-500">Created At</p>
                    <p className="text-sm font-semibold">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {transaction.status === "completed" ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <XCircle size={20} className="text-danger" />
                  )}
                  <div>
                    <p className="text-small text-default-500">Status</p>
                    <Chip
                      color={
                        transaction.status === "completed"
                          ? "success"
                          : "danger"
                      }
                      variant="flat"
                    >
                      {transaction.status}
                    </Chip>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            isDisabled
            color="primary"
            onPress={() => {
              console.log(
                "Additional action for transaction:",
                transaction._id,
              );
            }}
          >
            Generate Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
