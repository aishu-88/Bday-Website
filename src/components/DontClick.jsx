import { useRef, useState } from "react";
import "../styles/DontClick.css";

/**
 * Cute animated mascot — pure CSS/SVG, no external images.
 * Its face escalates from mildly annoyed to furious to delighted
 * instead of relying on stock emoji.
 */
function Mascot({ mood }) {
  return (
    <div className={`mascot-wrap mood-${mood}`}>
      <div className="mascot">
        <span className="steam l" />
        <span className="steam r" />
        <span className="brow l" />
        <span className="brow r" />
        <span className="eye l" />
        <span className="eye r" />
        <span className="cheek l" />
        <span className="cheek r" />
        <span className="mouth" />
      </div>
    </div>
  );
}

function DontClick({ onNext }) {

  const [step, setStep] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [crash, setCrash] = useState(false);
  const [winner, setWinner] = useState(false);

  const [position, setPosition] = useState({
    x: 50,
    y: 75,
  });

  const sectionRef = useRef(null);
  const pop = useRef(typeof Audio !== "undefined" ? new Audio("/music/springsound.mp3") : null);

  const messages = [
    "Don't click this button",
    "Why are you like this??",
    "Okay okay, fine... you win!",
    "Here's your next surprise..."
  ];
  const buttonText = [
    "Don't click",
    "Catch me",
    "Almost there",
    "Continue"
  ];
  const LAST_STEP = messages.length - 1;
  // only dodge on the very first attempt — after that it just jumps on click,
  // which is much easier to actually land a tap on
  const DODGE_ON_HOVER_UNTIL_STEP = 1;

  // mood escalates with each near-miss, then softens once they "win"
  // (mood-5 is the reserved "delighted" expression, kept separate from step count)
  const mood = winner ? 5 : Math.min(step, 4);

  const moveButton = () => {
    if (step >= DODGE_ON_HOVER_UNTIL_STEP || step >= LAST_STEP) return;

    setPosition({
      x: Math.random() * 60 + 20,
      y: Math.random() * 45 + 27,
    });
  };

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    sectionRef.current.style.setProperty("--ry", `${x * 8}deg`);
    sectionRef.current.style.setProperty("--rx", `${-y * 8}deg`);
  };

  const handleClick = () => {
    if (pop.current) {
      pop.current.currentTime = 0;
      pop.current.play().catch(() => {});
    }

    // Sparkle burst at the button's last known spot
    for (let i = 0; i < 8; i++) {
      const id = Date.now() + i;
      const sparkle = {
        id,
        x: (position.x * window.innerWidth) / 100 + (Math.random() * 80 - 40),
        y: (position.y * window.innerHeight) / 100 + (Math.random() * 80 - 40),
      };
      setSparkles((prev) => [...prev, sparkle]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 800);
    }

    // Button still hops after a click, but only a short, easy-to-follow distance
    setPosition((prev) => ({
      x: Math.min(80, Math.max(20, prev.x + (Math.random() * 30 - 15))),
      y: Math.min(72, Math.max(27, prev.y + (Math.random() * 24 - 12))),
    }));

    // Fake crash, right when things get most dramatic
    if (step === 1) {
      setCrash(true);
      setTimeout(() => setCrash(false), 900);
    }

    if (step < LAST_STEP) {
      setStep(step + 1);
    } else {
      setWinner(true);
    }
  };

  return (
    <section
      className={`dont-section ${crash ? "crash" : ""}`}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >

      {/* Background */}
      <div className="party-bg">

        <div className="bg-blobs">
          <div className="blob" />
          <div className="blob" />
          <div className="blob" />
          <div className="blob" />
        </div>

        <div className="stars">
          {[...Array(10)].map((_, i) => (
            <span key={i}></span>
          ))}
        </div>

        <div className="balloons">
          {[...Array(10)].map((_, i) => (
            <div className="balloon" key={i}></div>
          ))}
        </div>

        <div className="floating-hearts">
          {[...Array(14)].map((_, i) => (
            <span key={i}></span>
          ))}
        </div>

        <div className="confetti">
          {[...Array(winner ? 90 : 0)].map((_, i) => (
            <i key={i}></i>
          ))}
        </div>

      </div>

      {/* Sparkles */}
      <div className="sparkles">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="spark"
            style={{ left: s.x, top: s.y }}
          />
        ))}
      </div>

      <Mascot mood={mood} />

      <h1>{messages[step]}</h1>

      {!winner ? (
        <button
          className="dont-btn"
          onMouseEnter={moveButton}
          onTouchStart={moveButton}
          onClick={handleClick}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%,-50%)",
          }}
        >
          {buttonText[step]}
        </button>
      ) : (
        <>
          <h2 className="winner-text">
            You won!
            <br />
            Unlimited love, unlocked.
          </h2>

          <button className="next-btn" onClick={onNext}>
            Continue →
          </button>
        </>
      )}

    </section>
  );
}

export default DontClick;