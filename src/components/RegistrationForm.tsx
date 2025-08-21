import React, { useState } from 'react';
import { Camera, X, Download, Edit3 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { FormData, FormErrors, PreviewImage, FormElementConfig, FormElementStyle } from '../types/form';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    gender: '',
    birthDate: '',
    subscribeNews: false,
    plan: '',
    pin: '',
    comments: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'preview' | 'editor'>('preview');

  const [formElements, setFormElements] = useState<FormElementConfig[]>([
    {
      id: 'fullname-field',
      type: 'text',
      label: 'Full Name *',
      placeholder: 'Enter your full name',
      style: { width: '100%', backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db', borderWidth: '1px' }
    },
    {
      id: 'gender-field',
      type: 'select',
      label: 'Gender *',
      options: ['Select gender', 'Male', 'Female', 'Other', 'Prefer not to say'],
      style: { width: '100%', backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db', borderWidth: '1px' }
    },
    {
      id: 'birthdate-field',
      type: 'date',
      label: 'Birth Date *',
      style: { width: '100%', backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db', borderWidth: '1px' }
    },
    {
      id: 'newsletter-field',
      type: 'checkbox',
      label: 'Subscribe to newsletter and updates',
      style: { width: '100%', backgroundColor: 'transparent', color: '#374151', borderColor: 'transparent', borderWidth: '0px' }
    },
    {
      id: 'plan-field',
      type: 'radio',
      label: 'Select Plan *',
      options: ['Basic Plan - $9.99/month', 'Intermediate Plan - $19.99/month', 'Advanced Plan - $29.99/month'],
      style: { width: '100%', backgroundColor: 'transparent', color: '#374151', borderColor: 'transparent', borderWidth: '0px' }
    },
    {
      id: 'pin-field',
      type: 'password',
      label: '4-Digit PIN *',
      placeholder: 'Enter 4-digit PIN',
      style: { width: '100%', backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db', borderWidth: '1px' }
    },
    {
      id: 'comments-field',
      type: 'textarea',
      label: 'Comments',
      placeholder: 'Enter any additional comments or feedback...',
      style: { width: '100%', height: '100px', backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db', borderWidth: '1px' }
    },
    {
      id: 'submit-button',
      type: 'button',
      label: 'Submit',
      buttonType: 'submit',
      style: { width: '100%', backgroundColor: '#2563eb', color: '#ffffff', borderColor: '#2563eb', borderWidth: '1px' }
    },
    {
      id: 'reset-button',
      type: 'button',
      label: 'Reset',
      buttonType: 'reset',
      style: { width: '100%', backgroundColor: '#4b5563', color: '#ffffff', borderColor: '#4b5563', borderWidth: '1px' }
    }
  ]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }

    if (!formData.plan) {
      newErrors.plan = 'Please select a plan';
    }

    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
    } else if (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
      newErrors.pin = 'PIN must be exactly 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    handleInputChange('pin', value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted successfully:', formData);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      gender: '',
      birthDate: '',
      subscribeNews: false,
      plan: '',
      pin: '',
      comments: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const generatePreview = async (elementId: string, elementName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsGenerating(elementId);
    
    try {
      const dataUrl = await htmlToImage.toPng(element, {
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        pixelRatio: 2,
      });

      const newImage: PreviewImage = {
        id: `${elementId}-${Date.now()}`,
        name: elementName,
        dataUrl,
        timestamp: new Date(),
      };

      setPreviewImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGenerating(null);
    }
  };

  const removePreview = (id: string) => {
    setPreviewImages(prev => prev.filter(img => img.id !== id));
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  };

  const selectElement = (elementId: string) => {
    setSelectedElement(elementId);
    setActivePanel('editor');
  };

  const updateElementConfig = (elementId: string, updates: Partial<FormElementConfig>) => {
    setFormElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const updateElementStyle = (elementId: string, styleUpdates: Partial<FormElementStyle>) => {
    setFormElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, style: { ...el.style, ...styleUpdates } } : el
    ));
  };

  const getElementConfig = (elementId: string) => {
    return formElements.find(el => el.id === elementId);
  };

  const ActionButtons: React.FC<{ elementId: string; elementName: string }> = ({ elementId, elementName }) => (
    <div className="flex items-center space-x-1">
      <button
        type="button"
        onClick={() => selectElement(elementId)}
        className={`p-2 rounded-md transition-colors ${
          selectedElement === elementId 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
        }`}
        title={`Edit ${elementName}`}
      >
        <Edit3 size={16} />
      </button>
      <button
        type="button"
        onClick={() => generatePreview(elementId, elementName)}
        disabled={isGenerating === elementId}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Generate preview of ${elementName}`}
      >
        <Camera size={16} className={isGenerating === elementId ? 'animate-pulse' : ''} />
      </button>
    </div>
  );

  const ElementEditor: React.FC = () => {
    if (!selectedElement) {
      return (
        <div className="text-center py-8">
          <Edit3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-sm">
            Select a form element to edit its properties
          </p>
        </div>
      );
    }

    const config = getElementConfig(selectedElement);
    if (!config) return null;

    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Editing: {config.label.replace(' *', '')}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Type: {config.type}
          </p>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={config.label}
            onChange={(e) => updateElementConfig(selectedElement, { label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Placeholder */}
        {(config.type === 'text' || config.type === 'password' || config.type === 'textarea' || config.type === 'button') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.type === 'button' ? 'Button Text' : 'Placeholder'}
            </label>
            <input
              type="text"
              value={config.type === 'button' ? config.label : (config.placeholder || '')}
              onChange={(e) => updateElementConfig(selectedElement, 
                config.type === 'button' 
                  ? { label: e.target.value }
                  : { placeholder: e.target.value }
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Options */}
        {(config.type === 'select' || config.type === 'radio') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options (one per line)
            </label>
            <textarea
              value={config.options?.join('\n') || ''}
              onChange={(e) => updateElementConfig(selectedElement, { 
                options: e.target.value.split('\n').filter(opt => opt.trim()) 
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width
            </label>
            <input
              type="text"
              value={config.style.width || '100%'}
              onChange={(e) => updateElementStyle(selectedElement, { width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100%, 200px, auto"
            />
          </div>
          {(config.type === 'textarea' || config.type === 'button') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <input
                type="text"
                value={config.style.height || 'auto'}
                onChange={(e) => updateElementStyle(selectedElement, { height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100px, auto"
              />
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={config.style.backgroundColor || '#ffffff'}
                onChange={(e) => updateElementStyle(selectedElement, { backgroundColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.style.backgroundColor || '#ffffff'}
                onChange={(e) => updateElementStyle(selectedElement, { backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={config.style.color || '#374151'}
                onChange={(e) => updateElementStyle(selectedElement, { color: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.style.color || '#374151'}
                onChange={(e) => updateElementStyle(selectedElement, { color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#374151"
              />
            </div>
          </div>
        </div>

        {/* Border */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={config.style.borderColor || '#d1d5db'}
                onChange={(e) => updateElementStyle(selectedElement, { borderColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.style.borderColor || '#d1d5db'}
                onChange={(e) => updateElementStyle(selectedElement, { borderColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#d1d5db"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Width
            </label>
            <input
              type="text"
              value={config.style.borderWidth || '1px'}
              onChange={(e) => updateElementStyle(selectedElement, { borderWidth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1px, 2px, 0px"
            />
          </div>
        </div>
      </div>
    );
  };

  const getElementStyle = (elementId: string) => {
    const config = getElementConfig(elementId);
    if (!config) return {};

    return {
      width: config.style.width,
      height: config.style.height,
      backgroundColor: config.style.backgroundColor,
      color: config.style.color,
      borderColor: config.style.borderColor,
      borderWidth: config.style.borderWidth,
      borderStyle: config.style.borderWidth !== '0px' ? 'solid' : 'none',
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Registration Form</h1>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">Form submitted successfully! Check console for data.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div 
                  id="fullname-field" 
                  className={`p-4 border rounded-md transition-all ${
                    selectedElement === 'fullname-field' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                  style={getElementStyle('fullname-field')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="fullName" className="block text-sm font-medium" style={{ color: getElementConfig('fullname-field')?.style.color }}>
                      {getElementConfig('fullname-field')?.label}
                    </label>
                    <ActionButtons elementId="fullname-field" elementName="Full Name Field" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.fullName ? 'border-red-300' : ''
                    }`}
                    placeholder={getElementConfig('fullname-field')?.placeholder}
                    style={{
                      backgroundColor: getElementConfig('fullname-field')?.style.backgroundColor,
                      color: getElementConfig('fullname-field')?.style.color,
                      borderColor: errors.fullName ? '#fca5a5' : getElementConfig('fullname-field')?.style.borderColor,
                      borderWidth: getElementConfig('fullname-field')?.style.borderWidth,
                    }}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Gender */}
                <div 
                  id="gender-field" 
                  className={`p-4 border rounded-md transition-all ${
                    selectedElement === 'gender-field' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                  style={getElementStyle('gender-field')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="gender" className="block text-sm font-medium" style={{ color: getElementConfig('gender-field')?.style.color }}>
                      {getElementConfig('gender-field')?.label}
                    </label>
                    <ActionButtons elementId="gender-field" elementName="Gender Field" />
                  </div>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.gender ? 'border-red-300' : ''
                    }`}
                    style={{
                      backgroundColor: getElementConfig('gender-field')?.style.backgroundColor,
                      color: getElementConfig('gender-field')?.style.color,
                      borderColor: errors.gender ? '#fca5a5' : getElementConfig('gender-field')?.style.borderColor,
                      borderWidth: getElementConfig('gender-field')?.style.borderWidth,
                    }}
                  >
                    {getElementConfig('gender-field')?.options?.map((option, index) => (
                      <option key={index} value={index === 0 ? '' : option.toLowerCase().replace(/\s+/g, '-')}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div 
                  id="birthdate-field" 
                  className={`p-4 border rounded-md transition-all ${
                    selectedElement === 'birthdate-field' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                  style={getElementStyle('birthdate-field')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="birthDate" className="block text-sm font-medium" style={{ color: getElementConfig('birthdate-field')?.style.color }}>
                      {getElementConfig('birthdate-field')?.label}
                    </label>
                    <ActionButtons elementId="birthdate-field" elementName="Birth Date Field" />
                  </div>
                  <input
                    type="date"
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.birthDate ? 'border-red-300' : ''
                    }`}
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                      backgroundColor: getElementConfig('birthdate-field')?.style.backgroundColor,
                      color: getElementConfig('birthdate-field')?.style.color,
                      borderColor: errors.birthDate ? '#fca5a5' : getElementConfig('birthdate-field')?.style.borderColor,
                      borderWidth: getElementConfig('birthdate-field')?.style.borderWidth,
                    }}
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                  )}
                </div>

                {/* Subscribe News */}
                <div 
                  id="newsletter-field" 
                  className={`p-4 border rounded-md transition-all ${
                    selectedElement === 'newsletter-field' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                  style={getElementStyle('newsletter-field')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="subscribeNews"
                        checked={formData.subscribeNews}
                        onChange={(e) => handleInputChange('subscribeNews', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="subscribeNews" className="ml-2 block text-sm" style={{ color: getElementConfig('newsletter-field')?.style.color }}>
                        {getElementConfig('newsletter-field')?.label}
                      </label>
                    </div>
                    <ActionButtons elementId="newsletter-field" elementName="Newsletter Field" />
                  </div>
                </div>

                {/* Plan Selection */}
                <div 
                  id="plan-field" 
                  className={`p-4 border rounded-md transition-all ${
                    selectedElement === 'plan-field' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                  style={getElementStyle('plan-field')}
                >
                  <fieldset>
                    <div className="flex items-center justify-between mb-3">
                      <legend className="block text-sm font-medium" style={{ color: getElementConfig('plan-field')?.style.color }}>
                        {getElementConfig('plan-field')?.label}
                      </legend>
                      <ActionButtons elementId="plan-field" elementName="Plan Selection Field" />
                    </div>
                    <div className="space-y-2">
                      {getElementConfig('plan-field')?.options?.map((option, index) => {
                        const value = ['basic', 'intermediate', 'advanced'][index];
                        return (
                          <div key={value} className="flex items-center">
                            <input
                              type="radio"
                              id={value}
                              name="plan"
                              value={value}
                              checked={formData.plan === value}
                              onChange={(e) => handleInputChange('plan', e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor={value} className="ml-2 block text-sm" style={{ color: getElementConfig('plan-field')?.style.color }}>
                              {option}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    {errors.plan && (
                      <p className="mt-1 text-sm text-red-600">{errors.plan}</p>
                    )}
                  </fieldset>
                </div>

                {/* PIN */}
                <div 
                  id="pin-field" 
                  className={`p-4 border rounded-md transition-all ${
                    selectedElement === 'pin-field' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                  style={getElementStyle('pin-field')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="pin" className="block text-sm font-medium" style={{ color: getElementConfig('pin-field')?.style.color }}>
                      {getElementConfig('pin-field')?.label}
                    </label>
                    <ActionButtons elementId="pin-field" elementName="PIN Field" />
                  </div>
                  <input
                    type="password"
                    id="pin"
                    value={formData.pin}
                    onChange={handlePinChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.pin ? 'border-red-300' : ''
                    }`}
                    placeholder={getElementConfig('pin-field')?.placeholder}
                    maxLength={4}
                    style={{
                      backgroundColor: getElementConfig('pin-field')?.style.backgroundColor,
                      color: getElementConfig('pin-field')?.style.color,
                      borderColor: errors.pin ? '#fca5a5' : getElementConfig('pin-field')?.style.borderColor,
                      borderWidth: getElementConfig('pin-field')?.style.borderWidth,
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.pin.length}/4 digits
                  </p>
                  {errors.pin && (
                    <p className="mt-1 text-sm text-red-600">{errors.pin}</p>
                  )}
                </div>

                {/* Comments */}
                <div 
                  id="comments-field" 
                  className={`p-4 border rounded-md transition-all ${
                    selectedElement === 'comments-field' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                  style={getElementStyle('comments-field')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="comments" className="block text-sm font-medium" style={{ color: getElementConfig('comments-field')?.style.color }}>
                      {getElementConfig('comments-field')?.label}
                    </label>
                    <ActionButtons elementId="comments-field" elementName="Comments Field" />
                  </div>
                  <textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder={getElementConfig('comments-field')?.placeholder}
                    maxLength={500}
                    style={{
                      height: getElementConfig('comments-field')?.style.height,
                      backgroundColor: getElementConfig('comments-field')?.style.backgroundColor,
                      color: getElementConfig('comments-field')?.style.color,
                      borderColor: getElementConfig('comments-field')?.style.borderColor,
                      borderWidth: getElementConfig('comments-field')?.style.borderWidth,
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {formData.comments.length}/500 characters
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  {/* Submit Button */}
                  <div 
                    id="submit-button" 
                    className={`flex-1 p-4 border rounded-md transition-all ${
                      selectedElement === 'submit-button' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                    }`}
                    style={getElementStyle('submit-button')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: getElementConfig('submit-button')?.style.color }}>
                        Submit Button
                      </span>
                      <ActionButtons elementId="submit-button" elementName="Submit Button" />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                      style={{
                        width: getElementConfig('submit-button')?.style.width,
                        height: getElementConfig('submit-button')?.style.height,
                        backgroundColor: getElementConfig('submit-button')?.style.backgroundColor,
                        color: getElementConfig('submit-button')?.style.color,
                        borderColor: getElementConfig('submit-button')?.style.borderColor,
                        borderWidth: getElementConfig('submit-button')?.style.borderWidth,
                        borderStyle: getElementConfig('submit-button')?.style.borderWidth !== '0px' ? 'solid' : 'none',
                      }}
                    >
                      {getElementConfig('submit-button')?.label}
                    </button>
                  </div>

                  {/* Reset Button */}
                  <div 
                    id="reset-button" 
                    className={`flex-1 p-4 border rounded-md transition-all ${
                      selectedElement === 'reset-button' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                    }`}
                    style={getElementStyle('reset-button')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: getElementConfig('reset-button')?.style.color }}>
                        Reset Button
                      </span>
                      <ActionButtons elementId="reset-button" elementName="Reset Button" />
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                      style={{
                        width: getElementConfig('reset-button')?.style.width,
                        height: getElementConfig('reset-button')?.style.height,
                        backgroundColor: getElementConfig('reset-button')?.style.backgroundColor,
                        color: getElementConfig('reset-button')?.style.color,
                        borderColor: getElementConfig('reset-button')?.style.borderColor,
                        borderWidth: getElementConfig('reset-button')?.style.borderWidth,
                        borderStyle: getElementConfig('reset-button')?.style.borderWidth !== '0px' ? 'solid' : 'none',
                      }}
                    >
                      {getElementConfig('reset-button')?.label}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              {/* Panel Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActivePanel('preview')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    activePanel === 'preview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActivePanel('editor')}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    activePanel === 'editor'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Editor
                </button>
              </div>

              {/* Panel Content */}
              {activePanel === 'preview' ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Form Element Previews</h2>
                  
                  {previewImages.length === 0 ? (
                    <div className="text-center py-8">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-sm">
                        Click the camera icons next to form elements to generate previews
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {previewImages.map((image) => (
                        <div key={image.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700 truncate">
                              {image.name}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => downloadImage(image.dataUrl, image.name)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Download image"
                              >
                                <Download size={14} />
                              </button>
                              <button
                                onClick={() => removePreview(image.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Remove preview"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                          <img
                            src={image.dataUrl}
                            alt={`Preview of ${image.name}`}
                            className="w-full h-auto border border-gray-100 rounded"
                          />
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-400">
                              {image.timestamp.toLocaleTimeString()}
                            </p>
                            {(() => {
                              const elementId = image.id.split('-').slice(0, -1).join('-');
                              const config = getElementConfig(elementId);
                              if (config) {
                                return (
                                  <div className="text-xs text-gray-500 space-y-0.5">
                                    <div className="flex justify-between">
                                      <span>Width:</span>
                                      <span className="font-mono">{config.style.width || 'auto'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Height:</span>
                                      <span className="font-mono">{config.style.height || 'auto'}</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Element Editor</h2>
                  <div className="max-h-96 overflow-y-auto">
                    <ElementEditor />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;