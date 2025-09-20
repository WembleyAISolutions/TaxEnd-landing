'use client'

import { Receipt, Download, CreditCard, Calendar, DollarSign } from 'lucide-react'

const invoices = [
  { id: 'INV-2024-09', date: '2024-09-01', amount: '$49.00', status: 'paid', description: 'Professional Plan - September 2024' },
  { id: 'INV-2024-08', date: '2024-08-01', amount: '$49.00', status: 'paid', description: 'Professional Plan - August 2024' },
  { id: 'INV-2024-07', date: '2024-07-01', amount: '$49.00', status: 'paid', description: 'Professional Plan - July 2024' },
  { id: 'INV-2024-06', date: '2024-06-01', amount: '$49.00', status: 'paid', description: 'Professional Plan - June 2024' },
]

export default function BillingPage() {
  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice ${invoiceId}...`)
  }

  const handleUpdatePaymentMethod = () => {
    alert('Redirecting to payment method update...')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing & Invoices</h1>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$49.00</p>
          <p className="text-sm text-gray-600">Current Monthly Bill</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">Oct 1</p>
          <p className="text-sm text-gray-600">Next Billing Date</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Receipt className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$196.00</p>
          <p className="text-sm text-gray-600">Total Paid This Year</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100 mr-4">
              <CreditCard className="text-gray-600" size={24} />
            </div>
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-gray-600">Expires 12/24</p>
            </div>
          </div>
          <button 
            onClick={handleUpdatePaymentMethod}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Update
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
        </div>
        <div className="divide-y">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gray-100 mr-4">
                  <Receipt className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-gray-600">{invoice.description}</p>
                  <p className="text-sm text-gray-500">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">{invoice.amount}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
                <button 
                  onClick={() => handleDownloadInvoice(invoice.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download Invoice"
                >
                  <Download size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Information */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Billing Address</p>
            <p className="font-medium">123 Collins Street</p>
            <p className="text-gray-600">Melbourne VIC 3000</p>
            <p className="text-gray-600">Australia</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tax Information</p>
            <p className="font-medium">ABN: 12 345 678 901</p>
            <p className="text-gray-600">GST Registered</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Update Billing Address
          </button>
          <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
            Download Tax Invoice
          </button>
        </div>
      </div>
    </div>
  )
}
