import { useState, useEffect, useMemo } from "react";
import "../styles/CatchMyKiss.css";
import PasswordGate from "./PasswordGate";

const TOTAL_KISSES = 20; // how many kisses float on screen
const WIN_TARGET = 10;   // how many you actually need to catch
const SPARKLE_EMOJIS = ["✨", "💫", "⭐", "💖", "🌟"];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function CatchMyKiss({ onNext }) {
  const [started, setStarted] = useState(false);
  const [caught, setCaught] = useState(0);
  const [complete, setComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [floatingScores, setFloatingScores] = useState([]);
  const [heartBursts, setHeartBursts] = useState([]);

  const [kisses, setKisses] = useState(() =>
    Array.from({ length: TOTAL_KISSES }, (_, i) => ({
      id: i,
      x: rand(10, 85),
      y: rand(16, 74),
      dx: (Math.random() > 0.5 ? 1 : -1) * rand(0.06, 0.15),
      dy: (Math.random() > 0.5 ? 1 : -1) * rand(0.06, 0.15),
      rotation: rand(-15, 15),
      rotSpeed: (Math.random() > 0.5 ? 1 : -1) * rand(0.5, 1.2),
    }))
  );

  // ambient sparkles / petals drifting in the background, generated once
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: rand(2, 98),
        size: rand(10, 22),
        duration: rand(10, 19),
        delay: rand(0, 12),
        emoji: ["✨", "💫", "🌸", "💗"][i % 4],
      })),
    []
  );

  // confetti burst for the win screen, generated once
  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        duration: rand(2.4, 4.2),
        delay: rand(0, 1.8),
        emoji: ["💖", "💗", "✨", "🌸"][i % 4],
      })),
    []
  );

  // gentle drifting movement for every kiss on screen
  useEffect(() => {
    if (!started || complete) return;
    const interval = setInterval(() => {
      setKisses((prev) =>
        prev.map((kiss) => {
          let x = kiss.x + kiss.dx;
          let y = kiss.y + kiss.dy;
          let dx = kiss.dx;
          let dy = kiss.dy;
          let rotation = kiss.rotation + kiss.rotSpeed;

          if (x <= 6 || x >= 90) {
            dx *= -1;
            x = Math.max(6, Math.min(90, x));
          }
          if (y <= 14 || y >= 80) {
            dy *= -1;
            y = Math.max(14, Math.min(80, y));
          }

          dx += (Math.random() - 0.5) * 0.012;
          dy += (Math.random() - 0.5) * 0.012;
          dx = Math.max(-0.2, Math.min(0.2, dx));
          dy = Math.max(-0.2, Math.min(0.2, dy));

          return { ...kiss, x, y, dx, dy, rotation: rotation % 360 };
        })
      );
    }, 16);
    return () => clearInterval(interval);
  }, [started, complete]);

  const catchKiss = (kiss) => {
    if (complete) return;

    setKisses((prev) => prev.filter((k) => k.id !== kiss.id));

    setCaught((prev) => {
      const next = prev + 1;
      if (next >= WIN_TARGET) {
        setTimeout(() => setComplete(true), 550);
      }
      return next;
    });

    const id = Date.now() + Math.random();
    setFloatingScores((prev) => [...prev, { id, left: kiss.x, top: kiss.y }]);

    const pieceCount = 14;
    const pieces = Array.from({ length: pieceCount }, (_, i) => ({
      angle: (360 / pieceCount) * i + rand(-14, 14),
      dist: rand(55, 115),
      size: rand(13, 26),
      spin: rand(-180, 180),
      delay: rand(0, 0.08),
      duration: rand(0.65, 1.05),
      emoji: ["✨", "💫", "⭐", "💗", "❤️"][Math.floor(Math.random() * 5)],
    }));
    setHeartBursts((prev) => [...prev, { id, left: kiss.x, top: kiss.y, pieces }]);

    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((s) => s.id !== id));
      setHeartBursts((prev) => prev.filter((h) => h.id !== id));
    }, 1200);
  };

  if (showPassword) {
    return <PasswordGate onSuccess={onNext} />;
  }

  return (
    <section className="kiss-section">
      {/* animated 3D depth background */}
      <div className="bg-3d" aria-hidden="true">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        <div className="bg-orb orb-4" />
        <div className="bg-glow" />
      </div>

      {/* drifting sparkles / petals */}
      <div className="particle-layer" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {!started ? (
        <div className="kiss-intro">
          <div className="intro-content">
            <div className="floating-hearts">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="intro-heart"
                  style={{ "--delay": i * 0.2 }}
                >
                  ❤️
                </span>
              ))}
            </div>
            <h1>Catch My Birthday Kisses</h1>
            <p>
              Oopsie! I dropped <strong>20 kisses</strong> for you 😘
              <br />
              Catch <strong>{WIN_TARGET}</strong> of them before they fly away
            </p>
            <button onClick={() => setStarted(true)} className="start-btn">
              Start Catching <span className="btn-heart">❤️</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div className="kiss-counter">
              <span className="counter-icon">💋</span>
              <span className="counter-text">
                <strong>{caught}</strong>
                <span className="counter-of"> / {WIN_TARGET}</span>
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((caught / WIN_TARGET) * 100, 100)}%`,
                }}
              >
                <span className="progress-shimmer" />
              </div>
            </div>
          </div>

          {kisses.map((kiss) => (
            <div
              key={kiss.id}
              className="kiss floating"
              style={{
                left: `${kiss.x}%`,
                top: `${kiss.y}%`,
                transform: `rotate(${kiss.rotation}deg)`,
              }}
              onClick={() => catchKiss(kiss)}
            >
              <span className="kiss-glow" />
              <span className="kiss-inner">
                <span className="kiss-shine" />
                <span className="kiss-emoji">💋</span>
              </span>
            </div>
          ))}

          {floatingScores.map((score) => (
            <div
              key={score.id}
              className="plus-one"
              style={{ left: `${score.left}%`, top: `${score.top}%` }}
            >
              +1 ❤️
            </div>
          ))}

          {heartBursts.map((burst) => (
            <div
              key={burst.id}
              className="heart-burst"
              style={{ left: `${burst.left}%`, top: `${burst.top}%` }}
            >
              <span className="burst-flash" />
              {burst.pieces.map((p, i) => (
                <span
                  key={i}
                  className="burst-piece"
                  style={{
                    "--angle": `${p.angle}deg`,
                    "--dist": `${p.dist}px`,
                    "--spin": `${p.spin}deg`,
                    fontSize: `${p.size}px`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                  }}
                >
                  {p.emoji}
                </span>
              ))}
            </div>
          ))}

          {complete && (
            <div className="kiss-complete">
              <div className="confetti-layer" aria-hidden="true">
                {confetti.map((c) => (
                  <span
                    key={c.id}
                    className="confetti-piece"
                    style={{
                      left: `${c.left}%`,
                      animationDuration: `${c.duration}s`,
                      animationDelay: `${c.delay}s`,
                    }}
                  >
                    {c.emoji}
                  </span>
                ))}
              </div>
              <div className="complete-content">
                <div className="success-icon">🎉💖🎉</div>
                <h1>You Caught My Kisses</h1>
                <p>You stole my heart completely 😘</p>
                <button onClick={() => setShowPassword(true)} className="next-btn">
                  Continue to the Card <span className="btn-heart">❤️</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default CatchMyKiss;