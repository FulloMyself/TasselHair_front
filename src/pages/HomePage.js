import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpa, FaShoppingBag, FaGift, FaCalendarAlt } from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: FaSpa,
      title: 'Luxury Services',
      description: 'Indulge in our range of premium beauty and wellness treatments',
      link: '/services',
      color: 'bg-accent-pink',
    },
    {
      icon: FaShoppingBag,
      title: 'Shop Products',
      description: 'Discover our curated collection of beauty essentials',
      link: '/shop',
      color: 'bg-primary-brown',
    },
    {
      icon: FaGift,
      title: 'Gift Packages',
      description: 'Perfect gifts for your loved ones',
      link: '/gifts',
      color: 'bg-accent-pink',
    },
    {
      icon: FaCalendarAlt,
      title: 'Book Now',
      description: 'Schedule your appointment today',
      link: '/book',
      color: 'bg-primary-brown',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Tassel Beauty & Wellness
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your premier destination for beauty and wellness in Mulbarton
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/services" className="btn-primary inline-block">
              Explore Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container-custom">
        <h2 className="section-title">Our Offerings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link to={feature.link} className="block group">
                  <div className={`${feature.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-brown mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-dark">{feature.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary-beige">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-brown mb-6">
                About Tassel Beauty & Wellness
              </h2>
              <p className="text-text-dark mb-4">
                At Tassel Beauty & Wellness, we believe in enhancing your natural beauty 
                while promoting overall wellness. Our studio offers a harmonious blend of 
                traditional beauty services and modern wellness treatments.
              </p>
              <p className="text-text-dark mb-6">
                Located in the heart of Mulbarton, Gauteng, we provide a serene escape 
                from the everyday hustle, where you can relax, rejuvenate, and rediscover 
                your glow.
              </p>
              <Link to="/about" className="btn-secondary inline-block">
                Learn More About Us
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="/images/about-studio.jpg" 
                alt="Tassel Studio"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-pink text-white">
        <div className="container-custom text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Experience the Tassel Difference?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Book your appointment or shop our products today
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/book" className="bg-white text-accent-pink px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition transform hover:scale-105 inline-block">
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;