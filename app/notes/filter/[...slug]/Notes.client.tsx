'use client';

import css from './NotesPage.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Note } from '@/types/note';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { fetchNotes } from '@/lib/api/clientApi';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 1000);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search, tag, currentPage],
    queryFn: () => fetchNotes(search, tag, currentPage, 12),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (search && !isLoading && totalPages === 0) {
      toast.error('No notes found for your request.');
    }
  }, [search, isLoading, totalPages]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value)
          }
        />

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            setPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}
