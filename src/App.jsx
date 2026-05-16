import { useState, useEffect } from 'react'
import axios from 'axios'
import RichResponse from './components/RichResponse'

function App() {
  const [theme, setTheme] = useState("light");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages(parsed);
          setShowWelcome(false);
        }
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  async function generateAnswer(currentQuestion) {
    if (!currentQuestion.trim()) return;

    setShowWelcome(false);
    
    const newMessages = [...messages, { type: 'user', text: currentQuestion }];
    setMessages(newMessages);
    localStorage.setItem('chatHistory', JSON.stringify(newMessages));
    
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      console.log("API Key loaded:", apiKey ? `Yes (length: ${apiKey.length})` : "No (undefined)");
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const response = await axios({
        url: apiUrl,
        method: "post",
        data: { "contents": [ { "parts": [ { "text": currentQuestion } ] } ] },
      })

      const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldn't generate an answer."
      
      const finalMessages = [...newMessages, { type: 'ai', text: responseText }];
      setMessages(finalMessages);
      localStorage.setItem('chatHistory', JSON.stringify(finalMessages));
    
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
      const errorMessages = [...newMessages, { type: 'ai', text: "An error occurred while fetching the answer." }];
      setMessages(errorMessages);
      localStorage.setItem('chatHistory', JSON.stringify(errorMessages));
    } finally {
      setIsLoading(false);
    }  
  }

  const handleSend = () => {
    generateAnswer(question);
    setQuestion("");
  }
  
  const handleChipClick = (chipText) => {
    generateAnswer(chipText);
  }

  const isButtonDisabled = isLoading || !question.trim();

  return (
    <div className="flex h-screen w-full text-[var(--text-main)] transition-colors duration-300" style={{ background: 'var(--bg-gradient)' }}>
      {/* Main Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', width: '100%', height: '56px', background: 'rgba(255,255,255,0.4)', borderBottom: '0.5px solid rgba(220,100,120,0.15)', position: 'relative', zIndex: 10 }}>
          {/* Left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              onClick={() => setShowWelcome(true)}
              style={{ fontSize: '20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #f48fb1, #e53935, #90caf9)', flexShrink: 0 }}></div>
              <span style={{ color: '#f06292' }}>Mini</span>
              <span style={{ color: '#e53935' }}>Gemini</span>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => {
                setMessages([]);
                localStorage.removeItem('chatHistory');
                setShowWelcome(true);
              }}
              className="header-btn"
              title="Clear Chat"
              style={{ width: '32px', height: '32px', padding: 0 }}
            >
              🗑️
            </button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="header-btn hover:scale-105 transition-transform"
              title="Toggle Dark Mode"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>

        {showWelcome ? (
          // SCREEN 1: Landing
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', gap: '24px' }}>
            <p style={{ fontSize: '28px', lineHeight: '1.3', textAlign: 'center', marginBottom: '8px' }}>
              <span style={{ color: 'var(--heading-muted)' }}>Mini Gemini </span>
              <strong style={{ color: 'var(--heading-bold)' }}>Your AI Assistant</strong>
            </p>
            
            <div className="glowing-orb" style={{ margin: '0', width: '200px', height: '200px', flexShrink: 0 }}></div>
            
            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Explain a concept', 'Write code', 'Summarize text', 'Brainstorm ideas'].map(chip => (
                <button 
                  key={chip} 
                  onClick={() => handleChipClick(chip)} 
                  className="glass-chip"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '8px', width: 'min(560px, 88%)', background: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(220,100,120,0.25)', borderRadius: '20px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(220,100,120,0.1)' }}>
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isButtonDisabled) handleSend();
                  }
                }}
                disabled={isLoading}
                rows={1}
                placeholder="Ask me anything..."
                style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', WebkitAppearance: 'none', width: '100%', fontSize: '14px', color: '#2a0a0a', resize: 'none' }}
              />
              <button 
                onClick={handleSend}
                disabled={isButtonDisabled}
                style={{ background: 'linear-gradient(135deg, #f06292, #e91e8c)', borderRadius: '20px', padding: '7px 16px', color: 'white', fontSize: '12px', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                className="disabled:opacity-50 hover:scale-105 transition-transform"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          // SCREEN 2: Chat View
          <div className="flex-1 flex flex-col overflow-y-auto w-full max-w-4xl mx-auto">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {messages.map((msg, idx) => (
                msg.type === 'user' ? (
                  <div key={idx} className="flex flex-col self-end" style={{ maxWidth: '60%' }}>
                    <div style={{ background: 'linear-gradient(135deg, #f06292, #e91e8c)', color: 'white', borderRadius: '18px 18px 4px 18px', padding: '10px 16px', alignSelf: 'flex-end' }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '10px', color: 'rgba(150,80,120,0.5)', textAlign: 'right', marginTop: '4px' }}>Now</span>
                  </div>
                ) : (
                  <div key={idx} style={{ display: 'flex', gap: '12px', maxWidth: '100%' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #f48fb1, #ce93d8, #90caf9)', flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.8)' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                      <div className="ai-bubble overflow-hidden flex flex-col gap-2 w-full">
                        <RichResponse content={msg.text} />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--ai-icons)' }}>
                        <span>Now</span>
                        <span style={{ cursor: 'pointer' }}>📋</span>
                        <span style={{ cursor: 'pointer' }}>👍</span>
                        <span style={{ cursor: 'pointer' }}>🔊</span>
                      </div>
                    </div>
                  </div>
                )
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div style={{ display: 'flex', gap: '12px', maxWidth: '100%' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #f48fb1, #ce93d8, #90caf9)', flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.8)' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="ai-bubble" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="dot-bounce bg-pink-500 w-1.5 h-1.5 rounded-full"></span>
                      <span className="dot-bounce bg-pink-500 w-1.5 h-1.5 rounded-full" style={{animationDelay: '0.2s'}}></span>
                      <span className="dot-bounce bg-pink-500 w-1.5 h-1.5 rounded-full" style={{animationDelay: '0.4s'}}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Area (Screen 2) */}
        {!showWelcome && (
          <div className="w-full max-w-4xl mx-auto mt-auto shrink-0" style={{ marginBottom: '20px', marginLeft: '16px', marginRight: '16px' }}>
            <div className="glass-input-container flex items-center" style={{ gap: '10px', padding: '12px 14px' }}>
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isButtonDisabled) {
                      handleSend();
                    }
                  }
                }}
                disabled={isLoading}
                rows={1}
                placeholder="Ask me anything..."
                style={{ background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', WebkitAppearance: 'none', width: '100%', fontSize: '14px', color: '#2a0a0a', resize: 'none' }}
              />
              <button 
                onClick={handleSend}
                disabled={isButtonDisabled}
                className="send-button disabled:opacity-50"
              >
                <span style={{ color: 'white', fontSize: '18px' }}>➤</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
