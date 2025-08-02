import React from 'react';
import { 
  CheckCircleIcon,
  EyeIcon,
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Quality Excellence',
      description: 'We never compromise on quality, ensuring every product meets the highest standards.',
    },
    {
      icon: HeartIcon,
      title: 'Customer Focus',
      description: 'Our customers success is our success. We build lasting partnerships through trust.',
    },
    {
      icon: UserGroupIcon,
      title: 'Team Collaboration',
      description: 'We believe in the power of teamwork and collective expertise.',
    },
    {
      icon: AcademicCapIcon,
      title: 'Continuous Innovation',
      description: 'We constantly invest in research and development to improve our offerings.',
    },
  ];

  const achievements = [
    'Leading poultry feed manufacturer in Ethiopia',
    '7 state-of-the-art production facilities',
    'ISO 9001:2015 certified quality management',
    'Serving 1000+ satisfied customers nationwide',
    '15+ years of industry expertise',
    'Award-winning customer service',
  ];

  const timeline = [
    {
      year: '2008',
      title: 'Foundation',
      description: 'Dawi Zia LTD was established with the vision to revolutionize poultry farming in Ethiopia.',
    },
    {
      year: '2010',
      title: 'First Feed Mill',
      description: 'Opened our first premium feed mill in Addis Ababa with cutting-edge technology.',
    },
    {
      year: '2015',
      title: 'Expansion',
      description: 'Expanded operations to include veterinary supplies and quality assurance services.',
    },
    {
      year: '2018',
      title: 'Distribution Network',
      description: 'Launched nationwide distribution network covering all regions of Ethiopia.',
    },
    {
      year: '2020',
      title: 'Digital Innovation',
      description: 'Introduced digital platforms and AI-powered customer support systems.',
    },
    {
      year: '2024',
      title: 'Market Leadership',
      description: 'Achieved market leadership with 7 specialized companies under our umbrella.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white section-padding">
        <div className="container-custom text-center space-y-8">
          <h1 className="text-4xl lg:text-6xl font-bold">
            About Dawi Zia LTD
          </h1>
          <p className="text-xl lg:text-2xl text-secondary-300 max-w-4xl mx-auto leading-relaxed">
            We are Ethiopia's leading group of poultry feed mills, dedicated to providing 
            premium quality products and services that empower successful poultry farming.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <EyeIcon className="h-8 w-8 text-primary-600" />
                  <h2 className="text-3xl font-bold text-secondary-900">Our Vision</h2>
                </div>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  To be the most trusted and innovative leader in Ethiopia's poultry industry, 
                  driving sustainable growth and prosperity for farmers while ensuring food 
                  security for our nation.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <HeartIcon className="h-8 w-8 text-primary-600" />
                  <h2 className="text-3xl font-bold text-secondary-900">Our Mission</h2>
                </div>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  To provide comprehensive, high-quality poultry solutions through innovative 
                  feed production, premium raw materials, and advanced veterinary care, 
                  empowering farmers to achieve exceptional results while maintaining the 
                  highest standards of animal welfare and environmental responsibility.
                </p>
              </div>
            </div>

            <div className="bg-secondary-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">Our Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-success-600 flex-shrink-0 mt-0.5" />
                    <span className="text-secondary-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900">
              Our Core Values
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and every 
              relationship we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-custom transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900">
              Our Journey
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              From humble beginnings to industry leadership, here's how we've 
              grown over the years.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>

            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white z-10"></div>

                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="card p-6 hover:shadow-custom transition-all duration-300">
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-primary-600">
                          {event.year}
                        </div>
                        <h3 className="text-xl font-semibold text-secondary-900">
                          {event.title}
                        </h3>
                        <p className="text-secondary-600">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900">
              Leadership Team
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our experienced leadership team brings decades of expertise in 
              agriculture, business, and technology.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 lg:p-12 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <UserGroupIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900">
                Committed to Excellence
              </h3>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
                Our leadership team combines deep industry knowledge with innovative thinking 
                to drive Dawi Zia LTD forward. With backgrounds spanning agriculture, veterinary 
                science, business management, and technology, we bring a comprehensive approach 
                to serving our customers and growing our business.
              </p>
              <div className="flex justify-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-secondary-600">Years Combined Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">7</div>
                  <div className="text-secondary-600">Company Leaders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">100%</div>
                  <div className="text-secondary-600">Dedicated to Success</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};