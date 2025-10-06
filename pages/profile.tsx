import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { customerApi } from '../services/api';

export default function Profile() {
  const { customerInfo, loadAggregate } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    preferredName: customerInfo?.preferredName || '',
    firstname: customerInfo?.firstname || '',
    surname: customerInfo?.surname || '',
    dateOfBirth: customerInfo?.dateOfBirth || '',
    gender: customerInfo?.gender || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (field: string) => {
    if (!customerInfo?.id) return;

    setSubmitting(true);
    setError('');

    try {
      switch (field) {
        case 'preferredName':
          await customerApi.updatePreferredName(customerInfo.id, formData.preferredName);
          break;
        // Add other update API calls as they become available
        default:
          console.log(`Updating ${field} is not yet implemented`);
      }

      await loadAggregate();
      setEditing(null);
    } catch (err: any) {
      console.error(`Failed to update ${field}:`, err);
      setError(err.message || `Failed to update ${field}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (field: string) => {
    setEditing(null);
    setFormData({
      ...formData,
      [field]: customerInfo?.[field as keyof typeof customerInfo] || '',
    });
    setError('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getGenderDisplay = (gender?: string) => {
    if (!gender) return '';
    switch (gender) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      case 'other': return 'Other';
      case 'preferNotToSay': return 'Prefer not to say';
      default: return gender;
    }
  };

  const ProfileField = ({
    label,
    value,
    field,
    editable = true
  }: {
    label: string;
    value: string;
    field: string;
    editable?: boolean;
  }) => {
    const isEditing = editing === field;

    return (
      <div className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-1">
              {label}
            </p>
            {isEditing ? (
              <input
                type={field === 'dateOfBirth' ? 'date' : 'text'}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-3 py-2 border-2 border-vault-green rounded-lg focus:outline-none dark:bg-vault-gray-800 dark:text-white"
                autoFocus
              />
            ) : (
              <p className="text-lg font-semibold text-vault-black dark:text-white">
                {value || '—'}
              </p>
            )}
          </div>
          {editable && !isEditing && (
            <button
              onClick={() => setEditing(field)}
              className="ml-4 text-vault-green hover:text-vault-green-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
        {isEditing && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleSave(field)}
              disabled={submitting}
              className="px-4 py-2 bg-vault-green text-vault-black dark:text-white rounded-lg font-semibold hover:bg-vault-green-light transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => handleCancel(field)}
              disabled={submitting}
              className="px-4 py-2 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-lg font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <AppLayout title="Profile | Vault22">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/settings" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Settings
            </Link>
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Manage your personal information
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Personal Section */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-vault-gray-500 dark:text-vault-gray-400 uppercase tracking-wide mb-4">
              Personal
            </h2>
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6 divide-y divide-vault-gray-200 dark:divide-vault-gray-700">
              {/* Profile Picture & Nickname */}
              <div className="py-4 flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-vault-green to-vault-green-dark rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {(customerInfo?.preferredName || customerInfo?.firstname || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <ProfileField
                    label="Nickname"
                    value={customerInfo?.preferredName || ''}
                    field="preferredName"
                  />
                </div>
              </div>

              {/* Phone Number (non-editable) */}
              <ProfileField
                label="Phone Number"
                value={customerInfo?.mobileNumber || ''}
                field="mobileNumber"
                editable={false}
              />

              {/* First Name */}
              <ProfileField
                label="First Name"
                value={customerInfo?.firstname || ''}
                field="firstname"
                editable={false}
              />

              {/* Surname */}
              <ProfileField
                label="Surname"
                value={customerInfo?.surname || ''}
                field="surname"
                editable={false}
              />

              {/* Date of Birth */}
              <ProfileField
                label="Date of Birth"
                value={formatDate(customerInfo?.dateOfBirth)}
                field="dateOfBirth"
                editable={false}
              />

              {/* Gender */}
              <ProfileField
                label="Gender"
                value={getGenderDisplay(customerInfo?.gender)}
                field="gender"
                editable={false}
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-vault-gray-500 dark:text-vault-gray-400 uppercase tracking-wide mb-4">
              Account Information
            </h2>
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6 divide-y divide-vault-gray-200 dark:divide-vault-gray-700">
              {/* Email */}
              <ProfileField
                label="Email"
                value={customerInfo?.email || ''}
                field="email"
                editable={false}
              />

              {/* Customer ID */}
              <div className="py-4">
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-1">
                  Customer ID
                </p>
                <p className="text-lg font-mono text-vault-gray-500 dark:text-vault-gray-400">
                  {customerInfo?.id || '—'}
                </p>
              </div>

              {/* Default Currency */}
              <div className="py-4">
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-1">
                  Default Currency
                </p>
                <p className="text-lg font-semibold text-vault-black dark:text-white">
                  {customerInfo?.defaultCurrencyCode || '—'} ({customerInfo?.defaultCurrencySymbol || ''})
                </p>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-vault-blue/10 border border-vault-blue/30 rounded-xl p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-vault-blue mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">
                Some fields are currently read-only. Full editing capabilities will be added soon.
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
