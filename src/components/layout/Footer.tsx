import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary mt-auto">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
              <span className="text-xl font-serif font-bold">UG Books</span>
            </Link>
            <p className="text-sm text-primary-foreground/85">
              The simple way for students to buy and sell used textbooks — save money, clear your shelf, and keep
              studying.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold mb-4 text-primary-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sell a Book
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-serif font-semibold mb-4 text-primary-foreground">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/book-condition" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Book Condition Guidelines
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Help Centre
                </Link>
              </li>
              <li>
                <span className="text-primary-foreground/50 cursor-not-allowed">Terms &amp; Conditions</span>
              </li>
              <li>
                <span className="text-primary-foreground/50 cursor-not-allowed">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold mb-4 text-primary-foreground">Contacts</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-primary-foreground/85">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@ugbooks.com</span>
              </li>
              <li className="flex items-center space-x-2 text-primary-foreground/85">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+27 11 123 4567</span>
              </li>
              <li className="flex items-start space-x-2 text-primary-foreground/85">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>44 Alsatian Rd, Glen Austin, Midrand</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/75">
          <p>&copy; {new Date().getFullYear()} UG Books Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
