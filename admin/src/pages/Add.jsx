import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { Upload, X } from 'lucide-react';
import { AdminUrl } from '../api';

const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa'];
const AVAILABILITY_TYPES = ['rent', 'buy'];
const AMENITIES = ['Lake View', 'Fireplace', 'Central heating and air conditioning', 'Dock', 'Pool', 'Garage', 'Garden', 'Gym', 'Security system', 'Master bathroom', 'Guest bathroom', 'Home theater', 'Exercise room/gym', 'Covered parking', 'High-speed internet ready'];
const FURNISHING_TYPES = ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'];
const PROPERTY_STATUS_TYPES = ['Under Construction', 'Ready to Move', 'New Launch', 'Resale'];
const FACING_DIRECTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];
const AGE_OF_PROPERTY_TYPES = ['0-1 year', '1-5 years', '5-10 years', '10+ years'];

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    availability: '',
    amenities: [],
    images: [],
    furnishing: '',
    propertyStatus: '',
    facingDirection: '',
    floorLevel: '',
    ageOfProperty: '',
    petFriendly: false,
    nearbyFacilities: {
      schools: [],
      hospitals: [],
      stations: [],
      malls: [],
      others: []
    },
    keywords: []
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newFacility, setNewFacility] = useState({ type: 'schools', name: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity]
      }));
      setNewAmenity('');
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword && !formData.keywords.includes(newKeyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword]
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleAddFacility = () => {
    if (newFacility.name) {
      setFormData(prev => ({
        ...prev,
        nearbyFacilities: {
          ...prev.nearbyFacilities,
          [newFacility.type]: [...prev.nearbyFacilities[newFacility.type], newFacility.name]
        }
      }));
      setNewFacility({ ...newFacility, name: '' });
    }
  };

  const handleRemoveFacility = (type, facility) => {
    setFormData(prev => ({
      ...prev,
      nearbyFacilities: {
        ...prev.nearbyFacilities,
        [type]: prev.nearbyFacilities[type].filter(f => f !== facility)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formdata = new FormData();
      formdata.append('title', formData.title);
      formdata.append('type', formData.type);
      formdata.append('price', formData.price);
      formdata.append('location', formData.location);
      formdata.append('description', formData.description);
      formdata.append('beds', formData.beds);
      formdata.append('baths', formData.baths);
      formdata.append('sqft', formData.sqft);
      formdata.append('phone', formData.phone);
      formdata.append('availability', formData.availability);
      formData.amenities.forEach((amenity, index) => {
        formdata.append(`amenities[${index}]`, amenity);
      });
      formData.images.forEach((image, index) => {
        formdata.append(`image${index + 1}`, image);
      });
      formdata.append('furnishing', formData.furnishing);
      formdata.append('propertyStatus', formData.propertyStatus);
      formdata.append('facingDirection', formData.facingDirection);
      formdata.append('floorLevel', formData.floorLevel);
      formdata.append('ageOfProperty', formData.ageOfProperty);
      formdata.append('petFriendly', formData.petFriendly);
      
      // Add nearbyFacilities as JSON
      formdata.append('nearbyFacilities', JSON.stringify(formData.nearbyFacilities));
      
      // Add keywords
      formData.keywords.forEach((keyword, index) => {
        formdata.append(`keywords[${index}]`, keyword);
      });

      const response = await axios.post(`${AdminUrl}/api/products/add`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: '',
          type: '',
          price: '',
          location: '',
          description: '',
          beds: '',
          baths: '',
          sqft: '',
          phone: '',
          availability: '',
          amenities: [],
          images: [],
          furnishing: '',
          propertyStatus: '',
          facingDirection: '',
          floorLevel: '',
          ageOfProperty: '',
          petFriendly: false,
          nearbyFacilities: {
            schools: [],
            hospitals: [],
            stations: [],
            malls: [],
            others: []
          },
          keywords: []
        });
        setPreviewUrls([]);
        toast.success('Property added successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Property Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 rounded-md border border-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full  rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  required
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Availability</option>
                  {AVAILABILITY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="beds"
                  name="beds"
                  required
                  min="0"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="baths" className="block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="baths"
                  name="baths"
                  required
                  min="0"
                  value={formData.baths}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
                  Square Feet
                </label>
                <input
                  type="number"
                  id="sqft"
                  name="sqft"
                  required
                  min="0"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border p-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Contact Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Additional Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="furnishing" className="block text-sm font-medium text-gray-700">
                  Furnishing
                </label>
                <select
                  id="furnishing"
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Furnishing</option>
                  {FURNISHING_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="propertyStatus" className="block text-sm font-medium text-gray-700">
                  Property Status
                </label>
                <select
                  id="propertyStatus"
                  name="propertyStatus"
                  value={formData.propertyStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Status</option>
                  {PROPERTY_STATUS_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="facingDirection" className="block text-sm font-medium text-gray-700">
                  Facing Direction
                </label>
                <select
                  id="facingDirection"
                  name="facingDirection"
                  value={formData.facingDirection}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Direction</option>
                  {FACING_DIRECTIONS.map(direction => (
                    <option key={direction} value={direction}>
                      {direction}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ageOfProperty" className="block text-sm font-medium text-gray-700">
                  Age of Property
                </label>
                <select
                  id="ageOfProperty"
                  name="ageOfProperty"
                  value={formData.ageOfProperty}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Age</option>
                  {AGE_OF_PROPERTY_TYPES.map(age => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="floorLevel" className="block text-sm font-medium text-gray-700">
                  Floor Level
                </label>
                <input
                  type="text"
                  id="floorLevel"
                  name="floorLevel"
                  value={formData.floorLevel}
                  onChange={handleInputChange}
                  placeholder="e.g., Ground Floor, 3rd Floor"
                  className="mt-1 block w-full p-2 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center mt-8">
                <input
                  type="checkbox"
                  id="petFriendly"
                  name="petFriendly"
                  checked={formData.petFriendly}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="petFriendly" className="ml-2 block text-sm text-gray-700">
                  Pet Friendly
                </label>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <span className="text-sm">{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword (e.g., sea view, garden facing)"
                className="mt-1 block w-full rounded-md border p-2 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Nearby Facilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nearby Facilities
            </label>
            
            {/* Display existing facilities */}
            {Object.entries(formData.nearbyFacilities).map(([type, facilities]) => (
              facilities.length > 0 && (
                <div key={type} className="mb-2">
                  <h4 className="text-sm font-medium capitalize">{type}</h4>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility, idx) => (
                      <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <span className="text-sm">{facility}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(type, facility)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
            
            {/* Add new facility */}
            <div className="flex items-center mt-2">
              <select
                value={newFacility.type}
                onChange={(e) => setNewFacility({ ...newFacility, type: e.target.value })}
                className="mt-1 w-1/3 rounded-md border p-2 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="schools">Schools</option>
                <option value="hospitals">Hospitals</option>
                <option value="stations">Stations</option>
                <option value="malls">Malls</option>
                <option value="others">Others</option>
              </select>
              <input
                type="text"
                value={newFacility.name}
                onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                placeholder={`Add nearby ${newFacility.type}`}
                className="mt-1 ml-2 block w-full rounded-md border p-2 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${index}`}
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="h-4 w-4 text-indigo-600 p-2 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`amenity-${index}`} className="ml-2 block text-sm text-gray-700">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add new amenity"
                className="mt-1 block w-full rounded-md border p-2 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images (Max 4)
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {previewUrls.length < 4 && (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;