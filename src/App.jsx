import { useState } from 'react'
import './App.css'
import axios from 'axios'
import RichResponse from './components/RichResponse'

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("HELLO!, THIS IS MINI-GEMINI, ASK ME ANYTHING!")
  const [isLoading, setIsLoading] = useState(false)

  async function generateAnswer() {

    //CHECK IF QUESTION IS EMPTY OR WHITESPACE
    if (!question.trim()) {
      setAnswer("Hey! I need some text in the box before i can generate an answer. ")
      return;
    }

    setIsLoading(true)
    setAnswer("Loading...")

    const contents = [
      { 
        "parts": [
          { "text": "You are a helpful and slightly quirky cartoon assistant. Please format your response clearly using Markdown, including lists, tables, and code blocks where appropriate. Use an enthusiastic and friendly tone, and maybe a silly catchphrase." }
        ]
      },
      { "parts": [ { "text": question } ] }
    ] 

    try {
      const apiKey = "AIzaSyCHPEoiEXXEqNkg3OWfOkBPDKt9_YdUcE8";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await axios({
        url: apiUrl,
        method: "post",
        // data: { "contents": contents },
        data: { "contents": [ { "parts": [ { "text": question } ] } ] },
      })

      const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldn't generate an answer."
      setAnswer(responseText)
    
    } catch (error) {
      console.log("API call error:", error)
      setAnswer("An error occurred while fetching the answer.")
      } finally {
        setIsLoading(false);
      }  
      // try {
      // const response = await axios({
      //   url:  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCHPEoiEXXEqNkg3OWfOkBPDKt9_YdUcE8",
      //   method: "post",
      //   data: { "contents": [ { "parts": [ { "text": question } ] } ] },
      // })
  }

  //check if button should be disable
  const isButtonDisabled = isLoading || !question.trim();
    

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl min-h-screen">
      
    <h1 className="text-center mb-8">WELCOME TO MINI-GEMINI</h1>

    <div className="w-full flex flex-col items-center gap-6 mb-12">

    <textarea 
      value={question} 
      onChange={(e) => setQuestion(e.target.value)} 
      disabled={isLoading}
      placeholder="Ask me anything..."
      rows="6"
      className="
          textarea-focus
          p-5 text-white w-full max-w-2xl text-lg 
          rounded-[20px] bg-[#2a2240] border-4 border-[#ffcc00] 
          focus:border-[#ff9900] transition-all duration-300 shadow-[8px_8px_0_0_#8b0000] 
          resize-none font-cartoon-text
          disabled:opacity-75 disabled:cursor-not-allowed"
      // className="
      // textarea-glow
      // p-5 text-white w-full max-w-2xl text-lg rounded-xl bg-[#2a2240] border-4 border-[#ffcc00]
      // focus:border-[#ff9900] transition-all duration-300 shadow-inner shadow-black/50
      // resize-none
      // "
    ></textarea>

    <button onClick={generateAnswer}
      disabled={isButtonDisabled} 
      className={`
          button-vibrate-on-hover
          flex items-center space-x-2
          px-10 py-3 text-2xl font-black rounded-full text-black transition-all duration-150
          font-cartoon-text tracking-wider border-4 border-black
          ${isButtonDisabled 
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-[5px_5px_0_0_#4b4b4b]' // Disabled state cartoon shadow
          : 'bg-[#ffcc00] hover:bg-[#ff9900] shadow-[8px_8px_0_0_#8b0000] active:translate-x-2 active:translate-y-2 active:shadow-none'
          }
        `}
      // className={`
      //  button-vibrate-on-hover
      //  flex items-center space-x-2
      //  px-10 py-3 text-xl font-bold rounded-full text-black transition-all duration-150
      //  ${isButtonDisabled 
      //   ? 'bg-gray-700 text-gray-400 cursor-not-allowed shadow-none'
      //   : 'bg-[#ffcc00] hover:bg-[#ff9900] shadow-[5px_5px_0_0_#8b0000] active:translate-x-1 active:translate-y-1 active:shadow-none'
      //  }`
      // }
    >
      <span>{isLoading ? 'Generating...' : 'Generate Answer'}</span>
      <span className="text-3xl">✨</span>
    </button>
  </div>
  
  <div className="w-full">
    <div className="p-8 rounded-3xl bg-[#2a2240] shadow-2xl border-4 border-[#8b0000] transition-all duration-500">
      <h2 className="text-3xl font-bold text-white mb-4 border-b-4 border-[#ffcc00] pb-2 text-left font-sans tracking-wide"> 
        Response:
      </h2>

     <RichResponse content={answer} />
    </div>
  </div>
  </div>
  )
}

export default App
