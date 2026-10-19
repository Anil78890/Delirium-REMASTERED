import { Link } from "react-router-dom";

export function CustomerFooter() {
    return (
        <footer className="customer-footer">
            <div className="customer-footer__inner">

                <div className="customer-footer__brand">
                    <Link
                        to="/"
                        className="customer-footer__brand-name"
                    >
                        DELIRIUM
                    </Link>

                    <p className="customer-footer__tagline">
                        TASTE THE DISORIENTATION
                    </p>

                    <p className="customer-footer__description">
                        Waffles, drinks, fries, ice cream
                        and everything in between.
                    </p>
                </div>

                <nav
                    className="customer-footer__links"
                    aria-label="Footer navigation"
                >
                    <p className="customer-footer__heading">
                        EXPLORE
                    </p>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/menu">
                        Menu
                    </Link>
                </nav>

                <div className="customer-footer__contact">
                    <p className="customer-footer__heading">
                        DELIRIUM
                    </p>

                    <p>
                        Come hungry.
                    </p>

                    <p>
                        Leave slightly disoriented.
                    </p>
                </div>

            </div>

            <div className="customer-footer__bottom">
                <span>
                    © {new Date().getFullYear()} DELIRIUM
                </span>

                <span>
                    MADE FOR CRAVINGS.
                </span>
            </div>
        </footer>
    );
}