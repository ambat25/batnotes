import React, { useEffect, useState } from 'react';
import SideNav from './components/SideNav';
import NoteEditor from './components/NoteEditor';

import './App.css';
import 'material-icons/iconfont/material-icons.css';
import 'antd/dist/antd.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@tanstack/react-query';
import { getNotes } from './api';


const App = () => {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const { data } = useQuery(["notes"],getNotes);

  useEffect(() => {
    if(data?.data) {
      setNotes(data?.data)
    }
  }, [data]);

  const handleUpdateNote = (data) => {
    setSelectedNote(data);
    setNotes(notesList => notesList.map(noteItem => noteItem._id === data._id ? data : noteItem));
  }
  return (
    <div className='app-container'>
      <SideNav
        notes={notes}
        selectedNote={selectedNote}
        onSelect={setSelectedNote}
      />
      <NoteEditor onUpdateNote={handleUpdateNote} data={{ ...selectedNote }} />
    </div>
  )
}

export default App;
