import React, {useState} from 'react'
import {v4 as uuidV4}from 'uuid';
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

const Home = () => {
    const [roomId,setRoomId] = useState();
    const [userName,setUserName] = useState();
    const navigate = useNavigate();

    const createNewRoom =(e) =>{
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success("Created a new room")
    }

    const joinRoom =(e) =>{
        if(!roomId || !userName){
            toast.error('ROOM ID or Username cannot be null')
            return;
        }

        else{
            //redirect 
            console.log(roomId)
            navigate(`/editor/${roomId}`, { 
                state:{
                    userName
                }
            })

        }
    }

    const handleInputEnter = (e) =>{
        if(e.code === 'Enter')
        joinRoom();
        
    }
    return (
    <div className= 'homePageWrapper'>
            <div className='formWrapper'>
                <img 
                    className="homePageLogo"
                    src="/code-sync.png"
                     alt="code-sync-logo"
                />
                <h4 className= "mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input 
                        type="text" 
                        className="inputBox"
                        value={roomId}
                        onChange ={(e) => setRoomId(e.target.value)}
                        placeholder ="ROOM ID"
                        onKeyUp={handleInputEnter}
                      />
                    
                    <input
                        type="text"
                        className="inputBox"
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="USERNAME"
                        value={userName}
                        onKeyUp = {handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                    <span className="createInfo">
                        If you don't have then create &nbsp;
                        <a href="" onClick={createNewRoom} className="createNewBtn">
                            Create Room
                        </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Built with 💛 by  <a href="https://github.com/vikhyat187">Vikhyat Bhatnagar </a></h4>
            </footer>
        </div>
    );
}

export default Home
