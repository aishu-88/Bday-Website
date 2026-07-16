import { useEffect } from "react";
import "../styles/imageViewer.css";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ImageViewer({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) {

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === "Escape") onClose();

      if (e.key === "ArrowRight") onNext();

      if (e.key === "ArrowLeft") onPrev();

    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);

  }, [onClose, onNext, onPrev]);

  return (
    <div className="viewer">

      <div
        className="viewer-overlay"
        onClick={onClose}
      ></div>

      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <button className="prev-btn" onClick={onPrev}>
        <FaChevronLeft />
      </button>

      <img
        src={images[currentIndex]}
        className="viewer-image"
        alt=""
      />

      <button className="next-btn" onClick={onNext}>
        <FaChevronRight />
      </button>

      <div className="image-count">

        {currentIndex + 1} / {images.length}

      </div>

    </div>
  );
}

export default ImageViewer;