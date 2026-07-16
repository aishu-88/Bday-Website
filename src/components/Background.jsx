import { useEffect } from "react";
import "../styles/background.css";

function Background() {

    useEffect(() => {

        const glow = document.querySelector(".mouse-glow");

        const move = (e)=>{

            glow.style.left = e.clientX + "px";

            glow.style.top = e.clientY + "px";

        }

        window.addEventListener("mousemove",move);

        return ()=>window.removeEventListener("mousemove",move);

    },[])

    return(

        <>

            <div className="mouse-glow"></div>

            <div className="grid"></div>

            <div className="noise"></div>

        </>

    )

}

export default Background;