import {useState, useEffect} from 'react'
import noteService from './services/notes'
import Note from './components/Note'

const Notification = ({message}) => {
  if(message === null) {
    return null
  } 
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Dpartment of Computer Science, University of Oulu 2024</em>
    </div>
  )
}

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note check 2')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    console.log('effect')
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        console.log('error: ', error)
        setErrorMessage(`the note '${note.content}' was already deleted from server`)
        setTimeout(() => {setErrorMessage(null)}, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    noteService
      .create({
        content: newNote,
        important: Math.random() < 0.5
      })
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll 
    ? notes
    : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}  
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App