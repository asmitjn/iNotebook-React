import { useState } from "react";
import noteContext from "./NoteContext";

const NoteState=(props)=>{ 
  const host="http://localhost:5000"
    const notesInitial=[]
     const [notes,setNotes]=useState(notesInitial)

     //Get all notes
    const getnotes = async()=>{
       //API CALL
     const response = await fetch(`${host}/api/notes/fetchallnotes`, {
       method: 'GET', 
       headers: {
         'Content-Type': 'application/json',
         'auth-token':localStorage.getItem("token")
       },
     });
      const json=await response.json()
      setNotes(json)
    }
     //Add a note
    const addNote= async(title,description,tag)=>{
       //To-Do:API CALL
        //API CALL
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token':localStorage.getItem("token")
        },
        body: JSON.stringify({title,description,tag}) 
      });

      const note = await response.json();
      setNotes(notes.concat(note))
     }

     //Delete a note
     const deletenote= async (id)=>{
       //TO-DO: API CALL

       const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token':localStorage.getItem("token")
        },
      });
      const json= response.json();
      console.log(json)
      const newNotes=notes.filter((note)=>{return note._id!==id})
      setNotes(newNotes)
     }

     //Edit a note
    const editnote= async (id,title,description,tag)=>{
      //API CALL
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'auth-token':localStorage.getItem("token")
        },
        body: JSON.stringify({title,description,tag}) 
      });
      const json= await response.json();
      console.log(json)

      let newNotes=JSON.parse(JSON.stringify(notes))
      //LOGIC to edit in client
      for (let index = 0; index < notes.length; index++) {
        const element = newNotes[index];
        if(element._id===id){
          notes[index].title=title;
          notes[index].description=description;
          notes[index].tag=tag;
          break; 
        }
      }
      setNotes(newNotes);
    }
    return (
        <noteContext.Provider value={{notes,setNotes,addNote,deletenote,editnote,getnotes}} >
            {props.children}
        </noteContext.Provider>
    )
    }

export default NoteState