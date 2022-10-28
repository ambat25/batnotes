import React, { useEffect, useState } from 'react';
import SideNav from './components/SideNav';
import NoteEditor from './components/NoteEditor';
import { Button, Empty } from 'antd';

import './App.css';
import 'material-icons/iconfont/material-icons.css';
import 'antd/dist/antd.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addNote, getNotes } from './api';
import AddNoteModal from './components/AddNoteModal';


const App = () => {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const { data } = useQuery(["notes"], getNotes);

  useEffect(() => {
    if (data?.data) {
      setNotes(data?.data)
    }
  }, [data]);

  const handleUpdateNote = (data) => {
    setSelectedNote(data);
    setNotes(notesList => notesList.map(noteItem => noteItem._id === data._id ? data : noteItem));
  }

  const [showModal, setModal] = useState(false)

  const addNoteMutation = useMutation(addNote, {
    onSuccess: (createdNote) => {
      setSelectedNote(createdNote);
      setNotes(list => ([createdNote, ...list]));
      setModal(false);
    },
  })

  const handleSave = (title) => addNoteMutation.mutate({ title });

  const handleCloseModal = () => setModal(false)

  return (
    <div className='app-container'>
      <SideNav
        notes={notes}
        selectedNote={selectedNote}
        onSelect={setSelectedNote}
        onAddNote={() => setModal(true)}

      />
      {
        selectedNote ?
          <NoteEditor onUpdateNote={handleUpdateNote} data={{ ...selectedNote }} />
          :
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            description={
              <span>
                No note selected
              </span>
            }
          >
            <Button onClick={() => setModal(true)} type="primary">Create Note</Button>
          </Empty>
      }
      <AddNoteModal
        open={showModal}
        onSave={handleSave}
        onClose={handleCloseModal}
        saving={addNoteMutation.isLoading}
      />
    </div>
  )
}

export default App;
