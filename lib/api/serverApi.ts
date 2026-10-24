import 'server-only';

import axios from 'axios';
import { cookies } from 'next/headers';

import type { User } from '@/types/user';
import { Note } from '@/types/note';

const baseURL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error('API_URL is not configured');
}

const nextServer = axios.create({
  baseURL: `${baseURL}/api`,
});

export const checkSession = async (cookieHeader?: string): Promise<boolean> => {
  const cookieStore = cookieHeader ?? (await cookies()).toString();

  const response = await nextServer.get<{ success: boolean }>('/auth/session', {
    headers: {
      Cookie: cookieStore,
    },
  });

  return response.data.success === true;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  searchText: string,
  tag: string,
  page: number,
  perPage: number
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    headers: {
      Cookie: cookieStore.toString(),
    },
    params: {
      page,
      perPage,
      search: searchText || undefined,
      tag: tag !== 'all' ? tag : undefined,
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};
