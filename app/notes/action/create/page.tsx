import css from './CreateNote.module.css';
import type { Metadata } from 'next';
import NoteForm from '../../../../components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description:
    'Quickly create new note in Notehub - the efficient app for organizing your thoughts and ideas.',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description:
      'Quickly create new note in Notehub - the efficient app for organizing your thoughts and ideas.',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Create New Note | NoteHub',
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
