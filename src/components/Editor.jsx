import React, {useEffect, useRef} from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/hint/anyword-hint.js'
import ACTIONS from '../actions.js'

const Editor = ({socketRef, roomId}) => {
    const editorRef = useRef(null);
    useEffect(() =>{
        async function init(){
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                lineNumbers: true,
                mode : {name:'javascript', json:true},
                theme: 'dracula',
                autoCloseTags:true,
                autoCloseBrackets:true,
            });
            editorRef.current.on('change',(instance,changes) =>{
                console.log('changes',changes);
                const {origin} = changes;
                const code = instance.getValue();
                if(origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                        roomId,
                        code,
                    });
                }
                // console.log(code);
            })
            
        }
        init();
    },[]);

    //only to call once while initialisation
    useEffect(() => {
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
            console.log('inside event');
            if(code !== null){
                editorRef.current.setValue(code);
            }
        })
    },[socketRef])

    return <textarea id = "realtimeEditor"></textarea>
}

export default Editor
