import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const CONNECTION_PORT = 'localhost:3001/'
let socket

function App() {

  //Before Login
  const [loggedIn, setLoggedIn] = useState(false)
  const [room, setRoom] = useState('')
  const [userName, setUserName] = useState('')

  //After Login
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    socket = io(CONNECTION_PORT)
  }, [CONNECTION_PORT])

  useEffect(() => {
    socket.on('receive_message', data => {
      console.log(data);
      setMessageList([...messageList, data])
    })
  })

  const connectToRoom = () => {
    socket.emit('join_room', room)
    setLoggedIn(true)
  }

  const sendMessage = async () => {
    const messageContent = {
      room,
      content: {
        author: userName,
        message
      }
    }

    await socket.emit('send_message', messageContent)
    setMessageList([...messageList, messageContent.content])
    setMessage('')
  }

  return (
    <div className="App">
      {!loggedIn ? (
        <div className='logIn'>
          <div className='inputs'>
            <input
              type="text" 
              placeholder='Name...'
              onChange={e => setUserName(e.target.value)}
              />
            <input 
              type="text" 
              placeholder='Room...'
              onChange={e => setRoom(e.target.value)}
              />
          </div>
          <div className='button'>
            <button onClick={connectToRoom}>ВОЙТИ</button>
          </div>
        </div>
      ): (
        <div className='chatContainer'>
          <div className='messages'>
            {messageList.map((val, key) => 
              <div className='messageContainer' key={key} id={val.author === userName ? 'You' : 'Other'}>
                <div className='messageIndividual' > 
                  {val.author}: {val.message} 
                </div>
              </div>
            )}
          </div>
          <div className='messageInputs'>
            <input 
              type="text" 
              placeholder='Message...'
              onChange={e => setMessage(e.target.value)}
              />
            <button onClick={sendMessage}>SEND</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
