import React from 'react';
import { CopyBlock } from 'react-code-blocks';

function MyCodeComponent() {
  const code=`print(hello world)`
  return (
    <CopyBlock
      text={code}
      language={'python'}
      showLineNumbers={true}
      wrapLines
    />
  );
}

export default MyCodeComponent;
