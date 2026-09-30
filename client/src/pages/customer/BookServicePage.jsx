import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  Wrench,
  ShieldCheck
} from 'lucide-react';

const BookServicePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [appliances, setAppliances] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step state (1: Select Appliance & Service, 2: Appointment Details & Address, 3: Review & Confirm)
  const [step, setStep] = useState(1);

  // Form selections
  const [selectedApplianceId, setSelectedApplianceId] = useState(searchParams.get('appliance') || '');
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('service') || '');
  const [problemDescription, setProblemDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Pre-set min date to tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, srvRes] = await Promise.all([
          api.get('/appliances'),
          api.get('/services')
        ]);
        if (appRes.data.success) {
          setAppliances(appRes.data.data);
          if (!selectedApplianceId && appRes.data.data.length > 0) {
            setSelectedApplianceId(appRes.data.data[0]._id);
          }
        }
        if (srvRes.data.success) {
          setServices(srvRes.data.data);
        }
      } catch (err) {
        console.error('Error loading booking data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter services by chosen appliance
  const availableServices = services.filter(s => s.appliance?._id === selectedApplianceId);

  // Auto-select first service if current selection doesn't match
  useEffect(() => {
    if (availableServices.length > 0) {
      const match = availableServices.find(s => s._id === selectedServiceId);
      if (!match) {
        setSelectedServiceId(availableServices[0]._id);
      }
    } else {
      setSelectedServiceId('');
    }
  }, [selectedApplianceId, services]);

  const selectedAppliance = appliances.find(a => a._id === selectedApplianceId);
  const selectedService = services.find(s => s._id === selectedServiceId);

  const handleNextStep1 = () => {
    if (!selectedApplianceId || !selectedServiceId) {
      setError('Please select both an appliance and a service.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!problemDescription.trim()) {
      setError('Please describe the problem you are experiencing.');
      return;
    }
    if (!preferredDate) {
      setError('Please choose a preferred service date.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your service visit address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleSubmitBooking = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        appliance: selectedApplianceId,
        service: selectedServiceId,
        problemDescription,
        preferredDate,
        preferredTime,
        address,
        phone
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        navigate(`/customer/bookings/${res.data.data._id}?booked=true`);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="book-service-page">
      <div className="booking-wizard-card">
        <div className="wizard-header">
          <h2>Book Appliance Service</h2>
          <p>Complete the steps below to schedule a certified technician</p>

          <div className="wizard-steps-indicator">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span className="step-text">Appliance & Service</span>
            </div>
            <div className="step-divider" />
            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-text">Schedule & Address</span>
            </div>
            <div className="step-divider" />
            <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-text">Confirm Booking</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-danger mb-6">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Select Appliance & Service */}
        {step === 1 && (
          <div className="wizard-body">
            <h3>1. Choose Your Appliance</h3>
            <div className="appliance-select-grid">
              {appliances.map(app => (
                <div
                  key={app._id}
                  className={`appliance-choice-card ${selectedApplianceId === app._id ? 'selected' : ''}`}
                  onClick={() => setSelectedApplianceId(app._id)}
                >
                  <div className="choice-indicator">
                    {selectedApplianceId === app._id && <Check size={14} color="#fff" />}
                  </div>
                  <img src={app.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80'} alt={app.name} />
                  <h4>{app.name}</h4>
                </div>
              ))}
            </div>

            <h3 className="mt-8">2. Choose Specific Service Package</h3>
            {availableServices.length === 0 ? (
              <p className="text-muted">No specific services found for this appliance category.</p>
            ) : (
              <div className="services-choice-list">
                {availableServices.map(srv => (
                  <div
                    key={srv._id}
                    className={`service-choice-row ${selectedServiceId === srv._id ? 'selected' : ''}`}
                    onClick={() => setSelectedServiceId(srv._id)}
                  >
                    <div className="radio-circle">
                      {selectedServiceId === srv._id && <div className="radio-inner" />}
                    </div>
                    <div className="service-choice-info">
                      <h4>{srv.name}</h4>
                      <p>{srv.description}</p>
                      <small><Clock size={13} /> Approx {srv.estimatedDuration}</small>
                    </div>
                    <div className="service-choice-price">
                      ${srv.price}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="wizard-actions mt-8">
              <div />
              <button onClick={handleNextStep1} className="btn btn-primary">
                Continue to Schedule <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date, Time, Problem & Address */}
        {step === 2 && (
          <div className="wizard-body">
            <h3>Service Schedule & Details</h3>
            <div className="custom-form mt-4">
              <div className="form-group">
                <label>Problem Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe symptoms (e.g. cooling failure, water leakage, strange rattling noise)..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    min={minDateStr}
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time Slot *</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Noon)</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Late Afternoon)</option>
                    <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Service Visit Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="House/Apartment #, Street, Neighborhood, City..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="wizard-actions mt-8">
              <button onClick={() => setStep(1)} className="btn btn-outline">
                <ChevronLeft size={18} /> Back
              </button>
              <button onClick={handleNextStep2} className="btn btn-primary">
                Review & Confirm <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="wizard-body">
            <h3>Review Booking Details</h3>
            <p className="text-muted">Please verify your booking summary before final submission.</p>

            <div className="review-summary-card mt-4">
              <div className="summary-row">
                <span className="summary-label">Appliance</span>
                <strong>{selectedAppliance?.name}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Service Package</span>
                <strong>{selectedService?.name}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Standard Service Fee</span>
                <strong className="text-primary">${selectedService?.price}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Estimated Duration</span>
                <span>{selectedService?.estimatedDuration}</span>
              </div>
              <hr className="divider" />
              <div className="summary-row">
                <span className="summary-label">Appointment Date</span>
                <strong>{preferredDate} ({preferredTime})</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Service Location</span>
                <span>{address}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Contact Phone</span>
                <span>{phone}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Problem Stated</span>
                <span>{problemDescription}</span>
              </div>
            </div>

            <div className="service-guarantee-card mt-4">
              <ShieldCheck size={28} color="#2563eb" />
              <div>
                <strong>Pay after service completion</strong>
                <p>No upfront charge needed now. Inspection and transparent billing upon job completion.</p>
              </div>
            </div>

            <div className="wizard-actions mt-8">
              <button onClick={() => setStep(2)} className="btn btn-outline" disabled={submitting}>
                <ChevronLeft size={18} /> Edit Details
              </button>
              <button onClick={handleSubmitBooking} className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? 'Submitting Booking...' : 'Confirm & Submit Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookServicePage;
