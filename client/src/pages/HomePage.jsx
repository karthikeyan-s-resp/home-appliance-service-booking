import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Award, 
  ChevronRight, 
  Star, 
  PhoneCall, 
  Sparkles,
  CheckCircle,
  Wind,
  Refrigerator,
  Tv,
  RotateCw,
  Flame,
  Droplets,
  Cpu
} from 'lucide-react';

const iconMap = {
  Wind,
  Refrigerator,
  Tv,
  RotateCw,
  Flame,
  Droplets,
  Cpu,
  Wrench
};

const HomePage = () => {
  const [appliances, setAppliances] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, srvRes] = await Promise.all([
          api.get('/appliances'),
          api.get('/services')
        ]);
        if (appRes.data.success) {
          setAppliances(appRes.data.data.slice(0, 8));
        }
        if (srvRes.data.success) {
          setPopularServices(srvRes.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} /> Fast, Certified & Doorstep Appliance Care
            </div>
            <h1 className="hero-title">
              Expert Home Appliance Repairs & Maintenance
            </h1>
            <p className="hero-subtitle">
              Book certified appliance technicians for AC, Refrigerator, Washing Machine, Microwave, and TV repairs in less than 2 minutes. Transparent pricing with complete peace of mind.
            </p>
            <div className="hero-cta-group">
              <Link to="/customer/book" className="btn btn-primary btn-lg">
                <Calendar size={20} />
                <span>Book a Service Now</span>
              </Link>
              <Link to="/services" className="btn btn-outline-white btn-lg">
                <span>Browse All Services</span>
                <ChevronRight size={20} />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <strong>4.9/5</strong>
                <span>Rating (2k+ Reviews)</span>
              </div>
              <div className="stat-separator" />
              <div className="stat-item">
                <strong>30-Day</strong>
                <span>Service Warranty</span>
              </div>
              <div className="stat-separator" />
              <div className="stat-item">
                <strong>100%</strong>
                <span>Verified Experts</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-floating top-float">
              <ShieldCheck color="#2563eb" size={24} />
              <div>
                <strong>Guaranteed Parts</strong>
                <small>OEM authentic spares</small>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80" 
              alt="Technician repairing appliance" 
              className="hero-image"
            />
            <div className="hero-card-floating bottom-float">
              <Clock color="#16a34a" size={24} />
              <div>
                <strong>Fast Response</strong>
                <small>Technician at your door on time</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appliance Categories Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Appliances We Cover</span>
            <h2 className="section-title">Select Your Appliance For Instant Service</h2>
            <p className="section-subtitle">
              Comprehensive repair, cleaning, gas filling, and installation services for major home equipment
            </p>
          </div>

          {loading ? (
            <div className="flex-center py-8">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="appliance-grid">
              {appliances.map((app) => {
                const IconComponent = iconMap[app.icon] || Wrench;
                return (
                  <Link
                    key={app._id}
                    to={`/customer/book?appliance=${app._id}`}
                    className="appliance-card"
                  >
                    <div className="appliance-thumb">
                      <img src={app.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'} alt={app.name} />
                      <div className="appliance-icon-badge">
                        <IconComponent size={20} />
                      </div>
                    </div>
                    <div className="appliance-card-body">
                      <h3>{app.name}</h3>
                      <p>{app.description}</p>
                      <span className="book-link-text">
                        Book Repair <ChevronRight size={16} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag">Most Requested</span>
              <h2 className="section-title">Popular Repair & Maintenance Packages</h2>
            </div>
            <Link to="/services" className="btn btn-outline btn-sm">
              View All Services
            </Link>
          </div>

          <div className="services-grid">
            {popularServices.map((service) => (
              <div key={service._id} className="service-card">
                <div className="service-card-header">
                  <span className="service-appliance-tag">
                    {service.appliance?.name || 'Home Appliance'}
                  </span>
                  <span className="service-price">${service.price}</span>
                </div>
                <h3 className="service-title">{service.name}</h3>
                <p className="service-desc">{service.description}</p>
                <div className="service-card-footer">
                  <span className="service-duration">
                    <Clock size={15} /> {service.estimatedDuration}
                  </span>
                  <Link
                    to={`/customer/book?service=${service._id}&appliance=${service.appliance?._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Easy Process</span>
            <h2 className="section-title">How FixPro Works in 4 Simple Steps</h2>
            <p className="section-subtitle">
              From booking your appointment to a fully functioning home appliance in no time
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Choose Appliance</h3>
              <p>Select your equipment and pick the required repair or regular maintenance package.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Schedule Time</h3>
              <p>Pick a convenient slot, date, provide your address, and explain the issue you are facing.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Expert Doorstep Fix</h3>
              <p>Our background-checked certified technician visits your location with tools and OEM parts.</p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Enjoy Service Warranty</h3>
              <p>Job is completed with full transparency, service notes, and a 30-day post-service guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="why-us-wrapper">
            <div className="why-us-content">
              <span className="section-tag">Why Choose FixPro</span>
              <h2 className="section-title">Reliable, Professional, And Transparent</h2>
              <p className="section-subtitle">
                We believe appliance repairs should be hassle-free without hidden charges or unreliable work.
              </p>

              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon"><ShieldCheck size={22} color="#2563eb" /></div>
                  <div>
                    <h4>100% Background Verified</h4>
                    <p>All technicians undergo rigorous identity screening and skill competency assessments.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><Award size={22} color="#2563eb" /></div>
                  <div>
                    <h4>Upfront Transparent Pricing</h4>
                    <p>Standard fixed rates with no surprise diagnosis fees or unauthorized markups.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><CheckCircle size={22} color="#2563eb" /></div>
                  <div>
                    <h4>30-Day Hassle-Free Warranty</h4>
                    <p>If the same problem recurs within 30 days of service, we revisit and fix it for free.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="why-us-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80" 
                alt="Appliance technician testing machine" 
                className="rounded-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Client Feedback</span>
            <h2 className="section-title">What Our Happy Customers Say</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="testimonial-text">
                "Our split AC suddenly stopped cooling during peak summer heat. The technician arrived right on time, replaced the capacitor, and refilled gas. Outstanding professionalism!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div>
                  <strong>Michael Roberts</strong>
                  <small>AC Repair Customer</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="testimonial-text">
                "The booking portal was super easy to use on my phone. The technician resolved the front load washing machine vibration problem in under an hour. Will definitely use again."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">EM</div>
                <div>
                  <strong>Emily Martinez</strong>
                  <small>Washing Machine Service</small>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="testimonial-text">
                "Booked TV wall mounting and Refrigerator repair together. Clear status tracking from Pending to Assigned to Completed. Transparent pricing with no surprises."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SC</div>
                <div>
                  <strong>Sarah Chen</strong>
                  <small>Homeowner</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2>Ready To Get Your Appliances Running Like New?</h2>
          <p>Book your convenient slot today and experience five-star home appliance repair service.</p>
          <div className="cta-banner-buttons">
            <Link to="/customer/book" className="btn btn-light btn-lg">
              Book Appointment Now
            </Link>
            <Link to="/contact" className="btn btn-outline-white btn-lg">
              <PhoneCall size={18} /> Call / Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
