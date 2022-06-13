import React from 'react'
import { useState,useRef,useEffect } from 'react';
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket';
import {useNavigate, useLocation,useParams,Navigate} from 'react-router-dom'
import ACTIONS from '../actions.js'
import toast from 'react-hot-toast';

const EditorPage = () => {
    const socketRef = useRef(null);
    const reactNavigator = useNavigate();
    const location = useLocation();
    const {roomId} = useParams();
    const [clients,setClients] = useState([]);

    useEffect(() =>{
        async function init(){
            socketRef.current = await initSocket();
            socketRef.current.on("connection_error",(err) => handleErrors(err));
            socketRef.current.on("connection_failed" ,(err) => handleErrors(err));

            function handleErrors(e){
                console.log('server error',e);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/')
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                userName: location?.state.userName,
            });

            //listening for joined event except for self account
            socketRef.current.on(
                ACTIONS.JOINED,
                ({clients, username, socketId}) =>{
                    if(username !== location.state?.username){
                        toast.success(`${username} joined `)
                        console.log(`${username}  joined.`)
                    }
                    console.log("clients are ", clients);
                    setClients(clients);
                }
            )
            //listening on disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({socketId, username}) =>{
                    toast.success(`${username} has left the room. `); 
                    setClients((prev) =>{
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        ); 

                    });
                    
                })
        };
        init();
        //clear listeners or else memory leak happens
        return ()=>{
            //side effect cleanup
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    },[]);
    const {state} = useLocation();
    const {userName} = state;
  
    if(!location.state){
        return <Navigate to="/"/>;
    }       

    function leaveRoom(){
        reactNavigator('/')
        console.log(`${location.state?.userName} left the room`)
    }

  async function CopyToClipboard (){
        try{
           await navigator.clipboard.writeText(roomId);
           toast.success("Room Id has been copied to your clipboard");
            console.log(navigator.clipboard.readText())
        }
        catch(err){
            toast.error("Could not copy Room Id");
            console.log("error occured");
        }
      
    }
    return (
        <div className = "mainWrap">
            <div className="aside">
                <div className= "asideInner">
                    <div className= "logo">
                        <img className = "logoImage" src="/code-sync.png" alt="logo this side" />    
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) =>(
                            <Client 
                            key={client.socketId}
                            userName = {client.username}/>
                        ))}
                    </div>
                </div>
                <button className="btn copybtn" onClick ={CopyToClipboard }>Copy ROOM ID</button>
                <button className="btn leavebtn" onClick={leaveRoom}>Leave</button>
            </div>
            <div className="editorwrap">
                <Editor socketRef = {socketRef} roomId = {roomId}/>
            </div>
        </div>
    ); 
}

export default EditorPage
