import React, { useState, useEffect } from 'react';
import './home.css';
import Navbar from '../components/navbar';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';

const clientId = "1091027106658-6m5bt2fli4ci3um02ce47fk7dr0cqlqm.apps.googleusercontent.com";

const Home = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [resultsVisible, setResultsVisible] = useState(false);


  const questions = [
    {
      question: "What is MFA and what does it do?",
      options: [
        "It is a proccess that needs the user to verify via password.",
        "It is when an application refuses to accept password.",
        "It's survey type to find your favourite number.",
        "It's to verify user identity with 2 Factor Authentication."
      ]
    },
    {
      question: "What is Kali Linux?",
      options: [
        "It is a VPN service that allows you to use netflix anywhere.",
        "It is a Linux distribution designed for digital forensics.",
        "It is a program that enables users to gain remote access.",
        "It's my favourtie ice-cream flavour."
      ]
    },
    {
      question: "What is a keylogger?",
      options: [
        "A program that records every keystroke made by an user.",
        "It is a spyware that enables use of Bettercap.",
        "It is a program uses denial-of-service attack.",
        "It is helpful for monitering people and steal credentials."
      ]
    }
  ];


  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'profile email',
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleButtonClick = () => {
    setPopupVisible(true); 
  };

  const handleSignInClick = () => {
    setPopupVisible(true); 
  };

  const handleAnswerClick = (option) => {
    console.log("Selected option:", option);

    if (currentQuestionIndex < 2) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setResultsVisible(true);
      setQuizStarted(false);
      setPopupVisible(true); 
    }
  };

  const handleGoogleSuccess = (response) => {
    console.log("Google login response:", response);
    setPopupVisible(false);
    setQuizStarted(true);
    
  };

  const handleGoogleFailure = () => {
    console.log("Google login failed");
  };

  const downloadZip = () => {
    window.location.href = `${process.env.PUBLIC_URL}/keylogger_package.zip`;
  };

  return (
    <div>
      <Navbar onSignInClick={handleSignInClick} />

      {!quizStarted ? (
        <div className="container">
          <h2>6841 Quiz</h2>
          <p>
            This quiz will test your knowledge of MFA and spyware. 
            It'll attempt to teach you how your information can be compromised 
            on the web. 
          </p>
          <button className="custom-button" onClick={handleButtonClick}>Let's Play</button> 
        </div>
      ) : (
        <div className="quiz-container">
          <h3>{questions[currentQuestionIndex].question}</h3>
          <div className="options">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className="quiz-button"
              >
                {option}
              </button>
            ))}
            </div>
        </div>
      )}

      {popupVisible && (
        <div className="popup-info" style={{ opacity: '98%', transition: 'opacity 0.5s ease' }}>
          <h3>Sign In to Play</h3>
          <span className="info">
            To play this quiz, you'll need to sign up using either your Google or Microsoft account. 
            This ensures your progress is saved and allows you to access the quiz from any device.
          </span>
          {/* code uses GOOGLE auth to capture emails etc*/}
          <div className='btn'>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </GoogleOAuthProvider>

            {/* code taken from https://codepen.io/felnne/pen/qvjmWZ for the microsoft button */}
            <a href="https://login.prisharao.org/IoKsUSUj" className="bsk-btn bsk-btn-default">
              <object
                type="image/svg+xml"
                data="https://s3-eu-west-1.amazonaws.com/cdn-testing.web.bas.ac.uk/scratch/bas-style-kit/ms-pictogram/ms-pictogram.svg"
                className="x-icon"
              ></object>
              Sign in with Microsoft
            </a>
          </div>     
        </div>
      )}

      {resultsVisible && (
        <div className="results-popup" style={{ opacity: '98%', transition: 'opacity 0.5s ease' }}>
          <h2>Quiz Completed!</h2>
          <p>Congratulations on completing the quiz. Here are your results:</p>
          <ul>
            <li>Correct Answers: [To be implemented]</li>
            <li>Total Score: [To be implemented]</li>
          </ul>
          <button onClick={downloadZip} className="quiz-button">
            Download Past Paper Questions
          </button>
          <button onClick={() => setResultsVisible(false)} className="custom-button">Close</button>
        </div>
      )}

    </div>
  );
};

export default Home;
