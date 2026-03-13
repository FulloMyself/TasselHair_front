import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaHeart, FaStar, FaUsers } from 'react-icons/fa';

const AboutPage = () => {
  const values = [
    {
      icon: FaLeaf,
      title: 'Natural Beauty',
      description: 'We believe in enhancing your natural beauty with premium products and expert care.'
    },
    {
      icon: FaHeart,
      title: 'Passion & Care',
      description: 'Every service is delivered with genuine care and attention to detail.'
    },
    {
      icon: FaStar,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from services to customer experience.'
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Building a community of confident, beautiful individuals.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Senior Stylist',
      image: '/images/team/sarah.jpg',
      bio: 'With over 15 years of experience in the beauty industry, Sarah founded Tassel to create a sanctuary for wellness and beauty.'
    },
    {
      name: 'Michelle Williams',
      role: 'Lead Esthetician',
      image: '/images/team/michelle.jpg',
      bio: 'Specializing in skincare and advanced facial treatments, Michelle ensures every client leaves with glowing skin.'
    },
    {
      name: 'Thabo Ndlovu',
      role: 'Master Barber',
      image: '/images/team/thabo.jpg',
      bio: 'Thabo brings precision and artistry to every cut and style, with expertise in both traditional and modern techniques.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/about-hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-white text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Tassel Beauty & Wellness</h1>
          <p className="text-xl">Your journey to beauty and wellness begins here</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-primary-beige">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary-brown mb-6">
                Our Story
              </h2>
              <p className="text-text-dark mb-4">
                Founded in 2018, Tassel Beauty & Wellness Studio began with a simple vision: 
                to create a space where beauty meets wellness, and where every client feels 
                valued, beautiful, and rejuvenated.
              </p>
              <p className="text-text-dark mb-4">
                Located in the heart of Mulbarton, Gauteng, our studio has grown from a small 
                salon to a full-service beauty and wellness destination. We've expanded our 
                services to include everything from traditional hair styling to advanced 
                skincare treatments, all while maintaining the personal touch that our clients love.
              </p>
              <p className="text-text-dark">
                Today, we're proud to be a trusted name in the community, known for our 
                expertise, professionalism, and genuine care for every client who walks 
                through our doors.
              </p>
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
                alt="Tassel Studio Interior"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="section-title">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-accent-pink rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-brown mb-2">
                    {value.title}
                  </h3>
                  <p className="text-text-dark">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-primary-beige">
        <div className="container-custom">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary-brown mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent-pink font-medium mb-3">{member.role}</p>
                  <p className="text-text-dark">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-pink text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the Tassel Difference
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your appointment today and let us help you look and feel your best.
          </p>
          <a href="/book" className="inline-block bg-white text-accent-pink px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition transform hover:scale-105">
            Book Now
          </a>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;