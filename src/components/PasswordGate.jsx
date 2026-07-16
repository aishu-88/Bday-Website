import { useState, useMemo, useRef } from "react";
import "../styles/PasswordGate.css";

const SECRET = "aishu"; // shh 🤫 — never shown in the UI
const ANGRY_GIF = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";

const FILLER_POOL = "BCDEFGJKLMNOPQRTVWXYZ".split("");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function PasswordGate({ onSuccess }) {
  // build the 12 tiles once: every letter of the secret + random fillers, shuffled
  const tiles = useMemo(() => {
    const needed = [...new Set(SECRET.toUpperCase().split(""))]; // A I S H U
    const fillerCount = 16 - needed.length;
    const fillers = shuffle(FILLER_POOL).slice(0, fillerCount);
    return shuffle([...needed, ...fillers]).map((letter, i) => ({
      id: i,
      letter,
    }));
  }, []);

  const [selected, setSelected] = useState([]); // array of tile ids, in tap order
  const [usedIds, setUsedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const [showAngry, setShowAngry] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const lockRef = useRef(false); // guard against double-fire while checking

  const wordLength = SECRET.length;
  const guessLetters = selected.map(
    (id) => tiles.find((t) => t.id === id).letter
  );

  const resetAttempt = () => {
    setSelected([]);
    setUsedIds([]);
  };

  const handleTileClick = (tile) => {
    if (unlocked || lockRef.current) return;
    if (usedIds.includes(tile.id)) return;
    if (selected.length >= wordLength) return;

    const nextSelected = [...selected, tile.id];
    setSelected(nextSelected);
    setUsedIds((prev) => [...prev, tile.id]);

    if (nextSelected.length === wordLength) {
      const guess = nextSelected
        .map((id) => tiles.find((t) => t.id === id).letter)
        .join("")
        .toLowerCase();

      lockRef.current = true;

      if (guess === SECRET) {
        setUnlocked(true);
        setTimeout(() => {
          onSuccess && onSuccess();
        }, 1500);
      } else {
        setTimeout(() => {
          setAttempts((a) => a + 1);
          setShowAngry(true);
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setTimeout(() => setShowAngry(false), 1700);
          resetAttempt();
          lockRef.current = false;
        }, 350);
      }
    }
  };

  const handleClear = () => {
    if (unlocked) return;
    resetAttempt();
  };

  return (
    <section className="lock-section">
      <div className="lock-bg" aria-hidden="true">
        <div className="lock-orb orb-a" />
        <div className="lock-orb orb-b" />
        <div className="lock-orb orb-c" />
      </div>

      {unlocked && (
        <div className="lock-sparkles" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="lock-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${2.2 + Math.random() * 1.8}s`,
                animationDelay: `${Math.random() * 1.6}s`,
              }}
            >
              {["✨", "🔑", "💫", "⭐"][i % 4]}
            </span>
          ))}
        </div>
      )}

      {showAngry && (
        <div className="angry-popup">
          <div className="angry-card">
            <img src={ANGRY_GIF} alt="angry reaction" className="angry-gif" />
            <p>WRONG! 😡</p>
          </div>
        </div>
      )}

      <div className={`lock-card ${shake ? "shake" : ""} ${unlocked ? "unlocked" : ""}`}>
        <div className="lock-icon-wrap">
          <span className="lock-icon">{unlocked ? "🔓" : "🔒"}</span>
        </div>

        <h1>{unlocked ? "It's You!" : "One Last Secret"}</h1>
        <p>
          {unlocked
            ? "Opening something just for you..."
            : "Tap the letters to spell the name only you would know 😏"}
        </p>

        {/* entered letters preview */}
        <div className="letter-slots">
          {Array.from({ length: wordLength }).map((_, i) => (
            <div key={i} className={`letter-slot ${guessLetters[i] ? "filled" : ""}`}>
              {guessLetters[i] || ""}
            </div>
          ))}
        </div>

        {/* 16 letter tiles */}
        <div className="tile-grid">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className={`letter-tile ${usedIds.includes(tile.id) ? "used" : ""}`}
              onClick={() => handleTileClick(tile)}
              disabled={unlocked || usedIds.includes(tile.id)}
            >
              {tile.letter}
            </button>
          ))}
        </div>

        {!unlocked && (
          <button type="button" className="clear-btn" onClick={handleClear}>
            Clear ⌫
          </button>
        )}

        {!unlocked && attempts >= 2 && (
          <p className="clue-text">💡 Clue: it's your favorite person's name</p>
        )}
      </div>
    </section>
  );
}

export default PasswordGate;