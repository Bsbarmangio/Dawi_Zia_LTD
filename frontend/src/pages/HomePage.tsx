import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOffice2Icon, 
  CubeIcon, 
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  BeakerIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: BuildingOffice2Icon,
      title: '7 State-of-the-Art Facilities',
      description: 'Modern feed mills and production facilities across Ethiopia',
    },
    {
      icon: CubeIcon,
      title: 'Premium Raw Materials',
      description: 'High-quality grains, proteins, and minerals for optimal nutrition',
    },
    {
      icon: HeartIcon,
      title: 'Animal Health Solutions',
      description: 'Comprehensive veterinary medicines and supplements',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control at every step',
    },
    {
      icon: TruckIcon,
      title: 'Nationwide Distribution',
      description: 'Reliable delivery network throughout Ethiopia',
    },
    {
      icon: BeakerIcon,
      title: 'Research & Development',
      description: 'Continuous innovation in poultry nutrition',
    },
  ];

  const stats = [
    { number: '7', label: 'Companies' },
    { number: '15+', label: 'Years Experience' },
    { number: '1000+', label: 'Products' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Leading Poultry
                  <span className="text-gradient block">Feed Solutions</span>
                  in Ethiopia
                </h1>
                <p className="text-xl text-secondary-300 leading-relaxed">
                  Dawi Zia LTD is your trusted partner for premium poultry feed, raw materials, 
                  and animal medicines. With 7 specialized companies, we deliver excellence 
                  across the entire poultry supply chain.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/companies" className="btn-primary inline-flex items-center justify-center">
                  Explore Our Companies
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Get In Touch
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-secondary-300">+251-11-234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                  <span className="text-secondary-300">info@dawizia.com</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
                <div className="grid grid-cols-2 gap-6 text-center">
                  {stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-3xl lg:text-4xl font-bold text-white">
                        {stat.number}
                      </div>
                      <div className="text-secondary-300 text-sm lg:text-base">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900">
              Why Choose Dawi Zia LTD?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We provide comprehensive solutions for all your poultry needs, 
              from premium feed production to advanced veterinary care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 hover:shadow-custom transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900">
              Our Product Range
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              From high-quality raw materials to specialized animal medicines, 
              we have everything you need for successful poultry farming.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Raw Materials Card */}
            <div className="card overflow-hidden group">
              <div className="h-48 bg-gradient-to-br from-success-400 to-success-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <CubeIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-semibold text-secondary-900">
                  Raw Materials
                </h3>
                <p className="text-secondary-600">
                  Premium corn, soybean meal, fish meal, and other high-quality 
                  ingredients for optimal poultry nutrition.
                </p>
                <Link 
                  to="/raw-materials" 
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All Materials
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Animal Medicines Card */}
            <div className="card overflow-hidden group">
              <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <HeartIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-semibold text-secondary-900">
                  Animal Medicines
                </h3>
                <p className="text-secondary-600">
                  Comprehensive veterinary solutions including vitamins, 
                  antibiotics, and specialized treatments for poultry health.
                </p>
                <Link 
                  to="/animal-medicines" 
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All Medicines
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Partner with Us?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Dawi Zia LTD 
              for their poultry farming needs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-600 hover:bg-primary-50 btn-primary">
              Contact Us Today
            </Link>
            <Link to="/about" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-primary">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};