import baseApi from "../../api/baseApi";

export const petsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Create pet ──
    createMyPet: builder.mutation({
      query: (petInfo) => ({
        url: "/pets",
        method: "POST",
        body: petInfo,
      }),
      invalidatesTags: ["Pets"],
    }),

    // ── Get all my pets ──
    getMyPets: builder.query({
      query: () => ({
        url: "/pets/my-pets",
        method: "GET",
      }),
      providesTags: ["Pets"],
    }),

    // ── Get single pet ──
    getSinglePet: builder.query({
      query: (id: string) => ({
        url: `/pets/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Pets", id }],
    }),

    // ── Update pet ──
    updatePet: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/pets/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Pets",
        { type: "Pets", id },
      ],
    }),

    // ── Delete pet ──
    deletePet: builder.mutation({
      query: (id: string) => ({
        url: `/pets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pets"],
    }),

    // ── Add health record ──
    addHealthRecord: builder.mutation({
      query: ({ petId, ...recordData }) => ({
        url: `/pets/${petId}/health-record`,
        method: "POST",
        body: recordData,
      }),
      invalidatesTags: (_result, _error, { petId }) => [
        "Pets",
        { type: "Pets", id: petId },
      ],
    }),

    // ── get single  health record ──
    getSingleHealthRecord: builder.query({
      query: ({ petId, recordId }) => ({
        url: `/pets/${petId}/health-record/`,
        method: "GET",
        body: recordId,
      }),
    }),

    // ── Update health record ──
    updateHealthRecord: builder.mutation({
      query: ({ petId, recordId, ...updateData }) => ({
        url: `/pets/${petId}/health-record/${recordId}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: (_result, _error, { petId }) => [
        "Pets",
        { type: "Pets", id: petId },
      ],
    }),

    // ── Delete health record ──
    deleteHealthRecord: builder.mutation({
      query: ({ petId, recordId }) => ({
        url: `/pets/${petId}/health-record/${recordId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { petId }) => [
        "Pets",
        { type: "Pets", id: petId },
      ],
    }),

    // ── Get upcoming reminders ──
    getUpcomingReminders: builder.query({
      query: () => ({
        url: "/pets/reminders",
        method: "GET",
      }),
      providesTags: ["Pets"],
    }),

    // ── Find by microchip (public) ──
    findByMicrochip: builder.query({
      query: (chipNumber: string) => ({
        url: `/pets/microchip/${chipNumber}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMyPetMutation,
  useGetMyPetsQuery,
  useGetSinglePetQuery,
  useUpdatePetMutation,
  useDeletePetMutation,
  useAddHealthRecordMutation,
  useGetSingleHealthRecordQuery,
  useUpdateHealthRecordMutation,
  useDeleteHealthRecordMutation,
  useGetUpcomingRemindersQuery,
  useFindByMicrochipQuery,
} = petsApi;
