export default function Calculator() {
  return (
    <section id="calculator" className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Try Our Tax Calculator
          </h2>
          <p className="text-xl text-gray-600">
            Get instant estimates for your 2024-25 tax obligations
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <input
                type="number"
                placeholder="Enter your annual income"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residency Status
              </label>
              <select className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Australian Resident</option>
                <option>Non-resident</option>
                <option>Working Holiday Maker</option>
              </select>
            </div>
          </div>
          
          <button className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg">
            Calculate Tax
          </button>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              For full calculations and deductions, sign up for free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
