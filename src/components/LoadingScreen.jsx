import { useState, useRef } from "react";
import "../styles/Loading.css";
import confetti from "canvas-confetti";

const handleYes = () => {
  confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  setTimeout(onComplete, 1200);
};

const angryLines = [
  "Wrong answer. Try again 😤",
  "Nope. That's not gonna work on me 😾",
  "Excuse me?? Click YES right now.",
  "I'm getting really impatient here...",
];

function LoveGate({ onComplete }) {
  const [angry, setAngry] = useState(false);
  const [angryIndex, setAngryIndex] = useState(0);
  const [noPos, setNoPos] = useState({ top: 0, left: 0 });
  const [dodged, setDodged] = useState(0);
  const containerRef = useRef(null);

  const dodgeNo = () => {
    if (dodged >= 3) return; // let them "catch" it eventually
    const container = containerRef.current.getBoundingClientRect();
    const maxX = container.width - 120;
    const maxY = container.height - 60;
    setNoPos({
      left: Math.random() * maxX,
      top: Math.random() * maxY,
    });
    setDodged((d) => d + 1);
  };

  const handleNoClick = () => {
    setAngry(true);
    setAngryIndex((i) => (i + 1) % angryLines.length);
  };

  const resetToQuestion = () => {
    setAngry(false);
    setDodged(0);
    setNoPos({ top: 0, left: 0 });
  };

  const handleYes = () => {
    // fire confetti here (see note below), then:
    setTimeout(onComplete, 1200);
  };

  return (
    <div className="lovegate-page" ref={containerRef}>
      <div className="lovegate-card">
        {!angry ? (
          <>
            <h2>Before you enter...</h2>
            <p>Do you really love me? 💗</p>
            <div className="lovegate-buttons">
              <button className="yes-btn" onClick={handleYes}>
                Yes ❤️
              </button>
              <button
                className="no-btn"
                style={
                  dodged > 0
                    ? { position: "absolute", top: noPos.top, left: noPos.left }
                    : {}
                }
                onMouseEnter={dodgeNo}
                onClick={handleNoClick}
              >
                No
              </button>
            </div>
          </>
        ) : (
          <div className="angry-box">
            <div className="angry-face">😾</div>
            <div className="speech-bubble">{angryLines[angryIndex]}</div>
            <button className="yes-btn" onClick={resetToQuestion}>
              Okay okay let me answer again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoveGate;