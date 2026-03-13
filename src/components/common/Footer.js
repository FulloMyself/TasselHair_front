import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaTiktok, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-brown text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img 
              src="/images/logo-white.png" 
              alt="Tassel Beauty & Wellness" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm opacity-90 mb-4">
              Your premier destination for beauty and wellness services in Mulbarton, Gauteng.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/tasselbeautyandwellnessstudio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent-pink transition"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com/tasselbeautyandwellnessstudio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent-pink transition"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent-pink transition"
              >
                <FaWhatsapp size={20} />
              </a>
              <a 
                href="https://tiktok.com/@tasselgroup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent-pink transition"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-accent-pink transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-accent-pink transition">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-accent-pink transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/gifts" className="hover:text-accent-pink transition">
                  Gift Packages
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent-pink transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>55 True North Road, Mulbarton, Gauteng</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone />
                <a href={`tel:${process.env.REACT_APP_COMPANY_PHONE}`} className="hover:text-accent-pink transition">
                  {process.env.REACT_APP_COMPANY_PHONE}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope />
                <a href={`mailto:${process.env.REACT_APP_COMPANY_EMAIL}`} className="hover:text-accent-pink transition">
                  {process.env.REACT_APP_COMPANY_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaClock />
                <span>Monday - Friday: 9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaClock />
                <span>Saturday: 9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaClock />
                <span>Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm">
          <p>
            © {currentYear} Tassel Beauty & Wellness Studio. All rights reserved.
          </p>
          <p className="mt-2">
            Designed by Established Media & Enterprises (PTY) Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;