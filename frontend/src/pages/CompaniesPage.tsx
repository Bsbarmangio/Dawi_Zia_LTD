import React, { useEffect, useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Company, companiesApi } from '../utils/api';

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companiesApi.getAll();
        setCompanies(response.data.data);
      } catch (err) {
        setError('Failed to load companies. Please try again later.');
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-danger-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white section-padding">
        <div className="container-custom text-center space-y-8">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Our Companies
          </h1>
          <p className="text-xl lg:text-2xl text-secondary-300 max-w-4xl mx-auto leading-relaxed">
            Discover the 7 specialized companies that make up the Dawi Zia LTD family, 
            each dedicated to excellence in their respective fields.
          </p>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company) => (
              <div key={company.id} className="card overflow-hidden hover:shadow-custom transition-all duration-300">
                {/* Company Header */}
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{company.name}</h3>
                    <div className="flex items-center space-x-2 text-primary-100">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">Est. {company.established_year}</span>
                    </div>
                  </div>
                </div>

                {/* Company Content */}
                <div className="p-6 space-y-6">
                  <p className="text-secondary-600 leading-relaxed">
                    {company.description}
                  </p>

                  <div className="space-y-3">
                    {/* Location */}
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">{company.location}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <a 
                        href={`tel:${company.phone}`}
                        className="text-secondary-700 hover:text-primary-600 transition-colors"
                      >
                        {company.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                      <a 
                        href={`mailto:${company.email}`}
                        className="text-secondary-700 hover:text-primary-600 transition-colors"
                      >
                        {company.email}
                      </a>
                    </div>

                    {/* Website */}
                    {company.website && (
                      <div className="flex items-center space-x-3">
                        <GlobeAltIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                        <a 
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-700 hover:text-primary-600 transition-colors"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="pt-4 border-t border-secondary-200">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      company.status === 'active' 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-secondary-100 text-secondary-600'
                    }`}>
                      {company.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {companies.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-secondary-600">No companies found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900">
              Partner with Our Network
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Each of our companies brings specialized expertise to serve your unique needs. 
              Contact us to find the perfect partner for your business.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary">
              Contact Our Team
            </a>
            <a href="/raw-materials" className="btn-outline">
              View Our Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};