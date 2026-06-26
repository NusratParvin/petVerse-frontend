"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { Mail, MessageCircle, Send } from "lucide-react";

interface ActionModalsProps {
  isActionOpen: boolean;
  isContactOpen: boolean;
  actionType: "delete" | "resolve" | null;
  contactType: "email" | "whatsapp" | null;
  headline: string;
  owner: any;
  post: any;
  emailSubject: string;
  setEmailSubject: (value: string) => void;
  contactMessage: string;
  setContactMessage: (value: string) => void;
  emailSending: boolean;
  whatsappSending: boolean;
  onActionClose: () => void;
  onContactClose: () => void;
  onActionConfirm: () => void;
  onContactConfirm: () => void;
}

export const ActionModals = ({
  isActionOpen,
  isContactOpen,
  actionType,
  contactType,
  headline,
  owner,
  post,
  emailSubject,
  setEmailSubject,
  contactMessage,
  setContactMessage,
  emailSending,
  whatsappSending,
  onActionClose,
  onContactClose,
  onActionConfirm,
  onContactConfirm,
}: ActionModalsProps) => (
  <>
    {/* Action Modal */}
    <Modal isOpen={isActionOpen} onClose={onActionClose} size="sm">
      <ModalContent className="bg-white dark:bg-zinc-900">
        <ModalHeader className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {actionType === "delete" ? "Delete Post?" : "Force Resolve?"}
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-zinc-500">
            {actionType === "delete"
              ? `Permanently remove "${headline}"? This cannot be undone.`
              : `Mark "${headline}" as resolved? Owner will see it as reunited.`}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="light"
            onPress={onActionClose}
            className="text-zinc-500"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onPress={onActionConfirm}
            className={
              actionType === "delete"
                ? "bg-red-500 text-white"
                : "bg-emerald-500 text-white"
            }
          >
            {actionType === "delete" ? "Delete" : "Resolve"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* Contact Modal */}
    <Modal isOpen={isContactOpen} onClose={onContactClose} size="md">
      <ModalContent className="bg-white dark:bg-zinc-900">
        <ModalHeader className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
          {contactType === "email" ? (
            <>
              <Mail className="size-4 text-steel-blue" /> Send Email to Owner
            </>
          ) : (
            <>
              <MessageCircle className="size-4 text-emerald-500" /> Send
              WhatsApp to Owner
            </>
          )}
        </ModalHeader>
        <ModalBody className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <span className="text-[11px] text-zinc-400">To:</span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {contactType === "email" ? owner?.email : post.posterPhone}
            </span>
          </div>

          {contactType === "email" && (
            <Input
              label="Subject"
              size="sm"
              value={emailSubject}
              onValueChange={setEmailSubject}
              classNames={{
                inputWrapper:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                input: "text-sm",
              }}
            />
          )}

          <Textarea
            label="Message"
            placeholder={
              contactType === "email"
                ? "Write your message to the owner..."
                : "Write your WhatsApp message..."
            }
            minRows={4}
            value={contactMessage}
            onValueChange={setContactMessage}
            classNames={{
              inputWrapper:
                "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
              input: "text-sm",
            }}
          />

          <p className="text-[10px] text-zinc-400">
            {contactType === "whatsapp"
              ? "Message will be sent via Twilio WhatsApp. The owner must have WhatsApp on the registered number."
              : "Email will be sent from the PetVerse system email."}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="light"
            onPress={onContactClose}
            className="text-zinc-500"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            isLoading={emailSending || whatsappSending}
            isDisabled={!contactMessage.trim()}
            onPress={onContactConfirm}
            className={
              contactType === "email"
                ? "bg-steel-blue text-white"
                : "bg-emerald-500 text-white"
            }
            startContent={<Send className="size-3.5" />}
          >
            Send {contactType === "email" ? "Email" : "WhatsApp"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
);
