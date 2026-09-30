import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="page-header-banner">
        <div className="container">
          <h1>Contact Customer Support</h1>
          <p>Have inquiries, special appliance requests, or corporate booking requirements? We are here to assist you.</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="contact-grid">
          <div className="contact-info-panel">
            <span className="section-tag">Get In Touch</span>
            <h2>We're Here For You 7 Days A Week</h2>
            <p>
              Our help desk is ready to answer questions regarding booking status, technician assignments, invoice copies, or warranty claims.
            </p>

            <div className="contact-methods">
              <div className="contact-item">
                <div className="contact-icon"><Phone size={20} color="#2563eb" /></div>
                <div>
                  <strong>Customer Helpline</strong>
                  <p>+1 (800) 555-SERV (7378)</p>
                  <small>Monday – Sunday: 8:00 AM – 8:00 PM</small>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon"><Mail size={20} color="#2563eb" /></div>
                <div>
                  <strong>Email Support</strong>
                  <p>support@fixproappliances.local</p>
                  <small>Typical response within 2 hours</small>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon"><MapPin size={20} color="#2563eb" /></div>
                <div>
                  <strong>Headquarters</strong>
                  <p>100 Innovation Blvd, Tech Center</p>
                  <small>Suite 400, Silicon Valley Region</small>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-panel">
            {submitted ? (
              <div className="success-banner-box">
                <CheckCircle2 size={48} color="#16a34a" />
                <h3>Thank You!</h3>
                <p>Your message has been received. Our team will contact you shortly.</p>
                <button
                  className="btn btn-outline btn-sm mt-4"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="custom-form">
                <h3>Send Us A Direct Message</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 555-0123"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inquiry about Refrigerator Repair"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our service team assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
