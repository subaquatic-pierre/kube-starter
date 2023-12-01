import { useState } from 'react';

// next
import dynamic from 'next/dynamic';

// third party
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

// ==============================|| QUILL EDITOR ||============================== //

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const ReactQuillEditor: React.FC<Props> = ({ content, setContent }) => {
  const handleChange = (value: string) => {
    setContent(value);
  };

  return <ReactQuill value={content} onChange={handleChange} />;
};

export default ReactQuillEditor;
