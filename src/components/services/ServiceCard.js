import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { FaClock, FaTag } from 'react-icons/fa';
import { motion } from 'framer-motion';
import defaultImage from '../../assets/images/service-placeholder.jpg';

const ServiceCard = ({ service }) => {
  const [imageError, setImageError] = React.useState(false);

  const getImageUrl = () => {
    if (imageError) return defaultImage;
    
    if (service.image) {
      if (service.image.startsWith('http')) {
        return service.image;
      }
      if (process.env.NODE_ENV === 'production') {
        return `${process.env.PUBLIC_URL}${service.image}`;
      }
      return service.image.startsWith('/') ? service.image : `/${service.image}`;
    }
    return defaultImage;
  };

  return (
    <motion.div
      className="service-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/services/${service._id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={getImageUrl()}
            alt={service.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-2 right-2 bg-accent-pink text-white px-3 py-1 rounded-full text-sm">
            {service.duration} min
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary-brown mb-2 line-clamp-2">
            {service.name}
          </h3>

          <p className="text-text-dark text-sm mb-3 line-clamp-2">
            {service.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-accent-pink">
                {formatCurrency(service.price)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-1" />
              {service.duration} min
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge bg-secondary-beige text-primary-brown capitalize">
              {service.category?.replace('_', ' ')}
            </span>
            {service.department && (
              <span className="badge bg-secondary-beige text-primary-brown capitalize">
                {service.department}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;