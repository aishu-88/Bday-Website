import "../styles/heroBackground.css";

function HeroBackground() {
  return (
    <>
      {/* Gradient Background */}
      <div className="gradient-bg"></div>

      {/* Red Glow */}
      <div className="red-glow"></div>

      {/* Floating Lights */}
      <div className="lights">
        {[...Array(80)].map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="vignette"></div>

      {/* Noise */}
      <div className="noise"></div>
    </>
  );
}

export default HeroBackground;