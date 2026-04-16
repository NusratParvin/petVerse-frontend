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
  Tooltip,
} from "@heroui/react";
import { Eye, Trash } from "lucide-react";
import { toast } from "sonner";
import { TTransaction } from "@/src/types";
import {
  useDeletePaymentMutation,
  useGetAllPaymentsQuery,
} from "@/src/redux/features/payment/paymentApi";
import AdminTransactionModal from "../manage-payment/components/viewTransaction";

const TransactionManagement = () => {
  const {
    data: allTransactions,
    isLoading,
    error,
    refetch,
  } = useGetAllPaymentsQuery(undefined);

  const [deleteTransaction] = useDeletePaymentMutation();
  const [selectedTransaction, setSelectedTransaction] =
    useState<TTransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle View
  const handleView = (transactionId: string) => {
    const transaction = allTransactions?.data?.find(
      (trans: TTransaction) => trans._id === transactionId,
    );
    if (transaction) {
      setSelectedTransaction(transaction);
      setIsModalOpen(true);
    } else {
      console.error("Transaction not found");
    }
  };

  // Handle Delete
  const handleDelete = async (transactionId: string) => {
    const toastId = toast("Processing...");

    try {
      await deleteTransaction(transactionId).unwrap();
      refetch();
      toast.success("Transaction deleted successfully", {
        id: toastId,
        className: "text-green-500",
      });
    } catch (error) {
      toast.error("Failed to delete transaction", {
        id: toastId,
        className: "text-red-500", // Error text color
      });
      console.error("Failed to delete transaction:", error);
    }
  };

  return (
    <div>
      <Card className="mb-8 min-h-[80vh]" radius="none">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black/80">
            Transaction Management
          </h2>
          <p className="text-gray-500">
            Total Transactions: {allTransactions?.data?.length || 0}
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          {isLoading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p>Error loading transactions.</p>
          ) : (
            <Table
              aria-label="Transaction management table"
              className="text-black/80"
            >
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>TRANSACTION ID</TableColumn>
                <TableColumn>ARTICLE</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {allTransactions?.data?.map(
                  (transaction: TTransaction, index: number) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{transaction.transactionId}</TableCell>
                      <TableCell>{transaction.articleId}</TableCell>
                      <TableCell>{transaction.amount} USD</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tooltip content="View">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() =>
                                handleView(transaction._id as string)
                              }
                            >
                              <Eye size={14} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() =>
                                handleDelete(transaction._id as string)
                              }
                            >
                              <Trash size={14} />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Modal for viewing transaction details */}
      {selectedTransaction && (
        <AdminTransactionModal
          transaction={selectedTransaction}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionManagement;
