import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {WordT} from "../../components/Router/pages/UserPage/UserPage";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_LINK || 'http://localhost:8080',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('Dict_Authorization');
        if (token) {
            headers.set('Authorization', token);
        }
        return headers;
    },
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Dictionary', 'Word', 'Vote', 'User'],
    endpoints: (builder) => ({
        // ==================== Authentication Controller ====================
        login: builder.mutation<{ jwt: string }, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                await queryFulfilled;
                window.location.replace('/');
            },
        }),

        register: builder.mutation<{ jwt: string }, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/registration',
                method: 'POST',
                body: credentials,
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                await queryFulfilled;
                window.location.replace('/');
            },
        }),

        // ==================== Account Controller ====================
        renameAccount: builder.mutation<void, { new_name: string }>({
            query: ({ new_name }) => ({
                url: '/rename',
                method: 'PATCH',
                params: { new_name },
            }),
            invalidatesTags: ['User'],
        }),

        changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
            query: (body) => ({
                url: '/change/pass',
                method: 'PATCH',
                body,
            }),
        }),

        deleteAccount: builder.mutation<void, void>({
            query: () => ({
                url: '/delete',
                method: 'DELETE',
            }),
        }),

        // ==================== Home Controller ====================
        getCurrentUser: builder.query<{
            id: number;
            username: string;
            createdAt: string;
        }, void>({
            query: () => '/me',
            providesTags: ['User'],
        }),

        getUserDictionaries: builder.query<Array<{
            id: string;
            name: string;
            owner: number;
        }>, void>({
            query: () => '/home',
            providesTags: ['Dictionary'],
        }),

        // ==================== Dictionary Controller ====================
        createDictionary: builder.mutation<{
            id: string;
            name: string;
            owner: number;
        }, { name: string; owner: number }>({
            query: (body) => ({
                url: '/dict',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Dictionary'],
        }),

        deleteDictionary: builder.mutation<void, { dictId: string }>({
            query: (body) => ({
                url: '/dict',
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['Dictionary'],
        }),

        renameDictionary: builder.mutation<void, { newName: string; dictId: string }>({
            query: (body) => ({
                url: '/dict',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Dictionary'],
        }),

        getSharedDictionary: builder.query<{
            id: string;
            name: string;
            owner: number;
        }, { dict_id: string }>({
            query: ({ dict_id }) => ({
                url: '/dict/shared',
                params: { dict_id },
            }),
        }),

        getAllDictionaries: builder.query<Array<{
            id: string;
            name: string;
            owner: number;
        }>, void>({
            query: () => '/dict/all',
            providesTags: ['Dictionary'],
        }),

        // ==================== Dictionary Words Operations ====================
        addWordsToDictionary: builder.mutation<void, {
            dictId: string;
            words: WordT[];
        }>({
            query: (body) => ({
                url: '/dict/add/words',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Word'],
        }),


        getDictionary: builder.query<{
            id: string;
            name: string;
            owner: number;
            words: WordT[];
        }, { dict_id: string }>({
            query: ({ dict_id }) => ({
                url: `/dict/${dict_id}`,
            }),
            providesTags: ['Dictionary'],
        }),



        getDictionaryWords: builder.query<Array<{
            id: number;
            value: string;
            translate: string;
        }>, { dict_id: string }>({
            query: ({ dict_id }) => ({
                url: '/dict/words',
                params: { dict_id },
            }),
            providesTags: ['Word'],
        }),

        findDictionaryWords: builder.query<Array<{
            id: number;
            value: string;
            translate: string;
        }>, {
            starts_with?: string;
            by_translate?: boolean;
            dict_id: string;
        }>({
            query: ({ starts_with, by_translate = false, dict_id }) => ({
                url: '/dict/find/words',
                params: { starts_with, by_translate, dict_id },
            }),
        }),

        getExcludedWords: builder.query<Array<{
            id: number;
            value: string;
            translate: string;
        }>, {
            page: number;
            items_per_page: number;
            dict_id: string;
        }>({
            query: ({ page, items_per_page, dict_id }) => ({
                url: '/dict/find/excluded-words',
                params: { page, items_per_page, dict_id },
            }),
        }),

        deleteWordsFromDictionary: builder.mutation<void, {
            dictId: string;
            words: WordT[];
        }>({
            query: (body) => ({
                url: '/dict/delete/words',
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['Word'],
        }),

        // ==================== Word Controller ====================
        getAllWords: builder.query<Array<{
            id: number;
            value: string;
            translate: string;
        }>, void>({
            query: () => '/words',
            providesTags: ['Word'],
        }),

        createWord: builder.mutation<void, {
            id: number;
            value: string;
            translate: string;
            examples?: string;
        }>({
            query: (body) => ({
                url: '/words',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Word'],
        }),

        searchWordsByTranslation: builder.query<Array<{
            id: number;
            value: string;
            translate: string;
        }>, {
            starts_with: string;
            by_translate?: boolean;
        }>({
            query: ({ starts_with, by_translate = false }) => ({
                url: '/words/find/translate-value',
                params: { starts_with, by_translate },
            }),
        }),

        getWordsPaginated: builder.query<Array<{
            id: number;
            value: string;
            translate: string;
        }>, {
            page: number;
            items_per_page: number;
        }>({
            query: ({ page, items_per_page }) => ({
                url: '/words/find/all/pagination',
                params: { page, items_per_page },
            }),
        }),

        // ==================== Voter Controller ====================
        getVotes: builder.query<Array<{
            id: number,
            word: string;
            translate: string;
            link: string;
            votesFor: number;
            voters: number[]
            votesAgainst: number;
            decisionTime: string;
            status: string;
        }>, void>({
            query: () => '/votes',
            providesTags: ['Vote'],
        }),

        createVote: builder.mutation<void, {
            word: string;
            translate: string;
            link: string;
        }>({
            query: (body) => ({
                url: '/votes',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Vote'],
        }),

        updateVote: builder.mutation<void, {
            id: number;
            against: boolean;
        }>({
            query: ({ id, against }) => ({
                url: `/votes/${id}`,
                method: 'PATCH',
                params: { against },
            }),
            invalidatesTags: ['Vote'],
        }),

        // ==================== Quizlet Controller ====================
        getQuizletCards: builder.query<Array<{
            isAnswer: boolean;
            translate: string;
            value: string;
        }>, void>({
            query: () => '/quizlet',
        }),

        // ==================== Moderation Controller ====================
        getModerationCards: builder.query<Array<{
            word: string;
            translate: string;
            link: string;
            votesFor: number;
            votesAgainst: number;
            decisionTime: string;
            status: string;
        }>, void>({
            query: () => '/moderation/cards',
        }),

        deleteModerationCard: builder.mutation<void, number>({
            query: (id) => ({
                url: '/moderation',
                method: 'DELETE',
                body: id,
            }),
        }),
    }),
});

// Export all hooks for components
export const {
    // Auth
    useLoginMutation,
    useRegisterMutation,

    // Account
    useRenameAccountMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,

    // User
    useGetCurrentUserQuery,

    // Dictionaries
    useGetUserDictionariesQuery,
    useCreateDictionaryMutation,
    useDeleteDictionaryMutation,
    useRenameDictionaryMutation,
    useGetSharedDictionaryQuery,
    useGetAllDictionariesQuery,
    useGetDictionaryQuery,

    // Dictionary Words
    useAddWordsToDictionaryMutation,
    useGetDictionaryWordsQuery,
    useFindDictionaryWordsQuery,
    useGetExcludedWordsQuery,
    useDeleteWordsFromDictionaryMutation,

    // Words
    useGetAllWordsQuery,
    useCreateWordMutation,
    useSearchWordsByTranslationQuery,
    useGetWordsPaginatedQuery,

    // Votes
    useGetVotesQuery,
    useCreateVoteMutation,
    useUpdateVoteMutation,

    // Quizlet
    useGetQuizletCardsQuery,

    // Moderation
    useGetModerationCardsQuery,
    useDeleteModerationCardMutation,
} = api;