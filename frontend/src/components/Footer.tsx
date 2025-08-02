import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  BuildingOffice2Icon,
  CubeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Companies', path: '/companies' },
    { name: 'Contact', path: '/contact' },
  ];

  const products = [
    { name: 'Raw Materials', path: '/raw-materials', icon: CubeIcon },
    { name: 'Animal Medicines', path: '/animal-medicines', icon: HeartIcon },
  ];

  const contactInfo = [
    { icon: PhoneIcon, text: '+251-11-234-5678' },
    { icon: EnvelopeIcon, text: 'info@dawizia.com' },
    { icon: MapPinIcon, text: 'Addis Ababa, Ethiopia' },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">DZ</span>
              </div>
              <div>
                <span className="text-2xl font-bold">Dawi Zia</span>
                <p className="text-sm text-secondary-400 -mt-1">LTD</p>
              </div>
            </Link>
            <p className="text-secondary-300 leading-relaxed">
              Ethiopia's leading group of poultry feed mills, providing premium quality 
              products and services for successful poultry farming.
            </p>
            <div className="flex items-center space-x-2">
              <BuildingOffice2Icon className="h-5 w-5 text-primary-400" />
              <span className="text-secondary-300">7 Companies Nationwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-secondary-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Our Products</h3>
            <ul className="space-y-3">
              {products.map((product) => (
                <li key={product.name}>
                  <Link 
                    to={product.path}
                    className="flex items-center space-x-3 text-secondary-300 hover:text-white transition-colors duration-200 group"
                  >
                    <product.icon className="h-4 w-4 text-primary-400 group-hover:text-primary-300" />
                    <span>{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <contact.icon className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-300">{contact.text}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Business Hours</h4>
              <div className="text-sm text-secondary-400 space-y-1">
                <div>Mon - Fri: 8:00 AM - 6:00 PM</div>
                <div>Sat: 9:00 AM - 4:00 PM</div>
                <div>Sun: Closed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-secondary-400 text-sm">
              © {currentYear} Dawi Zia LTD. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};