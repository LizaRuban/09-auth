import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { Metadata } from 'next';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api/clientApi';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  return {
    title: `Notes - ${tag}`,
    description: `Browse notes tagged with ${tag}. Notehub allows you to filter and view notes based on specific tags.`,
    openGraph: {
      title: `Notes - ${tag}`,
      description: `Browse notes tagged with ${tag}. Notehub allows you to filter and view notes based on specific tags.`,
      url: `http://localhost:3000/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes - ${tag} | NoteHub`,
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const tag = slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', tag, 1],
    queryFn: () => fetchNotes('', tag, 1, 12),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag} tag={tag} />
    </HydrationBoundary>
  );
}
