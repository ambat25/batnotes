import React, { useEffect, useState } from 'react';
import SideNav from '../components/SideNav';
import NoteEditor from '../components/NoteEditor';
import { Button, Empty } from 'antd';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { auth, logout } from "../config/firebase";
import 'antd/dist/antd.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addNote, getNotes } from '../api';
import AddNoteModal from '../components/AddNoteModal';


const Note = () => {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const { data } = useQuery(["notes"], () => getNotes(user.accessToken));

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

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

  const handleSave = (title) => addNoteMutation.mutate({ title, token: user.accessToken });

  const handleCloseModal = () => setModal(false)

  return (
    <div className='app-container'>
      <SideNav
        notes={notes}
        selectedNote={selectedNote}
        onSelect={setSelectedNote}
        onAddNote={() => setModal(true)}

      />
      <div className='main-section'>
        <div className='header'>
          <Button onClick={logout}>Logout</Button>
        </div>
        {
          selectedNote ?
            <NoteEditor  user={user} onUpdateNote={handleUpdateNote} data={{ ...selectedNote }} />
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

      </div>
      <AddNoteModal
        open={showModal}
        onSave={handleSave}
        onClose={handleCloseModal}
        saving={addNoteMutation.isLoading}
      />
    </div>
  )
}

export default Note;
