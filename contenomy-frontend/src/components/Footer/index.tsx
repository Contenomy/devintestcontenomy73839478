import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="contenomy-footer">
            <div className="footer-links">
                <div>
                    <Link to="/privacy" className="footer-link">Privacy</Link>
                    <Link to="/terms-and-conditions" className="footer-link">Termini e condizioni</Link>
                    <Link to="/contact" className="footer-link">Stampa</Link>
                </div>
                <div>
                    <Link to="/#how-it-works" className="footer-link">Come funziona</Link>
                    <Link to="/market" className="footer-link">Mercati</Link>
                    <Link to="/profile" className="footer-link">Area personale</Link>
                </div>
            </div>
            <div className="footer-bottom">
                Contenomy &copy; - {new Date().getFullYear()} | P.Iva 21651044543 | 
                <a href="https://www.linkedin.com/company/contenomy" target="_blank" rel="noopener noreferrer" className="footer-link"> LinkedIn</a>
            </div>
        </footer>
    );
}
