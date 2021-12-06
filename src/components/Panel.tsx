import React from 'react';

const Panel = ({children, header} : any) => (
      <div className="text-white">
          <p className="text-lg font-bold text-center">{header}</p>
          {children}
      </div>
)

export default Panel;