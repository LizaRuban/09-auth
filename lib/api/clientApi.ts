import { User } from '@/types/user.js';
import type { Note } from '../../types/note.js';
import { nextServer } from './api';
// const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
// import axios from 'axios';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  searchText: string,
  tag: string,
  page: number,
  perPage: number
): Promise<FetchNotesResponse> {
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search: searchText || undefined,
      tag: tag !== 'all' ? tag : undefined,
    },
  });

  return response.data;
}

export async function createNote(noteDetails: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', noteDetails);

  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${noteId}`);

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);

  return response.data;
}

interface RegisterRequest {
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await nextServer.post<User>('/auth/register', data);

  return response.data;
};

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await nextServer.post<User>('/auth/login', data);

  return response.data;
};

export const checkSession = async (): Promise<boolean> => {
  const response = await nextServer.get<{ success: boolean }>('/auth/session');

  return response.data.success === true;
};

export const getMe = async (): Promise<User> => {
  const response = await nextServer.get<User>('/users/me');

  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

interface UpdateMeRequest {
  username: string;
}

export const updateMe = async (data: UpdateMeRequest): Promise<User> => {
  const response = await nextServer.patch<User>('/users/me', data);

  return response.data;
};
