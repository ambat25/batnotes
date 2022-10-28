import React, { useCallback, useEffect, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { ToastContainer, toast } from 'react-toastify';
import debounce from 'lodash.debounce'
import 'react-toastify/dist/ReactToastify.css';

import { EditorButton, EditorIcon, Toolbar } from './EditorComponents'
import { updateNote } from '../api'
import { useMutation } from '@tanstack/react-query'
const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
export default function NoteEditor({ data, onUpdateNote }) {
  const [noteValue, setNoteValue] = useState([{
    type: 'paragraph',
    children: [{ text: '' }]
  }]);
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const updateNoteMutation = useMutation(updateNote, {
    onSuccess: () => {
      toast.success("note saved", { position: "bottom-right" })
      onUpdateNote({...data, content: JSON.stringify(noteValue)})
    },
  })

  useEffect(() => {
    if(data?._id){
      const newNoteValue = JSON.parse(data.content)
      setNoteValue(newNoteValue)
    }
  }, [data]);

  const handleDebounceFn = (noteContent, d) => updateNoteMutation.mutate({ ...d, content: JSON.stringify(noteContent) });
  
  // eslint-disable-next-line
  const debounceFn = useCallback(debounce(handleDebounceFn, 2000), []);
  
  editor.children = noteValue
  return (
    <>
      <Slate
        editor={editor}
        value={noteValue}
        onChange={value => {
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) setNoteValue(value)
        }}
      >
        <div className='editor-section'>
          <header>
            <h1 className='title'>
              {data?.title}
            </h1>
            <Toolbar>
              <MarkButton format="bold" icon="format_bold" />
              <MarkButton format="italic" icon="format_italic" />
              <MarkButton format="underline" icon="format_underlined" />
              <MarkButton format="code" icon="code" />
              <BlockButton format="heading-one" icon="looks_one" />
              <BlockButton format="heading-two" icon="looks_two" />
              <BlockButton format="block-quote" icon="format_quote" />
              <BlockButton format="numbered-list" icon="format_list_numbered" />
              <BlockButton format="bulleted-list" icon="format_list_bulleted" />
              <BlockButton format="left" icon="format_align_left" />
              <BlockButton format="center" icon="format_align_center" />
              <BlockButton format="right" icon="format_align_right" />
              <BlockButton format="justify" icon="format_align_justify" />
            </Toolbar>
          </header>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            contentEditable
            placeholder="Enter your note content"
            spellCheck
            autoFocus
            value={noteValue}
            className='editor'
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  toggleMark(editor, mark)
                }
              }
            }}
            onKeyUp={() => debounceFn(noteValue, data)}
          />

        </div>
      </Slate>
      <ToastContainer
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={false}
        theme="light"
        style={{
          width: 'auto'
        }}
      />
    </>
  )
}



const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <EditorButton
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <EditorIcon>{icon}</EditorIcon>
    </EditorButton>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <EditorButton
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <EditorIcon>{icon}</EditorIcon>
    </EditorButton>
  )
}
