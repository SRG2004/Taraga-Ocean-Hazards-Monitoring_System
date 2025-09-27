import React, { useState } from 'react';
import { 
  MapPin,
  Camera,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  X,
  Upload,
  CheckCircle
} from 'lucide-react';

interface ReportHazardFormProps {
  onClose?: () => void;
  onSubmit?: (report: any) => void;
}

export const ReportHazardForm: React.FC<ReportHazardFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    severity: '',
    description: '',
    location: {
      latitude: '',
      longitude: '',
      address: ''
    },
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const hazardTypes = [
    { value: 'cyclone', label: 'Cyclone/Storm', icon: '🌀' },
    { value: 'flood', label: 'Coastal Flooding', icon: '🌊' },
    { value: 'tsunami', label: 'Tsunami Warning', icon: '🌊' },
    { value: 'erosion', label: 'Coastal Erosion', icon: '🏔️' },
    { value: 'pollution', label: 'Ocean Pollution', icon: '🛢️' },
    { value: 'wildlife', label: 'Marine Wildlife Issue', icon: '🐟' },
    { value: 'navigation', label: 'Navigation Hazard', icon: '⚓' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', description: 'Minor concern, no immediate danger' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Moderate risk, attention needed' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Significant risk, urgent action required' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Immediate danger to life/property' }
  ];

  const getCurrentLocation = () => {
    setUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            }
          }));
          setUseCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUseCurrentLocation(false);
        }
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 3 - images.length);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const report = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        images: images.length,
        status: 'pending'
      };
      
      onSubmit?.(report);
      setIsSubmitting(false);
      onClose?.();
    }, 2000);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.type && formData.severity && formData.title.trim() && formData.description.trim());
      case 2:
        return !!(formData.location.latitude && formData.location.longitude);
      case 3:
        return !!(formData.contact.name.trim() && formData.contact.phone.trim());
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Report Ocean Hazard</h2>
                <p className="text-red-100">Help protect our coastal communities</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-red-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6 flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step <= currentStep ? 'bg-white text-red-500' : 'bg-red-400 text-red-100'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`h-1 w-16 mx-2 rounded-full transition-all ${
                    step < currentStep ? 'bg-white' : 'bg-red-400'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Hazard Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Hazard Information</h3>
                
                {/* Hazard Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    What type of ocean hazard are you reporting? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {hazardTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        className={`p-4 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                          formData.type === type.value
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Severity Level */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Severity Level *
                  </label>
                  <div className="space-y-3">
                    {severityLevels.map((level) => (
                      <label
                        key={level.value}
                        className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.severity === level.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="severity"
                          value={level.value}
                          checked={formData.severity === level.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${level.color}`}>
                              {level.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Title and Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brief Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Large waves causing coastal flooding"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed information about the hazard, including what you observed, when it started, and any impacts..."
                    rows={6}
                    className="input resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Media */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location & Evidence</h3>
              
              {/* Location */}
              <div className="card-feature">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold">Hazard Location</h4>
                </div>
                
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={useCurrentLocation}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{useCurrentLocation ? 'Getting location...' : 'Use Current Location'}</span>
                    {useCurrentLocation && <div className="loading" />}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
                      <input
                        type="text"
                        value={formData.location.latitude}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          location: { ...prev.location, latitude: e.target.value }
                        }))}
                        placeholder="19.0760"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
                      <input
                        type="text"
                        value={formData.location.longitude}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          location: { ...prev.location, longitude: e.target.value }
                        }))}
                        placeholder="72.8777"
                        className="input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address/Landmark</label>
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, address: e.target.value }
                      }))}
                      placeholder="e.g., Marine Drive, Mumbai or nearest landmark"
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="card-feature">
                <div className="flex items-center space-x-3 mb-4">
                  <Camera className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-semibold">Photo Evidence (Optional)</h4>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Upload up to 3 photos to help authorities assess the situation
                  </p>
                  
                  {images.length < 3 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-600">Click to upload photos</p>
                        <p className="text-xs text-gray-500">JPG, PNG up to 5MB each</p>
                      </label>
                    </div>
                  )}
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="card-feature">
                <p className="text-gray-600 mb-6">
                  Your contact information helps authorities reach you for follow-up questions or updates.
                  This information is kept confidential and used only for official purposes.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.contact.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, name: e.target.value }
                      }))}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.contact.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value }
                      }))}
                      placeholder="+91 98765 43210"
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                      placeholder="your.email@example.com"
                      className="input"
                    />
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Important:</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Your report will be reviewed by authorities within 30 minutes</li>
                        <li>• You may be contacted for additional information</li>
                        <li>• False reports may result in legal consequences</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Previous
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of 3
            </div>
            
            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className={`btn-primary ${!validateStep(currentStep) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={!validateStep(currentStep) ? 'Please fill in all required fields' : ''}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !validateStep(1) || !validateStep(2) || !validateStep(3)}
                  className={`btn-error flex items-center space-x-2 ${(!validateStep(1) || !validateStep(2) || !validateStep(3)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={(!validateStep(1) || !validateStep(2) || !validateStep(3)) ? 'Please complete all required fields' : ''}
                >
                  {isSubmitting && <div className="loading" />}
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};