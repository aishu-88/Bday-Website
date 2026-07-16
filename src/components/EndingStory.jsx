import React from "react";
import "./../styles/EndingStory.css";

export default function EndingStory() {
  return (
    <section className="ending">
      <div className="ending-content">
        {/* Hugging GIF */}
        <div className="hug-gif">
          <img 
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW1pZ2x5eG1zZ3Z6eW1oZ3Z6eW1oZ3Z6eW1oZ3Z6eW1oZ3Z6eW1oZg/3o7abKhOpu0NwenH3O/giphy.gif" 
            alt="Hugging"
          />
        </div>

        <h1>My Dearest Love</h1>

        <h2>Happy Birthday</h2>
        <h3>My Forever ❤️</h3>

        <button 
          className="replay-btn"
          onClick={() => window.location.reload()}
        >
          Replay This Surprise
        </button>
      </div>
    </section>
  );
}