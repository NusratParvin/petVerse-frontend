import { ParseInput, ParseResult } from "@/src/types";
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
        };
      },
    }),
  }),
});

export const { useParseVetNotesMutation } = importWizardApi;
