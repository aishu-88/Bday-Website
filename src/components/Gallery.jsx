import React, { useEffect, useState } from "react";
import "../styles/Gallery.css";

import {
  FaCamera,
  FaTimes,
  FaImages,
  FaArrowDown,
} from "react-icons/fa";

import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";

import img1 from "../assets/background/hug.png";
import img2 from "../assets/background/moon.png";
import img3 from "../assets/background/facetoface.png";
import img4 from "../assets/background/hug.png";
import img5 from "../assets/background/heart.png";
import img6 from "../assets/background/night.png";

const photos = [
  {
    image: img1,
    caption: "Our First Meet",
  },
  {
    image: img2,
    caption: "Beach Evening",
  },
  {
    image: img3,
    caption: "Forever ❤️",
  },
  {
    image: img4,
    caption: "Beautiful Smile",
  },
  {
    image: img5,
    caption: "Together",
  },
  {
    image: img6,
    caption: "Love",
  },
];

export default function Gallery({ onNext }) {
  const [modal, setModal] = useState(false);
  const [cards, setCards] = useState(photos);
  const [bgIndex, setBgIndex] = useState(0);
  const [nextBg, setNextBg] = useState(1);
  const [fade, setFade] = useState(false);

  // background slideshow
  useEffect(() => {
    photos.forEach((photo) => {
      const image = new Image();
      image.src = photo.image;
    });

    const timer = setInterval(() => {
      setFade(true);

      setTimeout(() => {
        setBgIndex(nextBg);
        setNextBg((nextBg + 1) % photos.length);
        setFade(false);
      }, 1200);
    }, 4000);

    return () => clearInterval(timer);
  }, [nextBg]);

  const resetCards = () => {
    setCards([...photos]);
  };

  // Close modal and reset cards
  const closeModal = () => {
    setModal(false);
    // Small delay to let exit animation play
    setTimeout(() => {
      resetCards();
    }, 300);
  };

  return (
    <div className="gallery-wrapper">
      {/* Background Slideshow */}
      <div className="gallery-bg">
        <img
          src={photos[bgIndex].image}
          className={`bg current ${fade ? "fade-out" : ""}`}
          alt=""
        />
        <img
          src={photos[nextBg].image}
          className={`bg next ${fade ? "fade-in" : ""}`}
          alt=""
        />
      </div>

      <section className="gallery-section">
        <div className="gallery-title">
          <FaCamera />
          <span>Our Memories</span>
          <small>{photos.length} photos</small>
        </div>

        {/* Initial Images */}
        <div className="gallery-grid">
          {photos.slice(0, 2).map((photo, index) => (
            <div key={index} className="gallery-card">
              <img src={photo.image} alt="" />
              <div className="caption">{photo.caption}</div>
            </div>
          ))}
        </div>

        {/* Open Button */}
        <button
          className="open-gallery"
          onClick={() => {
            resetCards();
            setModal(true);
          }}
        >
          <FaImages />
          Open +{photos.length - 2} Photos
        </button>

        {/* Funny Next Button */}
        <button className="next-page-btn" onClick={onNext}>
          Next Adventure Awaits... 🦋 <FaArrowDown />
        </button>
      </section>

      {/* Modal with Swipe Cards */}
      {modal && (
        <div className="gallery-modal">
          <button className="close-btn" onClick={closeModal}>
            <FaTimes />
          </button>

          <div className="swipe-container">
            {cards.map((photo, index) => {
              return (
                <SwipePolaroid
                  key={index}
                  photo={photo}
                  index={index}
                  total={cards.length}
                  cards={cards}
                  setCards={setCards}
                  onReset={resetCards}
                />
              );
            })}
          </div>

          {/* Navigation hint */}
          <div className="swipe-hint">
            ← Swipe left/right to browse memories →
          </div>
        </div>
      )}
    </div>
  );
}

const SwipePolaroid = ({ photo, index, total, cards, setCards, onReset }) => {
  const x = useMotionValue(0);
  const dragControls = useDragControls();
  const rotateRaw = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-180, 0, 180], [0, 1, 0]);

  const isFront = index === cards.length - 1;

  const rotate = useTransform(() => {
    const baseRotate = rotateRaw.get();
    const offset = isFront ? 0 : (index % 3) * 2 - 3;
    return `${baseRotate + offset}deg`;
  });

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 110;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      setCards((prev) => prev.filter((_, i) => i !== index));

      if (cards.length === 1) {
        setTimeout(() => {
          onReset();
        }, 400);
      }
    }
  };

  return (
    <motion.div
      className="polaroid"
      style={{
        gridRow: 1,
        gridColumn: 1,
        zIndex: isFront ? total : total - index,
        x,
        opacity,
        rotate,
        boxShadow: isFront
          ? "0 30px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(224,188,216,.5)"
          : "0 20px 40px rgba(0,0,0,.35)",
        touchAction: "none",           // ← Important for mobile
      }}
      animate={{
        scale: isFront ? 1 : 0.92,
        y: isFront ? 0 : index * 8,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.03, zIndex: total + 1 }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
    >
      <img src={photo.image} alt="" />
      <p>{photo.caption}</p>
      <span>
        {total - index}/{total}
      </span>
    </motion.div>
  );
};