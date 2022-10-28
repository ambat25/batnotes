import React, { useState } from 'react'
import NoteItem from './NoteItem'
import { Button } from 'antd';
import AddNoteModal from './AddNoteModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNote } from '../api';

export default function SideNav({
  onSelect = () => null,
  notes = [],
  selectedNote = {},
}) {
  const [showModal, setModal] = useState(false)

  const queryClient = useQueryClient()
  const addNoteMutation = useMutation(addNote, {
    onSuccess: (createdNote) => {
      onSelect(createdNote)
      queryClient.invalidateQueries(['notes'])
      setModal(false);
    },
  })

  const handleSave = (title) => addNoteMutation.mutate({ title });

  const handleCloseModal = () => setModal(false)
  return (
    <div className='note-list'>
      <Button type="primary" onClick={() => setModal(true)}>
        New Note
      </Button>
      <AddNoteModal
        open={showModal}
        onSave={handleSave}
        onClose={handleCloseModal}
        saving={addNoteMutation.isLoading}
      />
      {
        notes.map(noteData => (
          <NoteItem
            {...noteData}
            onSelect={() => onSelect(noteData)}
            active={noteData?._id === selectedNote?._id}
            key={noteData?._id}
          />
        ))
      }
    </div>
  )
}
