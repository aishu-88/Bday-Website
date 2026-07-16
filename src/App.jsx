import { useState } from "react";

import LoadingScreen from "./components/LoadingScreen";
import Countdown from "./components/Countdown";
import Hero from "./components/Hero";
import DontClick from "./components/DontClick";
import CatchMyKiss from "./components/CatchMyKiss";
import Gallery from "./components/Gallery";
import GiftBox from "./components/GiftBox";
import VirtualHug from "./components/VirtualHug";
import EndingStory from "./components/EndingStory";

function App() {
  const [loading, setLoading] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [step, setStep] = useState(0);

  if (loading) {
    return <LoadingScreen onComplete={() => {
      setLoading(false);
      setShowCountdown(true);
    }} />;
  }

  if (showCountdown) {
    return <Countdown onComplete={() => setShowCountdown(false)} />;
  }

  return (
    <>
      {/* HERO */}
      {step === 0 && <Hero onNext={() => setStep(1)} />}

      {/* DON'T CLICK */}
      {step === 1 && <DontClick onNext={() => setStep(2)} />}

      {/* CATCH MY KISS */}
      {step === 2 && <CatchMyKiss onNext={() => setStep(3)} />}

      {/* GALLERY */}
      {step === 3 && <Gallery onNext={() => setStep(4)} />}

      {/* GIFT BOX */}
      {step === 4 && <GiftBox onOpenHeart={() => setStep(5)} />}

      {/* VIRTUAL HUG */}
      {step === 5 && <VirtualHug onComplete={() => setStep(6)} />}

      {/* ENDING */}
      {step === 6 && (
        <EndingStory
          onReplay={() => {
            setStep(0);
          }}
        />
      )}
    </>
  );
}

export default App;