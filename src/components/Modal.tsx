import React from 'react';

const Modal = ({children}: any) => (
    <div className="fixed h-screen w-screen top-0 left-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
        <div className="fixed top-0 left-0 bg-black opacity-80 h-full w-full" style={{ zIndex: 0 }}></div>
        <div className="text-black bg-gray-100 rounded" style={{ zIndex: 1 }}>
            <div className="flex flex-col h-full w-full">
              {children}
            </div>
        </div>
    </div>
)

export default Modal;