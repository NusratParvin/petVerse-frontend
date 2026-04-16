import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { TTransaction } from "@/src/types";

interface TransactionViewProps {
  transaction: TTransaction;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionView = ({
  transaction,
  isOpen,
  onClose,
}: TransactionViewProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <h2>Transaction Details</h2>
      </ModalHeader>
      <ModalBody>
        <p>
          <strong>Transaction ID:</strong> {transaction.transactionId}
        </p>
        <p>
          <strong>User ID:</strong> {transaction.userId}
        </p>
        <p>
          <strong>Article ID:</strong> {transaction.articleId}
        </p>
        <p>
          <strong>Amount:</strong> {transaction.amount} USD
        </p>
        <p>
          <strong>Status:</strong> {transaction.status}
        </p>
        <p>
          <strong>Created At:</strong> {transaction.createdAt}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onPress={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default TransactionView;
