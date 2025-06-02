import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, AtomicBlockUtils, ContentBlock } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { FaBold, FaItalic, FaLink, FaListOl, FaListUl, FaStrikethrough, FaUnderline } from 'react-icons/fa';
import { MdHorizontalRule } from "react-icons/md";

type RichTextEditorProps = {
  initialContent: EditorState;
  onChange: (rawContent: EditorState) => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialContent, onChange }) => {
  const [editorState, setEditorState] = useState(() =>
    initialContent
  );

  //  const focusEditor = () => editorRef.current?.focus();

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    onChange(state);
  };

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const insertLink = () => {
    const url = prompt('Enter URL');
    if (!url) return;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    const selection = newEditorState.getSelection();
    const newState = RichUtils.toggleLink(newEditorState, selection, entityKey);
    setEditorState(newState);
  };

  const insertHorizontalRule = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('HR', 'IMMUTABLE', {});
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    setEditorState(newEditorState);
  };

  const blockRendererFn = (block: ContentBlock) => {
    if (block.getType() === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entity = contentState.getEntity(block.getEntityAt(0));
      if (entity.getType() === 'HR') {
        return {
          component: () => <hr className="my-4 border-t" />,
          editable: false,
        };
      }
    }
    return null;
  };

  return (
    <div className="border border-base-content/20 rounded">
      <div className="p-3 border-b border-base-content/20 flex gap-3">
        <button onClick={() => toggleInlineStyle('BOLD')} className="btn btn-sm btn-square">
          <FaBold className='size-4' />
        </button>
        <button onClick={() => toggleInlineStyle('ITALIC')} className="btn btn-sm btn-square">
          <FaItalic className='size-4' />
        </button>
        <button onClick={() => toggleInlineStyle('UNDERLINE')} className="btn btn-sm btn-square">
          <FaUnderline className='size-4' />
        </button>
        <button onClick={() => toggleInlineStyle('STRIKETHROUGH')} className="btn btn-sm btn-square">
          <FaStrikethrough className='size-4' />
        </button>
        <button onClick={() => toggleBlockType('unordered-list-item')} className="btn btn-sm btn-square">
          <FaListUl className='size-4' />
        </button>
        <button onClick={() => toggleBlockType('ordered-list-item')} className="btn btn-sm btn-square">
          <FaListOl className='size-4' />
        </button>
        <button onClick={insertLink} className="btn btn-sm btn-square">
          <FaLink className='size-4' />
        </button>
        <button onClick={insertHorizontalRule} className="btn btn-sm btn-square">
          <MdHorizontalRule className='size-4' />
        </button>
      </div>
      <div className="p-3 min-h-72 cursor-text text-base" onClick={() => editorRef.current?.focus()}>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          blockRendererFn={blockRendererFn}
          ref={(ref) => (editorRef.current = ref)}
        />
      </div>
    </div>
  );
};

const editorRef = { current: null as null | Editor };

export default RichTextEditor;
