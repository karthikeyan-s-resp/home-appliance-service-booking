import React from 'react';
import { ShieldCheck, Award, Users, Clock, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="page-header-banner">
        <div className="container">
          <h1>About FixPro Appliances</h1>
          <p>Delivering reliable, certified, and hassle-free home appliance repair solutions</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="about-grid">
          <div className="about-text">
            <span className="section-tag">Our Mission</span>
            <h2>Keeping Modern Households Running Smoothly</h2>
            <p>
              FixPro was founded to eliminate the frustration of broken home appliances, unreliable repair technicians, and unexpected billing. Whether it's an emergency refrigerator breakdown, an air conditioner blowing hot air during summer, or a faulty washing machine, our platform connects households with verified, skilled technicians with guaranteed parts and transparent pricing.
            </p>
            <p>
              Every technician in our network undergoes rigorous technical evaluation and background checks. With easy online scheduling, real-time booking lifecycle tracking, and standard 30-day post-service warranties, we make home maintenance as seamless as ordering dinner online.
            </p>

            <div className="about-highlights">
              <div className="highlight-item">
                <CheckCircle size={20} color="#2563eb" />
                <span>Over 15,000+ happy households served</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={20} color="#2563eb" />
                <span>Standardized rate cards with zero hidden charges</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={20} color="#2563eb" />
                <span>Certified technicians with OEM spare parts</span>
              </div>
            </div>
          </div>

          <div className="about-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=700&q=80"
              alt="Technician team meeting"
              className="rounded-image"
            />
          </div>
        </div>

        <div className="values-section mt-16">
          <div className="section-header text-center">
            <span className="section-tag">Core Values</span>
            <h2 className="section-title">What Drives FixPro Everyday</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="feature-icon mb-4"><ShieldCheck size={28} color="#2563eb" /></div>
              <h3>Safety & Trust</h3>
              <p>Strict background vetting, identification badges, and respectful on-premises behavior at all times.</p>
            </div>
            <div className="step-card">
              <div className="feature-icon mb-4"><Award size={28} color="#2563eb" /></div>
              <h3>Technical Excellence</h3>
              <p>Continuous training on the latest inverter, IoT, and high-efficiency home appliance models.</p>
            </div>
            <div className="step-card">
              <div className="feature-icon mb-4"><Clock size={28} color="#2563eb" /></div>
              <h3>Punctuality</h3>
              <p>We respect your busy schedule with predictable arrival slots and swift diagnosis turnarounds.</p>
            </div>
            <div className="step-card">
              <div className="feature-icon mb-4"><Users size={28} color="#2563eb" /></div>
              <h3>Customer First</h3>
              <p>Dedicated customer support, transparent booking history, and responsive follow-up warranty service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
