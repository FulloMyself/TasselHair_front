import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaTag, FaCalendarAlt, FaStar } from 'react-icons/fa';
import * as serviceAPI from '../../api/serviceAPI';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import ServiceGrid from './ServiceGrid';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await serviceAPI.getServiceById(id);
      setService(response.data);
      
      // Fetch related services
      if (response.data.category) {
        const related = await serviceAPI.getServicesByCategory(response.data.category, {
          limit: 3,
          exclude: id,
        });
        setRelatedServices(related.data);
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate('/book', { state: { preselectedService: service } });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-text-dark">Service not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul className="flex space-x-2 text-gray-500">
            <li><a href="/" className="hover:text-accent-pink">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li><a href="/services" className="hover:text-accent-pink">Services</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-primary-brown">{service.name}</li>
          </ul>
        </div>

        {/* Service Main */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <img
                src={service.images?.[selectedImage] || '/images/service-placeholder.jpg'}
                alt={service.name}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {service.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-accent-pink' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${service.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-primary-brown mb-2">
              {service.name}
            </h1>

            {/* Category */}
            <div className="flex items-center space-x-2 mb-4">
              <FaTag className="text-accent-pink" />
              <span className="text-text-dark capitalize">{service.category}</span>
              {service.department && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-text-dark capitalize">{service.department}</span>
                </>
              )}
            </div>

            {/* Price & Duration */}
            <div className="flex items-center justify-between mb-6 p-4 bg-secondary-beige rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-3xl font-bold text-accent-pink">
                  {formatCurrency(service.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-xl font-semibold text-primary-brown flex items-center">
                  <FaClock className="mr-2" />
                  {service.duration} minutes
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-brown mb-2">
                Description
              </h3>
              <p className="text-text-dark whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBookNow}
              className="btn-primary w-full flex items-center justify-center text-lg py-4"
            >
              <FaCalendarAlt className="mr-2" />
              Book This Service
            </button>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-12">
            <h2 className="section-title">You Might Also Like</h2>
            <ServiceGrid services={relatedServices} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ServiceDetails;