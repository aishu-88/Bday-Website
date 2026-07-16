import { useState } from "react";
import FloatingHearts from "./FloatingHearts";
import "../styles/giftBox.css";

function GiftBox({ onOpenHeart }) {
  const [stage, setStage] = useState("closed"); // closed -> opening -> opened
  const [burst, setBurst] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleOpenGift = () => {
    if (stage !== "closed") return;
    setStage("opening");

    // petals finish blooming -> box is "opened"
    setTimeout(() => setStage("opened"), 150);

    // burst of petals/hearts once the bloom is underway
    setTimeout(() => setBurst(true), 500);

    // burst settles -> cake popup appears
    setTimeout(() => {
      setBurst(false);
      setShowCake(true);
    }, 2300);
  };

  const handleCutCake = () => {
    if (cakeCut) return;
    setCakeCut(true);
    setTimeout(() => {
      setShowCake(false);
      setShowMessage(true);
    }, 1500);
  };

  return (
    <section className="gift-section">
      {/* ambient falling petals */}
      <div className="petal-field" aria-hidden="true">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${(i * 137) % 100}%`,
              animationDuration: `${9 + (i % 5)}s`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            🌸
          </span>
        ))}
      </div>

      {/* ambient falling red hearts, always on in the background */}
      <div className="heart-field" aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="falling-heart"
            style={{
              left: `${(i * 53) % 100}%`,
              fontSize: `${14 + (i % 4) * 6}px`,
              animationDuration: `${7 + (i % 6)}s`,
              animationDelay: `${i * 0.45}s`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      <p className="gift-small">SPECIAL SURPRISE</p>
      <h1>I Have A Gift For You</h1>

      {/* 3D Blooming Gift Box */}
      <div
        className={`gift stage-${stage}`}
        onClick={stage === "closed" ? handleOpenGift : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && stage === "closed") {
            handleOpenGift();
          }
        }}
        aria-label="Open your gift"
      >
        <div className="gift-glow"></div>

        <div className="gift-box">
          <div className="gift-box-front"></div>
          <div className="gift-box-side"></div>
          <div className="gift-ribbon-v"></div>
          <div className="gift-ribbon-h"></div>
        </div>

        {/* Flower-bloom lid */}
        <div className="petal-lid">
          <span className="petal petal-top"></span>
          <span className="petal petal-right"></span>
          <span className="petal petal-bottom"></span>
          <span className="petal petal-left"></span>
          <span className="petal-center">🌹</span>
        </div>

        {/* Bow sits on the closed bud, flies off when opened */}
        {stage === "closed" ? (
          <div className="gift-bow">
            <span className="bow-loop left"></span>
            <span className="bow-loop right"></span>
            <span className="bow-knot"></span>
          </div>
        ) : (
          <span className="bow-fly">🎀</span>
        )}
      </div>

      {stage === "closed" && <p className="gift-hint">tap to open ✨</p>}

      {/* Falling hearts start the moment the box opens */}
      {stage !== "closed" && <FloatingHearts />}

      {/* Burst of petals + hearts */}
      {burst && (
        <div className="heart-burst">
          {[...Array(50)].map((_, i) => (
            <span
              key={i}
              className="burst-item"
              style={{
                "--x": `${Math.random() * 700 - 350}px`,
                "--y": `${Math.random() * 600 - 300}px`,
                "--delay": `${Math.random() * 0.6}s`,
                "--hue": Math.random() > 0.5 ? "330" : "285",
              }}
            >
              {Math.random() > 0.6 ? "🌸" : "❤️"}
            </span>
          ))}
        </div>
      )}

      {/* Cake Popup */}
      {showCake && (
        <div className="cake-modal">
          <div className={`cake-content ${cakeCut ? "cut" : ""}`}>
            <div className="cake-scene">
              <span className="cake-whole">🎂</span>
              <span className="cake-piece left">🍰</span>
              <span className="cake-piece right">🍰</span>
            </div>

            <h2>Happy Forever With You!</h2>
            <p className="cake-text">
              May every day be as sweet as this moment.
              <br />
              <strong>Cut the cake of love together ❤️</strong>
            </p>

            <div className="candles">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`candle ${cakeCut ? "out" : ""}`}>
                  🕯️
                </span>
              ))}
            </div>

            <button
              className="cake-btn"
              onClick={handleCutCake}
              disabled={cakeCut}
            >
              {cakeCut ? "Sweet! 💕" : "Cut the Cake ✨"}
            </button>
          </div>
        </div>
      )}

      {/* Message Card -> leads onward to VirtualHug */}
      {showMessage && (
        <div className="gift-message">
          <div className="floral-header">🌷💖🌷</div>
          <h2>My Dearest Love</h2>
          <p>
            You are my forever bouquet.
            <br />
            Every petal, every heartbeat is yours.
            <br />
            <strong>Forever, in my heart ❤️</strong>
          </p>

          <button className="secret-btn" onClick={onOpenHeart}>
            ❤️ Open My Heart
          </button>
        </div>
      )}
    </section>
  );
}

export default GiftBox;