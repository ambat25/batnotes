import React from 'react'
import NoteItem from './NoteItem'
import { Button } from 'antd';

export default function SideNav({
  onAddNote = () => null,
  onSelect = () => null,
  notes = [],
  selectedNote = {},
}) {
  return (
    <div className='note-list'>
      <Button type="primary" onClick={() => onAddNote(true)}>
        New Note
      </Button>
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
