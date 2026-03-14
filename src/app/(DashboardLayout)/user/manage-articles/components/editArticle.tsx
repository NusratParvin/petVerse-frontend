"use client";

import {
  Input,
  Select,
  SelectItem,
  Checkbox,
  Button,
  Card,
  CardBody,
  Spacer,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

import { useUpdateArticleMutation } from "@/src/redux/features/articles/articlesApi";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 bg-gray-100 animate-pulse rounded" />,
});

type EditArticleFormProps = {
  article: any;
  onCancel: () => void;
};

const EditArticleForm: React.FC<EditArticleFormProps> = ({
  article,
  onCancel,
}) => {
  const router = useRouter();
  const [updateArticle, { isLoading }] = useUpdateArticleMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: article,
  });

  const [isPremium, setIsPremium] = useState(article?.isPremium || false);
  const [content, setContent] = useState(article?.content || "");
  const [uploading, setUploading] = useState(false);

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

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Updating article...");

    const updatedFields: any = {};

    if (data.title !== article.title) updatedFields.title = data.title;
    if (content !== article.content) updatedFields.content = content;
    if (data.category !== article.category)
      updatedFields.category = data.category;
    if (isPremium !== article.isPremium) updatedFields.isPremium = isPremium;
    if (isPremium && data.price !== article.price) {
      updatedFields.price = Number(data.price);
    }

    if (data.images && data.images !== article.images)
      updatedFields.images = data.images;

    if (Object.keys(updatedFields).length === 0) {
      toast.error("No changes made to the article", {
        id: toastId,
        className: "text-red-500",
      });

      return;
    }

    console.log("Updated Fields:", updatedFields);

    try {
      const response = await updateArticle({
        id: article._id,
        updatedFields,
      }).unwrap();

      if (response?.success) {
        toast.success("Article updated successfully!", {
          id: toastId,
          className: "text-green-500",
        });

        router.push("/user/newsfeed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update article", {
        id: toastId,
        className: "text-red-500",
      });
    }
  };

  useEffect(() => {
    setValue("title", article.title);
    setValue("category", article.category);
    setValue("isPremium", article.isPremium);
    setValue("price", article.price);
    setContent(article.content);
  }, [article, setValue]);

  return (
    <Card className="max-w-3xl mx-auto px-4 py-8">
      <CardBody>
        {/* Cancel Button with X Icon */}
        <div className="flex justify-end">
          <Button
            isIconOnly
            className="text-red-500"
            variant="light"
            onClick={onCancel}
          >
            <X size={18} />
          </Button>
        </div>
        <form
          className="space-y-6 text-black/70"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Title Input */}
          <Input
            {...register("title", { required: "Title is required" })}
            fullWidth
            label="Title"
            placeholder="Enter article title"
            validationState={errors.title ? "invalid" : "valid"}
          />

          {/* Content Input */}
          <div>
            <h2 className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </h2>
            <ReactQuill
              className="h-64 mb-12"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              value={content}
              onChange={setContent}
            />
          </div>

          {/* Category Select */}
          <Select
            fullWidth
            label="Category"
            placeholder="Select a category"
            selectedKeys={new Set([article.category])}
            onChange={(event) => {
              const selectedCategory = event.target.value;

              if (selectedCategory) {
                setValue("category", selectedCategory);
              }
            }}
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

          {/* Premium Checkbox and Price Input */}
          <div className="flex flex-row justify-between items-center">
            <Checkbox
              isSelected={isPremium}
              onChange={() => setIsPremium(!isPremium)}
            >
              Is this a premium article?
            </Checkbox>

            {isPremium && (
              <Input
                {...register("price", {
                  required: isPremium ? "Price is required" : false,
                  valueAsNumber: true,
                })}
                fullWidth
                disabled={!isPremium}
                label="Price"
                placeholder="Enter price for premium article"
                type="number"
              />
            )}
          </div>

          <Spacer y={2} />

          {/* Submit Button */}
          <Button fullWidth color="primary" isLoading={isLoading} type="submit">
            Update Article
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default EditArticleForm;
