import React from 'react';
import Download from '../icons/download';

const DownloadButton = ({ onClick, children }: any) => (
    <button
        className="text-gray-900 text-md font-bold bg-blue-400 hover:bg-blue-500 rounded flex p-2 drop-shadow-md justify-center items-center"
        type="button"
        onClick={onClick}
    >
        <div><Download/></div>
        {' '}
        <div>
            {children}
        </div>
    </button>
);

export default DownloadButton;