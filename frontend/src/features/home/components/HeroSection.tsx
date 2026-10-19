// import { Link } from "react-router-dom";

// export function HeroSection() {
//     return (
//         <section className="hero">
//             <div className="hero__content">
//                 <p className="hero__eyebrow">
//                     DELIRIUM
//                 </p>

//                 <h1 className="hero__title">
//                     TASTE THE
//                     <br />
//                     DISORIENTATION
//                 </h1>

//                 <p className="hero__description">
//                     Waffles, drinks, fries, ice cream
//                     and everything in between.
//                 </p>

//                 <Link
//                     to="/menu"
//                     className="hero__cta"
//                 >
//                     Explore Menu
//                 </Link>
//             </div>

//             <div className="hero__visual">
//                 <div className="hero__image-wrap">
//                     <img
//                         src="/hero-waffle.png"
//                         alt="Woman enjoying a decadent waffle at Delirium"
//                         className="hero__image"
//                     />
//                 </div>

//                 <div className="hero__visual-label">
//                     <span>THE</span>

//                     <strong>
//                         WAFFLE
//                         <br />
//                         PARADOX
//                     </strong>
//                 </div>
//             </div>
//         </section>
//     );
// }


import { Link } from "react-router-dom";

export function HeroSection() {
    return (
        <section className="hero">
            <div className="hero__content">
                <p className="hero__eyebrow">
                    DELIRIUM
                </p>

                <h1 className="hero__title">
                    TASTE THE
                    <br />
                    DISORIENTATION
                </h1>

                <p className="hero__description">
                    Waffles, drinks, fries, ice cream
                    and everything in between.
                </p>

                <Link
                    to="/menu"
                    className="hero__cta"
                >
                    Explore Menu
                </Link>
            </div>

            <div className="hero__visual">
                <div className="hero__image-wrap">
                    <img
                        src="/hero-waffle.png"
                        alt="Woman enjoying a decadent waffle at Delirium"
                        className="hero__image"
                    />
                </div>

                <div className="hero__visual-label">
                    <span>THE</span>

                    <strong>
                        WAFFLE
                        <br />
                        PARADOX
                    </strong>
                </div>
            </div>
        </section>
    );
}