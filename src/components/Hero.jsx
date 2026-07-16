import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Hero.css";

/**
 * 🎂 Birthday Surprise Hero - Bloopy Pastel Theme
 * Shy paper envelope that dodges to a random corner, then finally
 * settles in the center so it can be opened. The "Happy Birthday"
 * reveal only appears once it's opened, with a big zoom/pop entrance.
 * Enhanced with vibrant rectangular confetti.
 */

const BOYFRIEND_NAME = "SYAMU";
const BIRTHDAY_WISH =
  "Another trip around the sun for the person who makes every ordinary day feel like a good one. I hope today is as ridiculous, warm, and wonderful as you are. I love you.";
const SIGNED_BY = "— your girl";

const TOTAL_DODGES = 4;

// Four corner "escape" positions the envelope jumps to (px offsets + tilt)
const CORNERS = [
  { x: -130, y: -95, rot: -16 },
  { x: 135, y: -85, rot: 14 },
  { x: -120, y: 100, rot: -13 },
  { x: 140, y: 95, rot: 18 },
];

// Funny little taunts shown in a speech bubble each time it dodges
const TAUNTS = [
  "Nice try! 😜",
  "Whoops, missed me!",
  "Too slow! 🏃‍♀️💨",
  "Ha! Almost had me~",
];

const SETTLE_TAUNT = "Okay okay, I'll behave 😇 tap me now!";

const BALLOONS = [
  { color: "pastel-pink", left: "8%", top: "18%", duration: "6.5s", delay: "0s", size: 70 },
  { color: "lavender", left: "85%", top: "12%", duration: "7.2s", delay: "0.6s", size: 60 },
  { color: "mint", left: "16%", top: "62%", duration: "8s", delay: "1.1s", size: 54 },
  { color: "peach", left: "90%", top: "58%", duration: "6.8s", delay: "0.3s", size: 48 },
  { color: "pastel-pink", left: "50%", top: "8%", duration: "7.6s", delay: "0.9s", size: 46 },
];

const FALLING_COLORS = ["#ff9ec8", "#c9a6ff", "#a8e6cf", "#ffd1a8", "#ffe6b3", "#ffcc99", "#b3e6ff"];
const BURST_EMOJI = ["🎉", "🎂", "✨", "🎈", "💖", "🥳"];

function makeConfetti(count = 72) {
  return Array.from({ length: count }, (_, i) => ({
    id: `confetti-${Date.now()}-${i}`,
    left: Math.random() * 100,
    duration: 3.5 + Math.random() * 5.5,
    delay: Math.random() * 2.5,
    rotate: Math.random() * 720 + 360,
    drift: (Math.random() - 0.5) * 160,
    width: 6 + Math.random() * 18,
    height: 4 + Math.random() * 12,
    color: FALLING_COLORS[Math.floor(Math.random() * FALLING_COLORS.length)],
    opacity: 0.75 + Math.random() * 0.25,
  }));
}

function makeBurst(count = 16) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 90 + Math.random() * 90;
    return {
      id: `burst-${Date.now()}-${i}`,
      emoji: BURST_EMOJI[Math.floor(Math.random() * BURST_EMOJI.length)],
      bx: Math.cos(angle) * distance,
      by: Math.sin(angle) * distance,
      delay: Math.random() * 0.15,
    };
  });
}

