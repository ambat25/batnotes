import { Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'

export default function AddNoteModal({ open, saving, onSave, onClose }) {
  const [noteName, setNoteName] = useState('');
  useEffect(() => setNoteName(''), [open])
  return (
    <Modal
      title="New Note"
      open={open}
      onOk={() => noteName ? onSave(noteName) : null}
      okButtonProps={{ disabled: !noteName }}
      okText="Save"
      closable={false}
      cancelText="Close"
      onCancel={onClose}
      confirmLoading={saving}
    >
      <label>Note Name</label>
      <Input value={noteName} onChange={e => setNoteName(e.target.value)} placeholder="My Note" />
    </Modal>
  )
}
