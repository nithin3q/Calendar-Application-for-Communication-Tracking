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

  const handleAddMethod = () => {
    if (newMethod.name && newMethod.description) {
      addMethod(newMethod);
      setNewMethod({ name: '', description: '', sequence: methods.length + 1, mandatory: false });
    }
  };

  const MethodForm = ({ data, setData, onSubmit, isEditing }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Method Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter method name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter description"
            rows="3"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sequence</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={data.sequence}
              onChange={(e) => setData({ ...data, sequence: parseInt(e.target.value) })}
            />
          </div>
          
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={data.mandatory}
                onChange={(e) => setData({ ...data, mandatory: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Mandatory</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onSubmit}
          >
            {isEditing ? 'Update Method' : 'Add Method'}
          </button>
          {isEditing && (
            <button 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
              onClick={() => setEditingMethod(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadCrumbs/>
      <div className="mb-8">
        {editingMethod ? (
          <MethodForm 
            data={editingMethod}
            setData={setEditingMethod}
            onSubmit={() => {
              updateMethod(editingMethod);
              setEditingMethod(null);
            }}
            isEditing={true}
          />
        ) : (
          <MethodForm 
            data={newMethod}
            setData={setNewMethod}
            onSubmit={handleAddMethod}
            isEditing={false}
          />
        )}
      </div>

      <div className="space-y-4">
        {methods.map((method) => (
          <div key={method._id} className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    method.mandatory 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {method.mandatory ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
                <p className="text-gray-600">{method.description}</p>
                <p className="text-sm text-gray-500">Sequence: {method.sequence}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingMethod(method)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Edit method"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteMethod(method._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete method"
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
  );
};

export default ManageCommunicationMethods;
