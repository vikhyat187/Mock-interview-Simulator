import React from 'react'
import { useState } from 'react';
import { useLocation } from 'react-router-dom'
import Client from '../components/Client'
import Editor from '../components/Editor'


const EditorPage = () => {
    const {state} = useLocation();
    const {userName} = state;
    const [clients,setClients] = useState([
        {socketId:1 ,userName:"vikhyat"},
        {socketId:2 ,userName:"Rakesh K"}
    ]);

    return (
        <div className = "mainWrap">
            <div className="aside">
                <div className= "asideInner">
                    <div className= "Logo">
                        <img className = "logoImage" src="/code-sync.png" alt="logo this side" />    
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) =>(
                            <Client 
                            key={client.socketId}
                            userName = {client.userName}/>
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn">Copy ROOM ID</button>
                <button className="btn leaveBtn">Leave</button>
            </div>
            <div className="editorwrap">
                <Editor/>
            </div>
        </div>
    ); 
}

export default EditorPage
