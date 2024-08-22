import React, { useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const CodeSnippet = ({
  code,
  width,
  showCopyButton = true,
}: {
  code: any;
  width: string;
  showCopyButton?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={`bg-black text-white pt-4 px-8 pb-8 rounded-lg font-mono text-sm ${width}`}
    >
      <pre className="whitespace-pre-wrap overflow-x-auto relative">
        <code>{code}</code>
        {showCopyButton && (
          <div className="flex justify-end absolute top-0 right-0">
            <CopyToClipboard text={code} onCopy={() => setCopied(true)}>
              <button
                className={`mt-2 text-xs ${copied ? 'bg-green-200' : 'bg-white'} text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </CopyToClipboard>
          </div>
        )}
      </pre>
    </div>
  );
};

export default CodeSnippet;
