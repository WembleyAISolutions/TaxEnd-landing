'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Save, Download, GitCompare, Trash2, Copy } from 'lucide-react';
import type { TaxCalculationInput, TaxCalculationResult } from '../../lib/types/tax-types';
import { formatCurrency, formatPercentage } from '../../lib/utils/formatters';

interface SavedScenario {
  id: string;
  name: string;
  input: TaxCalculationInput;
  result: TaxCalculationResult;
  createdAt: Date;
}

interface SaveScenarioProps {
  currentInput: TaxCalculationInput;
  currentResult: TaxCalculationResult | null;
  onLoadScenario: (input: TaxCalculationInput) => void;
}

export default function SaveScenario({ currentInput, currentResult, onLoadScenario }: SaveScenarioProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tax-scenarios');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [scenarioName, setScenarioName] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  const saveScenario = () => {
    if (!currentResult || !scenarioName.trim()) return;

    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name: scenarioName.trim(),
      input: { ...currentInput },
      result: { ...currentResult },
      createdAt: new Date()
    };

    const updatedScenarios = [...scenarios, newScenario];
    setScenarios(updatedScenarios);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('tax-scenarios', JSON.stringify(updatedScenarios));
    }
    
    setScenarioName('');
  };

  const deleteScenario = (id: string) => {
    const updatedScenarios = scenarios.filter(s => s.id !== id);
    setScenarios(updatedScenarios);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('tax-scenarios', JSON.stringify(updatedScenarios));
    }
  };

  const loadScenario = (scenario: SavedScenario) => {
    onLoadScenario(scenario.input);
  };

  const duplicateScenario = (scenario: SavedScenario) => {
    const duplicated: SavedScenario = {
      ...scenario,
      id: Date.now().toString(),
      name: `${scenario.name} (Copy)`,
      createdAt: new Date()
    };

    const updatedScenarios = [...scenarios, duplicated];
    setScenarios(updatedScenarios);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('tax-scenarios', JSON.stringify(updatedScenarios));
    }
  };

  const exportScenarios = () => {
    const dataStr = JSON.stringify(scenarios, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tax-scenarios-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const toggleCompareScenario = (id: string) => {
    setSelectedScenarios(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const getComparisonData = () => {
    return selectedScenarios.map(id => scenarios.find(s => s.id === id)!);
  };

  return (
    <div className="space-y-6">
      {/* Save Current Scenario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Current Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="scenarioName">Scenario Name</Label>
                <Input
                  id="scenarioName"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g., Current Salary, With Bonus, After Promotion"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={saveScenario}
                  disabled={!currentResult || !scenarioName.trim()}
                >
                  Save Scenario
                </Button>
              </div>
            </div>
            
            {currentResult && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Current calculation:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Income</div>
                    <div>{formatCurrency(currentResult.grossIncome)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Tax</div>
                    <div className="text-red-600">{formatCurrency(currentResult.totalTax)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Net</div>
                    <div className="text-green-600">{formatCurrency(currentResult.netIncome)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Rate</div>
                    <div>{formatPercentage(currentResult.effectiveRate)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved Scenarios */}
      {scenarios.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Saved Scenarios ({scenarios.length})</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompareMode(!compareMode)}
                >
                  <GitCompare className="h-4 w-4 mr-2" />
                  {compareMode ? 'Exit Compare' : 'Compare'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportScenarios}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenarios.map((scenario) => (
                <div 
                  key={scenario.id} 
                  className={`p-4 border rounded-lg ${
                    compareMode && selectedScenarios.includes(scenario.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {compareMode && (
                        <input
                          type="checkbox"
                          checked={selectedScenarios.includes(scenario.id)}
                          onChange={() => toggleCompareScenario(scenario.id)}
                          disabled={!selectedScenarios.includes(scenario.id) && selectedScenarios.length >= 3}
                          className="rounded"
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-gray-500">
                          Saved {scenario.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadScenario(scenario)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateScenario(scenario)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteScenario(scenario.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-600">Income</div>
                      <div>{formatCurrency(scenario.result.grossIncome)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Tax</div>
                      <div className="text-red-600">{formatCurrency(scenario.result.totalTax)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Net</div>
                      <div className="text-green-600">{formatCurrency(scenario.result.netIncome)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Rate</div>
                      <div>{formatPercentage(scenario.result.effectiveRate)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Monthly</div>
                      <div>{formatCurrency(scenario.result.monthlyTakeHome)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison View */}
      {compareMode && selectedScenarios.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Scenario Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Metric</th>
                    {getComparisonData().map((scenario) => (
                      <th key={scenario.id} className="text-left p-2">
                        {scenario.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Gross Income</td>
                    {getComparisonData().map((scenario) => (
                      <td key={scenario.id} className="p-2">
                        {formatCurrency(scenario.result.grossIncome)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Total Tax</td>
                    {getComparisonData().map((scenario) => (
                      <td key={scenario.id} className="p-2 text-red-600">
                        {formatCurrency(scenario.result.totalTax)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Net Income</td>
                    {getComparisonData().map((scenario) => (
                      <td key={scenario.id} className="p-2 text-green-600">
                        {formatCurrency(scenario.result.netIncome)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Effective Rate</td>
                    {getComparisonData().map((scenario) => (
                      <td key={scenario.id} className="p-2">
                        {formatPercentage(scenario.result.effectiveRate)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Monthly Take-home</td>
                    {getComparisonData().map((scenario) => (
                      <td key={scenario.id} className="p-2">
                        {formatCurrency(scenario.result.monthlyTakeHome)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Marginal Rate</td>
                    {getComparisonData().map((scenario) => (
                      <td key={scenario.id} className="p-2">
                        {formatPercentage(scenario.result.marginalRate)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Comparison Insights */}
            <div className="mt-6 space-y-3">
              <h4 className="font-medium">Comparison Insights</h4>
              {(() => {
                const data = getComparisonData();
                const bestNet = Math.max(...data.map(s => s.result.netIncome));
                const worstNet = Math.min(...data.map(s => s.result.netIncome));
                const bestScenario = data.find(s => s.result.netIncome === bestNet);
                const worstScenario = data.find(s => s.result.netIncome === worstNet);
                
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🏆</span>
                      <span>
                        <strong>{bestScenario?.name}</strong> provides the highest net income 
                        ({formatCurrency(bestNet)})
                      </span>
                    </div>
                    {bestNet !== worstNet && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">📉</span>
                        <span>
                          Difference between best and worst: {formatCurrency(bestNet - worstNet)} annually
                          ({formatCurrency((bestNet - worstNet) / 12)} monthly)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {compareMode && selectedScenarios.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select Scenarios to Compare
            </h3>
            <p className="text-gray-600">
              Check the boxes next to scenarios above to compare them side by side.
              You can compare up to 3 scenarios at once.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
