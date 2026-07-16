import { useEffect, useRef, useState } from "react";
import "../styles/virtualHug.css";

import night from "../assets/background/nggt.webp";
import moon from "../assets/background/moon.webp";
import cloud from "../assets/background/cloud.webp";

import boyStand from "../assets/characters/boy/stand.png.webp";
import boyWalk1 from "../assets/characters/boy/boy2.png.webp";
import boyWalk2 from "../assets/characters/boy/boy3.png.webp";
import boyWalk3 from "../assets/characters/boy/boy4.png.webp";
import boyWalk4 from "../assets/characters/boy/boy5.png.webp";

import girlStand from "../assets/characters/girl/5.webp";
import girlWalk1 from "../assets/characters/girl/grl2.webp";
import girlWalk2 from "../assets/characters/girl/grl3.webp";
import girlWalk3 from "../assets/characters/girl/grl4.webp";
import girlWalk4 from "../assets/characters/girl/grl3.webp";

import face from "../assets/background/facetoface.webp";
import hug from "../assets/background/hug.webp";

function VirtualHug({ onComplete, onBack }) {

const audioRef = useRef(null);
  const boyFrames = [boyWalk1, boyWalk2, boyWalk3, boyWalk4];
  const girlFrames = [girlWalk1, girlWalk2, girlWalk3, girlWalk4];

  const [scene, setScene] = useState(0);

  const [boyFrame, setBoyFrame] = useState(0);
  const [girlFrame, setGirlFrame] = useState(0);

  const timersRef = useRef([]);

useEffect(() => {

    if (audioRef.current) {

        audioRef.current.volume = 0.5; // 50% volume

        audioRef.current.play().catch((err) => {
            console.log("Audio blocked:", err);
        });

    }

}, []);

  // Walking Animation
  useEffect(() => {

    const walkAnimation = setInterval(() => {

      setBoyFrame(prev => (prev + 1) % boyFrames.length);
      setGirlFrame(prev => (prev + 1) % girlFrames.length);

    }, 300); // slower walking

    return () => clearInterval(walkAnimation);

  }, []);

   // Scene Timeline - Updated timing
  const clearSceneTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const runSceneTimeline = () => {
    clearSceneTimers();
    // Boy and Girl start walking together
    const t1 = setTimeout(() => setScene(1), 800);   // Both start walking

    const t2 = setTimeout(() => setScene(2), 800);   // Girl also walks immediately (scene 2 condition removed effectively)

    const t3 = setTimeout(() => setScene(3), 9200);  // Face to face

    const t4 = setTimeout(() => setScene(4), 12500); // Hug

    const t5 = setTimeout(() => setScene(5), 14500); // Hearts - 2s after hug

    const t6 = setTimeout(() => setScene(6), 19200); // Text - ~4.7s after hearts

    timersRef.current = [t1, t2, t3, t4, t5, t6];
  };

  useEffect(() => {
    runSceneTimeline();
    return clearSceneTimers;
  }, []);

  const handleReplay = () => {
    setScene(0);
    setBoyFrame(0);
    setGirlFrame(0);
    runSceneTimeline();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  return (

    <div className="vh-scene">

      <div className="vh-nav" aria-label="Navigation">
        {onBack && (
          <button
            type="button"
            className="vh-nav-btn"
            onClick={onBack}
            aria-label="Go back"
            title="Back"
          >
            ←
          </button>
        )}
        <button
          type="button"
          className="vh-nav-btn"
          onClick={handleReplay}
          aria-label="Replay"
          title="Replay"
        >
          ⟲
        </button>
      </div>

      <img src={night} className="night" alt="" />

      <div className="overlay"></div>

      <img src={moon} className="moon" alt="" />

      <img src={cloud} className="cloud" alt="" />

      {/* Walking */}

      {scene < 3 && (
        <>
          <img
            src={scene === 0 ? boyStand : boyFrames[boyFrame]}
            className={`boy ${scene >= 1 ? "boy-walk" : ""}`}
            alt="boy"
          />

          <img
            src={scene < 2 ? girlStand : girlFrames[girlFrame]}
            className={`girl ${scene >= 1 ? "girl-walk" : ""}`}
            alt="girl"
          />
        </>
      )}

      {/* Face to Face */}

      {scene === 3 && (
        <img
          src={face}
          className="face breathing"
          alt=""
        />
      )}

      {/* Hug */}

      {scene >= 4 && (
        <img
          src={hug}
          className="hug breathing"
          alt=""
        />
      )}

      {/* Slow Heart Rain */}

      {scene >= 4 && (
        <div className="heart-rain">

          {[...Array(15)].map((_, i) => (

            <span

              key={i}

              className="floating-heart"

              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${12 + Math.random() * 8}s`,
                fontSize: `${16 + Math.random() * 14}px`,
                opacity: 0.4 + Math.random() * 0.6,
              }}

            >

              ❤️

            </span>

          ))}

        </div>
      )}

      {/* Final Message */}

      {scene >= 6 && (

        <div className="message">

          <h1>I wish this hug was real ❤️</h1>

          {/* <p>Happy Birthday My Love</p> */}

          <button
    className="continue-btn"
    onClick={onComplete}
>
    Continue ❤️
</button>

        </div>

      )}
<audio
    ref={audioRef}
    src="/music/audio1.mpeg"
    loop
/>
    </div>

  );
}

export default VirtualHug;