import React, { useState } from 'react';

interface TaxResults {
  propertyValue: number;
  landValue: number;
  stampDuty: number;
  landTax: number;
  totalCosts: number;
  stateName: string;
}

type StateCode = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

const AustralianStatesTaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [selectedState, setSelectedState] = useState<StateCode>('NSW');
  const [results, setResults] = useState<TaxResults | null>(null);

  // Australian states tax data (2024-25 financial year)
  const stateData = {
    NSW: {
      name: 'New South Wales',
      stampDuty: {
        residential: [
          { min: 0, max: 14000, rate: 0.0125, base: 0 },
          { min: 14001, max: 32000, rate: 0.015, base: 175 },
          { min: 32001, max: 85000, rate: 0.0175, base: 445 },
          { min: 85001, max: 319000, rate: 0.035, base: 1372.5 },
          { min: 319001, max: 1064000, rate: 0.045, base: 9562.5 },
          { min: 1064001, max: Infinity, rate: 0.055, base: 43087.5 }
        ]
      },
      landTax: {
        threshold: 1075000,
        rates: [
          { min: 1075000, max: 6571000, rate: 0.017, base: 0 },
          { min: 6571001, max: Infinity, rate: 0.02, base: 93432 }
        ]
      },
      payrollTax: {
        threshold: 1200000,
        rate: 0.0485
      }
    },
    VIC: {
      name: 'Victoria',
      stampDuty: {
        residential: [
          { min: 0, max: 25000, rate: 0.014, base: 0 },
          { min: 25001, max: 130000, rate: 0.024, base: 350 },
          { min: 130001, max: 960000, rate: 0.055, base: 2870 },
          { min: 960001, max: Infinity, rate: 0.06, base: 48520 }
        ]
      },
      landTax: {
        threshold: 300000,
        rates: [
          { min: 300000, max: 3000000, rate: 0.02, base: 0 },
          { min: 3000001, max: Infinity, rate: 0.025, base: 54000 }
        ]
      },
      payrollTax: {
        threshold: 700000,
        rate: 0.0485
      }
    },
    QLD: {
      name: 'Queensland',
      stampDuty: {
        residential: [
          { min: 0, max: 5000, rate: 0, base: 0 },
          { min: 5001, max: 75000, rate: 0.015, base: 0 },
          { min: 75001, max: 540000, rate: 0.035, base: 1050 },
          { min: 540001, max: 1000000, rate: 0.045, base: 17325 },
          { min: 1000001, max: Infinity, rate: 0.0575, base: 38025 }
        ]
      },
      landTax: {
        threshold: 600000,
        rates: [
          { min: 600000, max: 999999, rate: 0.01, base: 0 },
          { min: 1000000, max: 2999999, rate: 0.017, base: 4000 },
          { min: 3000000, max: Infinity, rate: 0.025, base: 38000 }
        ]
      },
      payrollTax: {
        threshold: 1300000,
        rate: 0.0475
      }
    },
    WA: {
      name: 'Western Australia',
      stampDuty: {
        residential: [
          { min: 0, max: 120000, rate: 0.019, base: 0 },
          { min: 120001, max: 150000, rate: 0.029, base: 2280 },
          { min: 150001, max: 360000, rate: 0.038, base: 3150 },
          { min: 360001, max: 725000, rate: 0.049, base: 11130 },
          { min: 725001, max: Infinity, rate: 0.051, base: 29015 }
        ]
      },
      landTax: {
        threshold: 300000,
        rates: [
          { min: 300000, max: 420000, rate: 0.007, base: 0 },
          { min: 420001, max: 1000000, rate: 0.015, base: 840 },
          { min: 1000001, max: Infinity, rate: 0.025, base: 9540 }
        ]
      },
      payrollTax: {
        threshold: 1000000,
        rate: 0.055
      }
    },
    SA: {
      name: 'South Australia',
      stampDuty: {
        residential: [
          { min: 0, max: 12000, rate: 0.01, base: 0 },
          { min: 12001, max: 30000, rate: 0.02, base: 120 },
          { min: 30001, max: 50000, rate: 0.03, base: 480 },
          { min: 50001, max: 100000, rate: 0.04, base: 1080 },
          { min: 100001, max: 200000, rate: 0.05, base: 3080 },
          { min: 200001, max: 250000, rate: 0.055, base: 8080 },
          { min: 250001, max: 300000, rate: 0.05, base: 10830 },
          { min: 300001, max: 500000, rate: 0.055, base: 13330 },
          { min: 500001, max: Infinity, rate: 0.0575, base: 24330 }
        ]
      },
      landTax: {
        threshold: 25000,
        rates: [
          { min: 25000, max: 755000, rate: 0.005, base: 0 },
          { min: 755001, max: Infinity, rate: 0.0065, base: 3650 }
        ]
      },
      payrollTax: {
        threshold: 1500000,
        rate: 0.0495
      }
    },
    TAS: {
      name: 'Tasmania',
      stampDuty: {
        residential: [
          { min: 0, max: 1400, rate: 0.017, base: 0 },
          { min: 1401, max: 10000, rate: 0.025, base: 24 },
          { min: 10001, max: 25000, rate: 0.035, base: 239 },
          { min: 25001, max: 75000, rate: 0.04, base: 764 },
          { min: 75001, max: 200000, rate: 0.043, base: 2764 },
          { min: 200001, max: 375000, rate: 0.045, base: 8139 },
          { min: 375001, max: 725000, rate: 0.0465, base: 16014 },
          { min: 725001, max: Infinity, rate: 0.0475, base: 32289 }
        ]
      },
      landTax: {
        threshold: 25000,
        rates: [
          { min: 25000, max: 349999, rate: 0.0055, base: 0 },
          { min: 350000, max: Infinity, rate: 0.015, base: 1787.5 }
        ]
      },
      payrollTax: {
        threshold: 1250000,
        rate: 0.0612
      }
    },
    ACT: {
      name: 'Australian Capital Territory',
      stampDuty: {
        residential: [
          { min: 0, max: 200000, rate: 0, base: 0 },
          { min: 200001, max: 300000, rate: 0.067, base: 0 },
          { min: 300001, max: 500000, rate: 0.067, base: 6700 },
          { min: 500001, max: 750000, rate: 0.067, base: 20100 },
          { min: 750001, max: 1000000, rate: 0.067, base: 36850 },
          { min: 1000001, max: 1455000, rate: 0.067, base: 53600 },
          { min: 1455001, max: Infinity, rate: 0.067, base: 84085 }
        ]
      },
      landTax: {
        threshold: 25000,
        rates: [
          { min: 25000, max: 600000, rate: 0.0075, base: 0 },
          { min: 600001, max: Infinity, rate: 0.015, base: 4312.5 }
        ]
      },
      payrollTax: {
        threshold: 2000000,
        rate: 0.0675
      }
    },
    NT: {
      name: 'Northern Territory',
      stampDuty: {
        residential: [
          { min: 0, max: 525000, rate: 0.066, base: 0 },
          { min: 525001, max: 3000000, rate: 0.054, base: 34650 },
          { min: 3000001, max: Infinity, rate: 0.048, base: 168300 }
        ]
      },
      landTax: {
        threshold: 25000,
        rates: [
          { min: 25000, max: Infinity, rate: 0.005, base: 0 }
        ]
      },
      payrollTax: {
        threshold: 1500000,
        rate: 0.055
      }
    }
  };

  // Calculate stamp duty
  const calculateStampDuty = (propertyValue: number, state: StateCode): number => {
    const brackets = stateData[state].stampDuty.residential;
    for (let bracket of brackets) {
      if (propertyValue >= bracket.min && propertyValue <= bracket.max) {
        return bracket.base + (propertyValue - bracket.min + 1) * bracket.rate;
      }
    }
    return 0;
  };

  // Calculate land tax
  const calculateLandTax = (landValue: number, state: StateCode): number => {
    const threshold = stateData[state].landTax.threshold;
    if (landValue <= threshold) return 0;
    
    const rates = stateData[state].landTax.rates;
    for (let rate of rates) {
      if (landValue >= rate.min && landValue <= rate.max) {
        return rate.base + (landValue - rate.min) * rate.rate;
      }
    }
    return 0;
  };

  // Execute calculation
  const handleCalculate = () => {
    const propertyValue = parseFloat(income.replace(/,/g, '')) || 0;
    const landValue = propertyValue * 0.8; // Assume land value is 80% of property value
    
    const stampDuty = calculateStampDuty(propertyValue, selectedState);
    const landTax = calculateLandTax(landValue, selectedState);
    
    setResults({
      propertyValue,
      landValue,
      stampDuty,
      landTax,
      totalCosts: stampDuty + landTax,
      stateName: stateData[selectedState].name
    });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with thousand separators
  const formatNumber = (num: string | number): string => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle input change with formatting
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setIncome(formatNumber(value));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Australian States Tax Calculator
        </h2>
        <p className="text-gray-600">
          Compare property taxes, stamp duty, and land tax across Australian states and territories
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select State/Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as StateCode)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(stateData).map(([code, data]) => (
                <option key={code} value={code}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Value (AUD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="text"
                value={income}
                onChange={handleInputChange}
                placeholder="800,000"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-lg"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Calculate State Taxes
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {results && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Tax Breakdown - {results.stateName}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Property Value:</span>
                  <span className="font-semibold">{formatCurrency(results.propertyValue)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Stamp Duty:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(results.stampDuty)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Annual Land Tax:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(results.landTax)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                  <span className="text-lg font-semibold text-gray-800">Total Tax Costs:</span>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(results.totalCosts)}</span>
                </div>
              </div>
            </div>
          )}

          {/* State Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {stateData[selectedState].name} - Key Rates
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Land Tax Threshold: {formatCurrency(stateData[selectedState].landTax.threshold)}</p>
              <p>• Payroll Tax Rate: {(stateData[selectedState].payrollTax.rate * 100).toFixed(2)}%</p>
              <p>• Payroll Tax Threshold: {formatCurrency(stateData[selectedState].payrollTax.threshold)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {results && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            State Comparison for {formatCurrency(results.propertyValue)} Property
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">State</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Stamp Duty</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Annual Land Tax</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stateData).map(([code, data]) => {
                  const stampDuty = calculateStampDuty(results.propertyValue, code as StateCode);
                  const landTax = calculateLandTax(results.landValue, code as StateCode);
                  const total = stampDuty + landTax;
                  const isSelected = code === selectedState;
                  
                  return (
                    <tr key={code} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className={`border border-gray-300 px-4 py-2 ${isSelected ? 'font-semibold' : ''}`}>
                        {data.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatCurrency(stampDuty)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatCurrency(landTax)}
                      </td>
                      <td className={`border border-gray-300 px-4 py-2 text-right ${isSelected ? 'font-semibold text-blue-600' : ''}`}>
                        {formatCurrency(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AustralianStatesTaxCalculator;
