import "../styles/floatingHearts.css";

function FloatingHearts() {

    return (

        <div className="hearts-container">

            {[...Array(25)].map((_, i) => (

                <span
                    key={i}
                    className="heart"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${8 + Math.random() * 8}s`
                    }}
                >
                    ❤️
                </span>

            ))}

        </div>

    )

}

export default FloatingHearts;