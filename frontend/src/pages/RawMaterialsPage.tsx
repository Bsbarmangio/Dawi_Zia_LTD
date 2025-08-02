import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, CubeIcon } from '@heroicons/react/24/outline';
import { RawMaterial, rawMaterialsApi } from '../utils/api';

export const RawMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await rawMaterialsApi.getAll({ search: searchTerm });
        setMaterials(response.data.data);
      } catch (err) {
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [searchTerm]);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero text-white section-padding">
        <div className="container-custom text-center space-y-8">
          <h1 className="text-4xl lg:text-6xl font-bold">Raw Materials</h1>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Premium quality raw materials for optimal poultry nutrition
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {materials.map((material) => (
                <div key={material.id} className="card p-6 hover:shadow-custom transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <CubeIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900">{material.name}</h3>
                    <p className="text-secondary-600">{material.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-500">{material.category}</span>
                      <span className="font-semibold text-primary-600">
                        ${material.price?.toFixed(2) || 'N/A'}/{material.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};