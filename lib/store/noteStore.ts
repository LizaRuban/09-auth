import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NoteDetails {
  title: string;
  content: string;
  tag: string;
}

type NoteDraftStore = {
  draft: NoteDetails;
  setDraft: (note: Partial<NoteDetails>) => void;
  clearDraft: () => void;
};

const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

const getInitialDraft = (): NoteDetails => initialDraft;

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: getInitialDraft(),
      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),
      clearDraft: () => set(() => ({ draft: getInitialDraft() })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
