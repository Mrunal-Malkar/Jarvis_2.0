import { useRef, useState } from "react";
import "./App.css";
import Groq from 'groq-sdk'

function App() {
  const [micOn, setMicOn] = useState(false);
  const [text, setText] = useState("Hello, I am Jarvis, How can I help you?");
  const [question,setQuestion]=useState("Ask me anything..");
  const micbtn = useRef(null);

  const handleSpeak = (message) => {
    if (!message) return;

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.rate = 0.8;
    speech.pitch = 0.8;

    window.speechSynthesis.speak(speech);
  };

  const handleRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    // Ensure ref is not null before modifying
    if (micbtn.current) {
      micbtn.current.textContent = "Listening...";
    }

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(transcript);
      askllma(transcript);
      setQuestion(transcript);

      if (micbtn.current) {
        micbtn.current.textContent = "Ask Jarvis";
      }
    };

    recognition.onerror = () => {
      if (micbtn.current) {
        micbtn.current.textContent = "Ask Jarvis";
      }
    };
  };

  const askllma = (request) => {

    if (!import.meta.env.VITE_API_KEY) {
      console.error("API Key is missing!");
      return;
    }    

    const groq = new Groq({
      apiKey: import.meta.env.VITE_API_KEY,
      dangerouslyAllowBrowser: true,
  });

    async function main() {
      console.log("trying to ask llma")
      // Define your prompt
      const userPrompt =(`You are a virtual assistance named jarvis created by aditya,chetanya,shubham and Mrunal 4 of us boys.you have been created as a model for science exibition held in our jain junior college at talegaon dhabhade in pune,india. we have created a side project of emf model.the person asking the question is a visitor of exibition and he is asking the question to you, you have to aswser the question in short not too long response and politely without using any harsh words. The question is:${request}`);

      // Send the request with the prompt
      const chatCompletion = await groq.chat.completions.create({
        "messages": [{ "role": "user", "content": userPrompt }],  // Add user input here
        "model": "llama3-70b-8192",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false, // Set to false if you want a full response at once
        "stop": null
      });

      // Extract and print the response
      console.log("AI Response:", chatCompletion.choices[0]?.message?.content);
      let response=chatCompletion.choices[0]?.message?.content;
      
      if(response){
      handleSpeak(response);
      setText(response);
    }
    }

    main();
  }



  return (
    <>
    <div className="outermostcontainer">

      <div className="outercontainer">
      <div className="jarvispic"></div>
      <div className="jarvisName">J A R V I S</div>
      <div className="buttonouter">
        <button className="askbutton" onClick={() => { handleRecognition() }} ref={micbtn}>
          Ask Jarvis
        </button>
      </div>
      </div>


    <div className={text?"sidetextcontainer":"sidetextcontainer"}>
      
  <video id="bg-vid" autoPlay loop muted type="video/mp4" src="./../public/jarvis.mp4"></video>

      <div className="sidetext">
        <h1 className="que">{question}</h1>
        <h4 className="ans">{text}</h4>
      </div>
    </div>

    </div>

    </>
  );
}

export default App;
