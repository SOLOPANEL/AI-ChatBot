import { useState } from 'react'
//import './App.css'
import axios from 'axios'
import RichResponse from './components/RichResponse'

function App() {
  const [theme, setTheme] = useState("dark");
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
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      console.log("API Key loaded:", apiKey ? `Yes (length: ${apiKey.length})` : "No (undefined)");
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const response = await axios({
        url: apiUrl,
        method: "post",
        data: { "contents": [ { "parts": [ { "text": question } ] } ] },
      })

      const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldn't generate an answer."
      setAnswer(responseText)
    
    } catch (error) {
      console.error("API call error:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
      setAnswer("An error occurred while fetching the answer.")
      } finally {
        setIsLoading(false);
      }  

  }

  //check if button should be disable
  const isButtonDisabled = isLoading || !question.trim();
    

  return (
    <div data-theme={theme}
    className="
      min-h-screen
      flex flex-col items-center
      px-4 py-6
      sm:px-6
      md:px-8
      max-w-4xl
      mx-auto
      font-cartoon
    ">

  
    <h1 className="
      text-center
      mb-8
      text-3xl
      sm:text-4xl
      md:text-5xl
    ">WELCOME TO MINI-GEMINI</h1>

    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="mb-6 text-sm underline opacity-80 hover:opacity-100"
    >
      Switch to {theme === "dark" ? "Light" : "Dark"} Mode
    </button>



    <div className="w-full flex flex-col items-center gap-6 mb-12">

    <textarea 
      value={question} 
      onChange={(e) => setQuestion(e.target.value)} 
      disabled={isLoading}
      rows={6}
      placeholder="Ask me anything..."
      className="input-card focus-ring disabled:opacity-70 text-base sm:text-lg"
      // className="
      //     textarea-focus
      //     p-5 text-white w-full max-w-2xl text-lg 
      //     rounded-[20px] bg-[#2a2240] border-4 border-[#ffcc00] 
      //     focus:border-[#ff9900] transition-all duration-300 shadow-[8px_8px_0_0_#8b0000] 
      //     resize-none font-cartoon-text
      //     disabled:opacity-75 disabled:cursor-not-allowed"
      // className="
      // textarea-glow
      // p-5 text-white w-full max-w-2xl text-lg rounded-xl bg-[#2a2240] border-4 border-[#ffcc00]
      // focus:border-[#ff9900] transition-all duration-300 shadow-inner shadow-black/50
      // resize-none
      // "
    ></textarea>

    <button onClick={generateAnswer}
      disabled={isButtonDisabled}
      aria-busy={isLoading}
      className={`
        primary-button
        text-xl sm:text-2xl
        ${!isLoading && !isButtonDisabled ? 'vibrate-once primary-button-enabled' : ''}
        ${isButtonDisabled ? 'primary-button-disabled' : ''}
      `}
      // className={`
      //     button-vibrate-on-hover
      //     flex items-center space-x-2
      //     px-10 py-3 text-2xl font-black rounded-full text-black transition-all duration-150
      //     font-cartoon-text tracking-wider border-4 border-black
      //     ${isButtonDisabled 
      //     ? 'bg-gray-400 text-gray-700 cursor-not-allowed shadow-[5px_5px_0_0_#4b4b4b]' // Disabled state cartoon shadow
      //     : 'bg-[#ffcc00] hover:bg-[#ff9900] shadow-[8px_8px_0_0_#8b0000] active:translate-x-2 active:translate-y-2 active:shadow-none'
      //     }
      //   `}
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
      <span>{isLoading ? 'Generating…' : 'Generate Answer'}</span>
      {!isLoading && <span className="text-3xl">✨</span>}
    </button>
  </div>
  
  <div className="w-full flex justify-center">
    <div className="response-card w-full sm:max-w-3xl">
      <h2 className="text-3xl font-bold mb-4 border-b-4 pb-2 text-left">
        Response:
      </h2>

     <RichResponse content={answer} />
    </div>
  </div>
  </div>
  )
}

export default App
