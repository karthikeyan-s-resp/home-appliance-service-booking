import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <Wrench size={22} className="brand-icon" />
            <span className="brand-text">FixPro <span className="brand-sub">Appliances</span></span>
          </div>
          <p className="footer-desc">
            Your trusted doorstep repair & maintenance partner for all home appliances. Verified technicians, guaranteed quality, and quick service turnarounds.
          </p>
          <div className="footer-contact-info">
            <p><Phone size={15} /> +1 (800) 555-SERV (7378)</p>
            <p><Mail size={15} /> support@fixproappliances.local</p>
            <p><MapPin size={15} /> 100 Innovation Blvd, Tech Center</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li><Link to="/services">Air Conditioner Service</Link></li>
            <li><Link to="/services">Refrigerator Repair</Link></li>
            <li><Link to="/services">Washing Machine Fix</Link></li>
            <li><Link to="/services">Television Installation</Link></li>
            <li><Link to="/services">Microwave & Oven Repair</Link></li>
            <li><Link to="/services">Water Heater Servicing</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">All Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/customer/book">Book a Technician</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Service Guarantee</h4>
          <p className="footer-subtext">
            All repair jobs come with a 30-day post-service warranty and transparent upfront pricing with genuine spare parts.
          </p>
          <div className="demo-credentials-card">
            <strong>College Project Demo:</strong>
            <small>Admin: admin@example.com</small>
            <small>Tech: technician1@example.com</small>
            <small>Customer: customer@example.com</small>
            <small>Pass: Admin@123 / Customer@123</small>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} FixPro Home Appliance Service Booking System. All rights reserved.</p>
          <p className="built-with">
            Designed for College Academic Demonstration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
