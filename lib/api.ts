import type { Note } from '../types/note.ts';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
import axios from 'axios';

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
  const response = await axios.get<FetchNotesResponse>(
    'https://notehub-public.goit.study/api/notes',
    {
      params: {
        page,
        perPage,
        search: searchText || undefined,
        tag: tag !== 'all' ? tag : undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    }
  );

  return response.data;
}

export async function createNote(noteDetails: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  const res = await axios.post<Note>(
    'https://notehub-public.goit.study/api/notes',
    noteDetails,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    }
  );

  return res.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const res = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${noteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    }
  );

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    }
  );

  return response.data;
}
