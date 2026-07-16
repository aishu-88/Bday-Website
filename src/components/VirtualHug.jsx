import { useEffect, useRef, useState } from "react";
import "../styles/virtualHug.css";

import night from "../assets/background/night.png";
import moon from "../assets/background/moon.png";
import cloud from "../assets/background/cloud.png";

import boyStand from "../assets/characters/boy/stand.png.png";
import boyWalk1 from "../assets/characters/boy/boy2.png.png";
import boyWalk2 from "../assets/characters/boy/boy3.png.png";
import boyWalk3 from "../assets/characters/boy/boy4.png.png";
import boyWalk4 from "../assets/characters/boy/boy5.png.png";

import girlStand from "../assets/characters/girl/5.png";
import girlWalk1 from "../assets/characters/girl/grl2.png";
import girlWalk2 from "../assets/characters/girl/grl3.png";
import girlWalk3 from "../assets/characters/girl/grl4.png";
import girlWalk4 from "../assets/characters/girl/grl3.png";

import face from "../assets/background/facetoface.png";
import hug from "../assets/background/hug.png";

function VirtualHug({ onComplete }) {

const audioRef = useRef(null);
  const boyFrames = [boyWalk1, boyWalk2, boyWalk3, boyWalk4];
  const girlFrames = [girlWalk1, girlWalk2, girlWalk3, girlWalk4];

  const [scene, setScene] = useState(0);

  const [boyFrame, setBoyFrame] = useState(0);
  const [girlFrame, setGirlFrame] = useState(0);

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
  useEffect(() => {
    // Boy and Girl start walking together
    const t1 = setTimeout(() => setScene(1), 800);   // Both start walking

    const t2 = setTimeout(() => setScene(2), 800);   // Girl also walks immediately (scene 2 condition removed effectively)

    const t3 = setTimeout(() => setScene(3), 9200);  // Face to face

    const t4 = setTimeout(() => setScene(4), 12500); // Hug

    const t5 = setTimeout(() => setScene(5), 14500); // Hearts - 2s after hug

    const t6 = setTimeout(() => setScene(6), 19200); // Text - ~4.7s after hearts

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  return (

    <div className="vh-scene">

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