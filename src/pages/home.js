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

  const questions = [
    {
      question: "What is MFA and why is it important?",
      options: [
        "It's a single-step verification process.",
        "It's a two-step verification process to improve security.",
        "It's a social media account type.",
        "It's a way to bypass security features."
      ]
    },
    {
      question: "What does 'phishing' mean in cybersecurity?",
      options: [
        "It's a single-step verification process.",
        "It's a two-step verification process to improve security.",
        "It's a social media account type.",
        "It's a way to bypass security features."
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

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Quiz completed!");
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
          {/* code uses GOOGLE auth to capture emails etc for the keylogging/*/}
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
    </div>
  );
};

export default Home;
