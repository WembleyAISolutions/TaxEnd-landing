'use client'

import { FileText, Download, Eye, Clock, CheckCircle, Plus } from 'lucide-react'

const returns = [
  {
    id: 1,
    year: '2023-24',
    status: 'completed',
    submittedDate: '2024-07-15',
    refund: '$1,832',
    documents: 12,
  },
  {
    id: 2,
    year: '2022-23',
    status: 'completed',
    submittedDate: '2023-08-22',
    refund: '$2,145',
    documents: 15,
  },
  {
    id: 3,
    year: '2021-22',
    status: 'completed',
    submittedDate: '2022-09-10',
    refund: '$987',
    documents: 10,
  },
]

export default function TaxReturnsPage() {
  const handleViewReturn = (returnId: number) => {
    alert(`Viewing tax return ${returnId}...`)
  }

  const handleDownloadReturn = (returnId: number) => {
    alert(`Downloading tax return ${returnId}...`)
  }

  const handleNewReturn = () => {
    alert('Starting new tax return...')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Returns</h1>
          <p className="text-gray-600 mt-2">View and manage your tax return history</p>
        </div>
        <button 
          onClick={handleNewReturn}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Plus className="mr-2" size={18} />
          New Return
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700">Tax Year</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Submitted</th>
                <th className="text-left p-4 font-medium text-gray-700">Refund</th>
                <th className="text-left p-4 font-medium text-gray-700">Documents</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((taxReturn) => (
                <tr key={taxReturn.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <FileText className="text-gray-400 mr-2" size={20} />
                      <span className="font-medium">{taxReturn.year}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={14} className="mr-1" />
                      Completed
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{taxReturn.submittedDate}</td>
                  <td className="p-4 font-medium text-green-600">{taxReturn.refund}</td>
                  <td className="p-4 text-gray-600">{taxReturn.documents} files</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewReturn(taxReturn.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="View Return"
                      >
                        <Eye size={18} className="text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDownloadReturn(taxReturn.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Download Return"
                      >
                        <Download size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-600">Total Returns Filed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$4,964</p>
          <p className="text-sm text-gray-600">Total Refunds Received</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">7 days</p>
          <p className="text-sm text-gray-600">Average Processing Time</p>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help with Your Tax Return?</h3>
        <p className="text-gray-600 mb-4">
          Our tax experts are here to help you maximize your refund and ensure compliance.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Contact Support
          </button>
          <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
            View Tax Guide
          </button>
        </div>
      </div>
    </div>
  )
}
