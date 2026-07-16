import "../styles/video.css";

function VideoSection() {
  return (
    <section className="video-section" id="video">

      <div className="video-title">
        <p>OUR STORY</p>

        <h1>
          Every Moment
          <span> Together ❤️</span>
        </h1>

        <p className="video-subtitle">
          Every memory is a beautiful chapter of our journey.
        </p>
      </div>

      <div className="video-card">

        <video
          controls
          preload="metadata"
          poster="/images/photo1.jpg"
        >
          <source src="/video/www.mp4" type="video/mp4" />
        </video>

      </div>

    </section>
  );
}

export default VideoSection;