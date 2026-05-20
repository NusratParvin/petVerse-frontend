import { ParseInput, ParseResult, THealthRecordType } from "@/src/types";
import baseApi from "../../api/baseApi";

export const importWizardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    parseVetNotes: builder.mutation<{ data: ParseResult }, ParseInput>({
      query: ({ files, text }) => {
        // Must use FormData — JSON can't carry binary files
        console.log(text);
        const formData = new FormData();

        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append("files", file);
          });
        }

        if (text) {
          formData.append("text", text);
        }
        // console.log(formData);
        return {
          url: "/import-wizard/parse",
          method: "POST",
          body: formData,
          // Do NOT set Content-Type header — browser sets it automatically
          // with the correct multipart boundary when using FormData
        };
      },
    }),
  }),
});

export const { useParseVetNotesMutation } = importWizardApi;
