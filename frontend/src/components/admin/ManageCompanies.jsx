import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import BreadCrumbs from '../BreadCrumbs';

const ManageCompanies = () => {
  const { companies, addCompany, updateCompany, deleteCompany } = useContext(AppContext);
  const [company, setCompany] = useState({
    _id: null,
    name: '',
    location: '',
    linkedInProfile: '',
    emails: '',
    phoneNumbers: '',
    comments: '',
    communicationPeriodicity: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!company.name || !company.location) {
      setErrorMessage('Company Name and Location are required!');
      return;
    }

    setErrorMessage(''); // Reset error message

    if (isEditing) {
      updateCompany(company);
      alert('Company updated successfully');
    } else {
      addCompany(company);
      alert('Company added successfully');
    }
    resetForm();
  };

  const handleEdit = (companyToEdit) => {
    setCompany(companyToEdit);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(id);
      alert('Company deleted successfully');
    }
  };

  const resetForm = () => {
    setCompany({
      _id: null,
      name: '',
      location: '',
      linkedInProfile: '',
      emails: '',
      phoneNumbers: '',
      comments: '',
      communicationPeriodicity: '',
    });
    setIsEditing(false);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumbs />

        <div className="flex justify-between items-center mb-8">
          
          <h1 className="text-3xl font-extrabold text-gray-900">Company Management Dashboard</h1>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium"
            >
              Add Company
            </button>
          ) : (
            <button
              type="button"
              onClick={resetForm}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium"
            >
              Companies List
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {isEditing ? 'Edit Company' : 'Add New Company'}
            </h2>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={company.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <input
                  type="text"
                  name="linkedInProfile"
                  value={company.linkedInProfile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emails</label>
                <input
                  type="text"
                  name="emails"
                  value={company.emails}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
                <input
                  type="text"
                  name="phoneNumbers"
                  value={company.phoneNumbers}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Communication Periodicity</label>
                <input
                  type="text"
                  name="communicationPeriodicity"
                  value={company.communicationPeriodicity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  name="comments"
                  value={company.comments}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className={`${
                    isEditing ? 'bg-green-600' : 'bg-blue-600'
                  } text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium`}
                >
                  {isEditing ? 'Update Company' : 'Add Company'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Companies List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(company)}
                        className="bg-amber-500 text-white px-4 py-1.5 rounded-md hover:bg-amber-600 transition-colors duration-200 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;
