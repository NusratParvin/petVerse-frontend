import { ParseInput, ParseResult } from "@/src/types";
import baseApi from "../../api/baseApi";

export const importWizardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    parseVetNotes: builder.mutation({
      query: (formData) => {
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
