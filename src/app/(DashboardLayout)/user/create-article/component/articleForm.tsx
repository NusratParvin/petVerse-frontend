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
import { useForm, FieldValues, Controller } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useRouter } from "next/navigation";

import { useCreateArticleMutation } from "@/src/redux/features/articles/articlesApi";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 bg-gray-100 animate-pulse rounded" />,
});

const ArticleForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [isPremium, setIsPremium] = useState(false);
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [createArticle, { isLoading }] = useCreateArticleMutation();

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

    if (data.price) {
      data.price = Number(data.price);
    }
    const articleData = { ...data, content, images: data.images || null };

    console.log(articleData);
    try {
      const response = await createArticle(articleData).unwrap();
      //   console.log(response);

      if (response?.success) {
        toast.success("Article created successfully!", {
          id: toastId,
          className: "text-green-500",
        });

        router.push("/user/newsfeed");
      }
    } catch (error) {
      toast.error("Failed to create article", {
        id: toastId,
        className: "text-red-500",
      });
    }
  };

  return (
    <Card className="max-w-3xl mx-auto px-4 py-8">
      <CardBody>
        <form
          className="space-y-6 text-black/70"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                {...field}
                fullWidth
                isInvalid={!!errors.title}
                label="Title"
                placeholder="Enter article title"
              />
            )}
            rules={{ required: "Title is required" }}
          />

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="content"
            >
              Content
            </label>
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

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                isInvalid={!!errors.category}
                label="Category"
                placeholder="Select a category"
              >
                <SelectItem key="Tip">Tip</SelectItem>
                <SelectItem key="Story">Story</SelectItem>
              </Select>
            )}
            rules={{ required: "Category is required" }}
          />

          <Input
            fullWidth
            accept="image/*"
            className="text-xs"
            label="Upload Image"
            type="file"
            onChange={handleImageUpload}
          />

          <div className="flex flex-row justify-evenly items-center">
            <Checkbox
              className="w-1/2 mr-auto"
              {...register("isPremium")}
              onChange={(e) => setIsPremium(e.target.checked)}
            >
              <span className="text-black/80 text-sm">
                Is this a premium article?
              </span>
            </Checkbox>

            {isPremium && (
              <Controller
                control={control}
                name="price"
                render={({ field }) => (
                  <Input
                    className="w-1/2"
                    {...field}
                    fullWidth
                    isInvalid={!!errors.price}
                    label="Price"
                    placeholder="Enter price for the premium article"
                    type="number"
                  />
                )}
                rules={{ required: "Price is required for premium content" }}
              />
            )}
          </div>

          <Spacer y={2} />

          <Button fullWidth color="primary" isLoading={isLoading} type="submit">
            Create Article
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default ArticleForm;
