import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import "../styles/count.css"

function Countdown({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  const calculateTimeLeft = () => {
    const now = new Date();
    let nextBirthday = new Date(now.getFullYear(), 6, 17); // July 17

    if (now > nextBirthday) {
      nextBirthday = new Date(now.getFullYear() + 1, 6, 17);
    }

    const difference = nextBirthday - now;

    if (difference <= 0) {
      setIsComplete(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fireworks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 4;
        this.gravity = 0.08;
        this.life = 90;
        this.alpha = 1;
      }
      update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.alpha = this.life / 90;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createFirework = (x, y) => {
      const colors = ['#ff4d8d', '#ff69b4', '#ffd700', '#ff1493', '#00f7ff'];
      for (let i = 0; i < 70; i++) {
        particlesRef.current.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
      }
    };

    const interval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.4;
      createFirework(x, y);
    }, 550);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => { p.update(); p.draw(); });

      requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSkip = () => {
    confetti({ particleCount: 200, spread: 100 });
    setTimeout(onComplete, 600);
  };

  const handleBirthday = () => {
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
    setTimeout(onComplete, 1400);
  };

  if (isComplete) {
    return (
      <div className="countdown-page">
        <canvas ref={canvasRef} className="fireworks-bg" />
        <div className="countdown-content">
          <div className="birthday-message">
            <h1>🎉 Happy Birthday! 🎂</h1>
            <p>It's your special day! 💖</p>
            <button className="yes-btn" onClick={handleBirthday}>
              Continue ❤️
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-page">
      <canvas ref={canvasRef} className="fireworks-bg" />
      <div className="countdown-content">
        <div className="countdown-card">
          <h2>🎂 Countdown to Birthday</h2>
          <p className="date">July 17</p>
          
          <div className="timer">
            <div className="time-block"><div className="time-value">{timeLeft.days ?? 0}</div><div className="time-label">Days</div></div>
            <div className="time-block"><div className="time-value">{timeLeft.hours ?? 0}</div><div className="time-label">Hours</div></div>
            <div className="time-block"><div className="time-value">{timeLeft.minutes ?? 0}</div><div className="time-label">Minutes</div></div>
            <div className="time-block"><div className="time-value">{timeLeft.seconds ?? 0}</div><div className="time-label">Seconds</div></div>
          </div>

          <button className="yes-btn" onClick={handleSkip}>
            Skip to Celebration ✨
          </button>
        </div>
      </div>
    </div>
  );
}

export default Countdown;