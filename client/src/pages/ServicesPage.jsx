import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Clock, Search, Filter, Calendar } from 'lucide-react';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedApplianceParam = searchParams.get('appliance') || 'all';

  const [appliances, setAppliances] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState(selectedApplianceParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, srvRes] = await Promise.all([
          api.get('/appliances'),
          api.get('/services')
        ]);
        if (appRes.data.success) {
          setAppliances(appRes.data.data);
        }
        if (srvRes.data.success) {
          setServices(srvRes.data.data);
          setFilteredServices(srvRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = services;

    if (selectedAppliance !== 'all') {
      result = result.filter(s => s.appliance?._id === selectedAppliance);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.appliance?.name?.toLowerCase().includes(q)
      );
    }

    setFilteredServices(result);
  }, [selectedAppliance, searchQuery, services]);

  const handleCategoryChange = (appId) => {
    setSelectedAppliance(appId);
    if (appId === 'all') {
      searchParams.delete('appliance');
    } else {
      searchParams.set('appliance', appId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="services-page-wrap">
      <div className="page-header-banner">
        <div className="container">
          <h1>Appliance Services Catalog</h1>
          <p>Explore all available diagnostic, repair, parts replacement, and tune-up services</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters Bar */}
        <div className="filter-controls-row">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search services (e.g. AC Gas, Washing Machine, Repair)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-pill-filter">
            <button
              className={`pill-btn ${selectedAppliance === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Appliances
            </button>
            {appliances.map(app => (
              <button
                key={app._id}
                className={`pill-btn ${selectedAppliance === app._id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(app._id)}
              >
                {app.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="flex-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="empty-state-box">
            <h3>No services found</h3>
            <p>Try modifying your search or select a different appliance category.</p>
            <button
              className="btn btn-outline btn-sm mt-4"
              onClick={() => { setSelectedAppliance('all'); setSearchQuery(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="services-grid mt-6">
            {filteredServices.map(srv => (
              <div key={srv._id} className="service-card">
                <div className="service-card-header">
                  <span className="service-appliance-tag">
                    {srv.appliance?.name || 'Home Appliance'}
                  </span>
                  <span className="service-price">${srv.price}</span>
                </div>
                <h3 className="service-title">{srv.name}</h3>
                <p className="service-desc">{srv.description}</p>
                <div className="service-card-footer">
                  <span className="service-duration">
                    <Clock size={15} /> {srv.estimatedDuration}
                  </span>
                  <Link
                    to={`/customer/book?service=${srv._id}&appliance=${srv.appliance?._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Calendar size={14} /> Book Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
