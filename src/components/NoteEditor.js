import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce'
import 'react-toastify/dist/ReactToastify.css';

import { updateNote } from '../api'
import { useMutation } from '@tanstack/react-query'

export default function NoteEditor({ data, onUpdateNote, user }) {
  const [noteValue, setNoteValue] = useState('');

  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: (r) => {
      toast.success("note saved", { position: "bottom-right" })
      onUpdateNote({ ...data, ...r, content: noteValue })
    },
  })

  useEffect(() => {
    if (data?._id) {
      const newNoteValue = data.content;
      setNoteValue(newNoteValue)
    }
  }, [data]);

  const handleDebounceFn = (noteContent, d) => updateNoteMutation.mutate({
    ...d,
    content: noteContent,
    token: user.accessToken
  });

  // eslint-disable-next-line
  const debounceFn = useCallback(debounce(handleDebounceFn, 1500), []);

  return (
    <div className='editor-section'>
      <header>
        <h1 className='title'>
          {data?.title}
        </h1>
      </header>
      <textarea
        className='editor'
        value={noteValue}
        onChange={({ target: { value } }) => setNoteValue(value)}
        onKeyUp={() => debounceFn(noteValue, data)}
      />
    </div>
  )
}

