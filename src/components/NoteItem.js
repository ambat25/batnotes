import React from 'react'

const NoteItem = ({
  title = '',
  content = '[]',
  active = false,
  onSelect = () => null,
  ...rest
}) => {
  return (<div onClick={onSelect} className={`note-item ${active ? 'selected-note' : ''}`} >
    <div className='title'>
      {title}
    </div>
    <div className='content'>
      {content ? JSON.parse(content)?.[0]?.children?.[0]?.text : ''}
    </div>
  </div>)
}

export default NoteItem;