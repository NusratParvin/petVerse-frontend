import baseApi from "../../api/baseApi";

export interface ParsedHealthRecord {
  type: "vaccine" | "vet-visit" | "medication" | "grooming" | "other";
  title: string;
  date: string;
  nextDueDate?: string;
  notes?: string;
  cost?: number;
  vetName?: string;
}

export interface ParseResult {
  records: ParsedHealthRecord[];
  summary: string;
}

// Input can be files, text, or both
export interface ParseInput {
  files?: File[]; // actual File objects from the browser input
  text?: string;
}

export const importWizardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    parseVetNotes: builder.mutation<{ data: ParseResult }, ParseInput>({
      query: ({ files, text }) => {
        // Must use FormData — JSON can't carry binary files
        console.log(text);
        const formData = new FormData();

        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append("files", file); // matches upload.array('files', 5) in route
          });
        }

        if (text) {
          formData.append("text", text);
        }
        console.log(formData);
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
