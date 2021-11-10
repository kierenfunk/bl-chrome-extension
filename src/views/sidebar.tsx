import React from 'react';
import ReactDOM from 'react-dom';
import '../style.css';
//import "tailwindcss/tailwind.css"

const Sidebar = () => (
    <div>
        <div><button className="bg-red-200 rounded">button</button></div>
        <div>test</div>
    </div>
)

const div = document.createElement('div');
div.id = 'sidebar'
document.body.appendChild(div);

ReactDOM.render(<Sidebar/>, document.getElementById('sidebar'));