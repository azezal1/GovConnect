import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin,
  FaPaperPlane,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import Card from './shared/Card';
import Button from './shared/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'citizen'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        userType: 'citizen'
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: ['contact@govconnect.gov', 'support@govconnect.gov'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      details: ['123 Government Street', 'Capital City, CC 12345'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaClock,
      title: 'Office Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  const departments = [
    {
      name: 'General Support',
      email: 'support@govconnect.gov',
      description: 'General questions and technical support'
    },
    {
      name: 'Government Relations',
      email: 'government@govconnect.gov',
      description: 'Partnership inquiries and government onboarding'
    },
    {
      name: 'Citizen Services',
      email: 'citizens@govconnect.gov',
      description: 'Citizen account support and complaint assistance'
    },
    {
      name: 'Press & Media',
      email: 'press@govconnect.gov',
      description: 'Media inquiries and press releases'
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', name: 'Facebook', color: 'hover:text-blue-600' },
    { icon: FaTwitter, href: '#', name: 'Twitter', color: 'hover:text-blue-400' },
    { icon: FaLinkedin, href: '#', name: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium mb-8">
            <FaEnvelope className="mr-2" />
            Get In Touch
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contact
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GovConnect
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or need support? We're here to help you make the most 
            of your civic engagement experience.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-8 text-center" hover={true} gradient={true}>
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${info.color} text-white rounded-2xl mb-6`}>
                  <info.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              <Card className="p-8" gradient={true}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          value="citizen"
                          checked={formData.userType === 'citizen'}
                          onChange={handleInputChange}
                          className="mr-2 text-blue-600"
                        />
                        <FaUser className="mr-2 text-blue-600" />
                        Citizen
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          value="government"
                          checked={formData.userType === 'government'}
                          onChange={handleInputChange}
                          className="mr-2 text-blue-600"
                        />
                        <FaBuilding className="mr-2 text-blue-600" />
                        Government Official
                      </label>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting}
                    icon={<FaPaperPlane />}
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Choose the best way to reach us based on your needs.
              </p>

              {/* Departments */}
              <div className="space-y-6 mb-12">
                {departments.map((dept, index) => (
                  <Card key={index} className="p-6" hover={true}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{dept.email}</p>
                    <p className="text-gray-600 text-sm">{dept.description}</p>
                  </Card>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`p-4 bg-gray-100 rounded-lg text-gray-600 ${social.color} transition-all duration-300 hover:scale-110`}
                      aria-label={social.name}
                    >
                      <social.icon className="text-xl" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <Card className="mt-8 p-8 text-center" gradient={true}>
                <FaMapMarkerAlt className="text-5xl text-blue-500 mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Office</h3>
                <p className="text-gray-600 mb-4">
                  123 Government Street<br />
                  Capital City, CC 12345
                </p>
                <Button variant="outline" size="md">
                  Get Directions
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about GovConnect
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How do I submit a complaint?",
                answer: "Simply create an account, log in, and use our complaint submission form. Add photos, descriptions, and location details to help us process your request faster."
              },
              {
                question: "How long does it take to resolve issues?",
                answer: "Resolution times vary by issue type and complexity. Most issues are acknowledged within 24 hours, and we provide regular updates throughout the process."
              },
              {
                question: "Is my personal information secure?",
                answer: "Yes, we use industry-standard encryption and security measures to protect your data. We never share personal information without your consent."
              },
              {
                question: "Can government officials use this platform?",
                answer: "Absolutely! We offer specialized dashboards for government officials to manage complaints, track analytics, and communicate with citizens."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6" hover={true}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
