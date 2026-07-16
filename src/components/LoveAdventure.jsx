import { useState } from "react";
import "../styles/loveAdventure.css";

function LoveAdventure() {

    const [open,setOpen]=useState(false);

    return(

        <>

        <button

        className="continue-btn"

        onClick={()=>setOpen(true)}

        >

            Continue Our Story ❤️

        </button>

        {

        open &&

        <div className="love-overlay">

            <div className="love-card">

                <div className="heart-glow">

                    ❤️

                </div>

                <h1>

                    Before You Continue...

                </h1>

                <p>

                    There is something

                    I always wanted

                    to tell you...

                </p>

                <button

                className="heart-btn"

                >

                    Open My Heart ❤️

                </button>

            </div>

        </div>

        }

        </>

    )

}

export default LoveAdventure;