export default function Hero({ onNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fallingItems, setFallingItems] = useState([]);
  const [burstItems, setBurstItems] = useState([]);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [canOpen, setCanOpen] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [taunt, setTaunt] = useState("");
  const [tauntKey, setTauntKey] = useState(0);

  const sceneRef = useRef(null);
  const envelopeRef = useRef(null);
  const clearTimer = useRef(null);
  const settleTimer = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      clearTimer.current && clearTimeout(clearTimer.current);
      settleTimer.current && clearTimeout(settleTimer.current);
    };
  }, []);

  const stars = useMemo(() => Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 2.5 + Math.random() * 3,
  })), []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion.current || !sceneRef.current || isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    sceneRef.current.style.setProperty("--ry", `${x * 14}deg`);
    sceneRef.current.style.setProperty("--rx", `${-y * 14}deg`);
  };

  const handleMouseLeave = () => {
    if (!sceneRef.current) return;
    sceneRef.current.style.setProperty("--ry", `0deg`);
    sceneRef.current.style.setProperty("--rx", `0deg`);
  };

  const setEnvelopeOffset = (x, y, rot) => {
    if (!envelopeRef.current) return;
    envelopeRef.current.style.setProperty("--tx", `${x}px`);
    envelopeRef.current.style.setProperty("--ty", `${y}px`);
    envelopeRef.current.style.setProperty("--trot", `${rot}deg`);
  };

  const fireTaunt = (text) => {
    setTaunt(text);
    setTauntKey((k) => k + 1);
  };

  const handleEnvelopeInteraction = () => {
    if (isOpen) return;

    // Still shy — dodge to a random corner instead of letting itself be caught
    if (!canOpen) {
      const corner = prefersReducedMotion.current
        ? { x: 0, y: 0, rot: 0 }
        : CORNERS[dodgeCount % CORNERS.length];

      setIsDodging(true);
      setEnvelopeOffset(corner.x, corner.y, corner.rot);
      fireTaunt(TAUNTS[dodgeCount % TAUNTS.length]);

      const nextCount = dodgeCount + 1;
      setDodgeCount(nextCount);

      settleTimer.current && clearTimeout(settleTimer.current);

      if (nextCount >= TOTAL_DODGES) {
        // 4th dodge: envelope gets tired, drifts back to center and can be opened
        settleTimer.current = setTimeout(() => {
          setEnvelopeOffset(0, 0, 0);
          setIsDodging(false);
          setCanOpen(true);
          fireTaunt(SETTLE_TAUNT);
        }, prefersReducedMotion.current ? 0 : 380);
      } else {
        settleTimer.current = setTimeout(() => setIsDodging(false), prefersReducedMotion.current ? 0 : 380);
      }
      return;
    }

    // It's settled in the center — safe to open now
    openEnvelope();
  };

  const openEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTaunt("");
    setFallingItems(makeConfetti(72));
    setBurstItems(makeBurst(16));
    clearTimer.current = setTimeout(() => {
      setFallingItems([]);
      setBurstItems([]);
    }, 6800);
  };

  const replay = () => {
    setIsOpen(false);
    setFallingItems([]);
    setBurstItems([]);
    setDodgeCount(0);
    setCanOpen(false);
    setIsDodging(false);
    setTaunt("");
    setEnvelopeOffset(0, 0, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEnvelopeInteraction();
    }
  };

  const attemptsLabel = canOpen
    ? "It's ready for you! 💌"
    : `Attempts: ${dodgeCount}/${TOTAL_DODGES} 😅`;

  return (
    <section
      className="bh-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Stars */}
      <div className="bh-stars" aria-hidden="true">
        {stars.map((s) => (
          <span key={s.id} className="bh-star" style={{
            left: `${s.left}%`, top: `${s.top}%`,
            width: s.size, height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }} />
        ))}
      </div>

      {/* Balloons */}
      <div className="bh-balloons" aria-hidden="true">
        {BALLOONS.map((b, i) => (
          <div key={i} className={`bh-balloon bh-balloon--${b.color}`} style={{
            left: b.left, top: b.top,
            width: b.size, height: b.size * 1.2,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}>
            <span className="bh-balloon__string" />
          </div>
        ))}
      </div>

      {/* Falling Confetti */}
      <div className="bh-falling-layer" aria-hidden="true">
        {fallingItems.map((item) => (
          <span
            key={item.id}
            className="bh-falling-item bh-confetti"
            style={{
              left: `${item.left}%`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
              "--drift": `${item.drift}px`,
              "--rotate": `${item.rotate}deg`,
              backgroundColor: item.color,
              opacity: item.opacity,
            }}
          />
        ))}
      </div>

      <div className="bh-content">
        <p className="bh-eyebrow">A little something for</p>

        {/* No spoilers pre-open — the "Happy Birthday" reveal is locked inside the envelope */}
        <h1 className="bh-headline">
          <span className="bh-headline__small">Syamu  ❤️</span>
          <span className="bh-name">
            {BOYFRIEND_NAME.split("").map((letter, i) => (
              <span key={i} className="bh-letter" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </span>
        </h1>

        <p className="bh-subtext">
          Warning: this envelope is shy and will run away a few times before it lets you catch it 🙈
        </p>

        <div className="bh-gift-scene" ref={sceneRef} style={{ "--s": "230px" }}>
          <div
            ref={envelopeRef}
            className={`bh-envelope${isOpen ? " is-open" : ""}${canOpen ? " ready" : ""}${isDodging ? " dodging" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={canOpen ? "Open your birthday envelope" : "Try to catch the shy envelope"}
            onClick={handleEnvelopeInteraction}
            onKeyDown={handleKeyDown}
          >
            <div className="bh-envelope-back" />
            <div className="bh-envelope-front" />

            <div className="bh-envelope-flap">
              <div className="bh-flap-triangle" />
              <div className="bh-seal">💕</div>
            </div>

            {!isOpen && taunt && (
              <div key={tauntKey} className="bh-taunt">{taunt}</div>
            )}

            {!isOpen && (
              <div className="bh-hint">
                {canOpen ? "👇 go on, tap me!" : "👇 catch me if you can!"}
              </div>
            )}
          </div>

          {!isOpen && (
            <p className="bh-attempts">{attemptsLabel}</p>
          )}

          {isOpen && (
            <>
              <div className="bh-burst-layer" aria-hidden="true">
                {burstItems.map((b) => (
                  <span
                    key={b.id}
                    className="bh-burst-item"
                    style={{
                      animationDelay: `${b.delay}s`,
                      "--bx": `${b.bx}px`,
                      "--by": `${b.by}px`,
                    }}
                  >
                    {b.emoji}
                  </span>
                ))}
              </div>

              <div className="bh-message-card">
                <p className="bh-message-title"> ❤️ Happy Birthday, {BOYFRIEND_NAME}!  ❤️</p>
                <p className="bh-message-body">{BIRTHDAY_WISH}</p>
                {SIGNED_BY && <p className="bh-message-signed">{SIGNED_BY}</p>}
               <div className="hero-actions">

    <button
        className="bh-replay"
        onClick={replay}
    >
        Replay 😆
    </button>

    <button
        className="bh-next"
        onClick={onNext}
    >
        🎁 Claim Your Next Surprise →
    </button>

</div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}