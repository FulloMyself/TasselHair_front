import React from 'react';
import ServiceCard from './ServiceCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ServiceGrid = ({ services, loading, emptyMessage = 'No services found' }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Ensure services is an array and log it
  const serviceArray = Array.isArray(services) ? services : [];
  console.log('ServiceGrid rendering with:', serviceArray.length, 'services');

  if (serviceArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-dark">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="service-grid">
      {serviceArray.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
};

export default ServiceGrid;