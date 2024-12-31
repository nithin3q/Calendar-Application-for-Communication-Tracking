import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import BreadCrumbs from '../BreadCrumbs';

const ManageCommunicationMethods = () => {
  const { methods, addMethod, updateMethod, deleteMethod } = useContext(AppContext);

  const [newMethod, setNewMethod] = useState({
    name: '',
    description: '',
    sequence: methods.length + 1,
    mandatory: false,
  });

  const [editingMethod, setEditingMethod] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddMethod = () => {
    if (newMethod.name && newMethod.description) {
      addMethod(newMethod);
      setNewMethod({ name: '', description: '', sequence: methods.length + 1, mandatory: false });
      setShowForm(false);
    }
  };

  const handleDeleteMethod = (id) => {
    deleteMethod(id);
  };

  const handleUpdateMethod = (method) => {
    updateMethod(editingMethod);
    setEditingMethod(null);
  };

  const startEditing = (method) => {
    setEditingMethod({ ...method });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Communication Methods</h2>
            <BreadCrumbs className="mt-2" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Method
          </button>
        </div>

        {(showForm || editingMethod) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4">
              <h3 className="text-2xl font-semibold mb-6">
                {editingMethod ? 'Edit Communication Method' : 'Add New Communication Method'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter method name"
                    value={editingMethod ? editingMethod.name : newMethod.name}
                    onChange={(e) => editingMethod 
                      ? setEditingMethod({ ...editingMethod, name: e.target.value })
                      : setNewMethod({ ...newMethod, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description"
                    rows="3"
                    value={editingMethod ? editingMethod.description : newMethod.description}
                    onChange={(e) => editingMethod
                      ? setEditingMethod({ ...editingMethod, description: e.target.value })
                      : setNewMethod({ ...newMethod, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sequence</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editingMethod ? editingMethod.sequence : newMethod.sequence}
                      onChange={(e) => editingMethod
                        ? setEditingMethod({ ...editingMethod, sequence: parseInt(e.target.value) })
                        : setNewMethod({ ...newMethod, sequence: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <label className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={editingMethod ? editingMethod.mandatory : newMethod.mandatory}
                        onChange={(e) => editingMethod
                          ? setEditingMethod({ ...editingMethod, mandatory: e.target.checked })
                          : setNewMethod({ ...newMethod, mandatory: e.target.checked })}
                      />
                      <span className="text-gray-700">Mandatory</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingMethod(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={editingMethod ? handleUpdateMethod : handleAddMethod}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-150"
                >
                  {editingMethod ? 'Update Method' : 'Add Method'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {methods.map((method) => (
            <div key={method._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {method.sequence}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    method.mandatory 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {method.mandatory ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => startEditing(method)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this method?')) {
                        handleDeleteMethod(method._id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCommunicationMethods;