"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@heroui/react";
import { useForm, FieldValues } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// import "react-quill/dist/quill.snow.css";
import "react-quill-new/dist/quill.snow.css";

import { useRouter } from "next/navigation";

import { useCreateArticleMutation } from "@/src/redux/features/articles/articlesApi";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface CreateArticleModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CreateArticleModal = ({
  isOpen,
  onOpenChange,
}: CreateArticleModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isPremium, setIsPremium] = useState(false);
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const router = useRouter();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET as string);

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();

      setValue("images", data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Creating article...");
    // Merge content from the rich text editor into form data
    const articleData = { ...data, content };

    try {
      console.log(articleData);
      const response = await createArticle(articleData).unwrap();

      console.log(response);

      console.log("Article created successfully:", response);
      toast.success("Article created successfully!", {
        id: toastId,
        className: "text-green-500",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create article:", error);
      toast.error("Failed to create article", {
        id: toastId,
        className: "text-red-500",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Create New Article</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                {/* Title */}
                <Input
                  label="Title"
                  placeholder="Enter article title"
                  {...register("title", { required: "Title is required" })}
                  fullWidth
                  isInvalid={!!errors.title}
                />

                {/* Rich Text Editor */}
                <label className="mt-2" htmlFor="content">
                  Content
                </label>
                <ReactQuill value={content} onChange={setContent} />

                {/* Category */}
                <Select
                  label="Category"
                  placeholder="Select a category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  fullWidth
                  isInvalid={!!errors.category}
                >
                  <SelectItem key="Tip">Tip</SelectItem>
                  <SelectItem key="Story">Story</SelectItem>
                </Select>

                {/* Image Upload */}
                <Input
                  fullWidth
                  accept="image/*"
                  label="Upload Image"
                  type="file"
                  onChange={handleImageUpload}
                />

                {/* Premium Checkbox */}
                <Checkbox
                  {...register("isPremium")}
                  onChange={(e) => setIsPremium(e.target.checked)}
                >
                  Is this a premium article?
                </Checkbox>

                {/* Price Field (conditionally rendered) */}
                {isPremium && (
                  <Input
                    label="Price"
                    placeholder="Enter price for the premium article"
                    type="number"
                    {...register("price", {
                      required: isPremium
                        ? "Price is required for premium content"
                        : false,
                    })}
                    fullWidth
                    isInvalid={!!errors.price}
                  />
                )}
              </ModalBody>

              {/* Modal Footer */}
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Create Article
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateArticleModal;
