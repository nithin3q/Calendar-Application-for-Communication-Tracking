import React from 'react'
const NextContactModal = ({ 
  show, 
  onClose, 
  methods,
  nextContactData,
  setNextContactData,
  onSubmit 
}) => {
  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-xl font-bold mb-4">Schedule Next Contact</h3>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Communication Type:
              </label>
              <select
                value={nextContactData.nextCommunicationType}
                onChange={(e) =>
                  setNextContactData((prev) => ({
                    ...prev,
                    nextCommunicationType: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Communication Type</option>
                {methods.map((method) => (
                  <option key={method._id} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Next Contact Date:
              </label>
              <input
                type="date"
                value={nextContactData.nextCommunicationDate}
                onChange={(e) =>
                  setNextContactData((prev) => ({
                    ...prev,
                    nextCommunicationDate: e.target.value,
                  }))
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default NextContactModal;
