'use client';

import { useState, useEffect, useCallback } from 'react';
import { TaxInputData, TaxCalculationResult, AgeGroup } from '../types/australian-tax';

export interface TaxScenario {
  id: string;
  name: string;
  description?: string;
  ageGroup: AgeGroup;
  inputData: TaxInputData;
  calculationResult?: TaxCalculationResult;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface NegativeGearingScenario {
  id: string;
  name: string;
  propertyValue: number;
  rentalIncome: number;
  loanAmount: number;
  interestRate: number;
  maintenanceCosts: number;
  managementFees: number;
  insurance: number;
  councilRates: number;
  depreciation: number;
  createdAt: Date;
}

export interface SalarySacrificeScenario {
  id: string;
  name: string;
  currentSalary: number;
  proposedSacrifice: number;
  sacrificeType: 'super' | 'car' | 'laptop' | 'other';
  createdAt: Date;
}

export interface CapitalGainsScenario {
  id: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  purchaseDate: Date;
  saleDate: Date;
  improvementCosts: number;
  sellingCosts: number;
  createdAt: Date;
}

export interface TaxDataPersistence {
  // Tax scenarios
  scenarios: TaxScenario[];
  currentScenario?: TaxScenario;
  
  // Specialized scenarios
  negativeGearingScenarios: NegativeGearingScenario[];
  salarySacrificeScenarios: SalarySacrificeScenario[];
  capitalGainsScenarios: CapitalGainsScenario[];
  
  // User preferences
  defaultAgeGroup?: AgeGroup;
  favoriteStrategies: string[];
  
  // Comparison data
  comparisonScenarios: string[]; // Array of scenario IDs
}

const STORAGE_KEY = 'taxend_user_data';
const STORAGE_VERSION = '1.0';

const defaultData: TaxDataPersistence = {
  scenarios: [],
  negativeGearingScenarios: [],
  salarySacrificeScenarios: [],
  capitalGainsScenarios: [],
  favoriteStrategies: [],
  comparisonScenarios: [],
};

export function useTaxDataPersistence() {
  const [data, setData] = useState<TaxDataPersistence>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Validate version and migrate if necessary
        if (parsed.version === STORAGE_VERSION) {
          // Convert date strings back to Date objects
          const migratedData = {
            ...parsed.data,
            scenarios: parsed.data.scenarios.map((scenario: any) => ({
              ...scenario,
              createdAt: new Date(scenario.createdAt),
              updatedAt: new Date(scenario.updatedAt),
            })),
            negativeGearingScenarios: parsed.data.negativeGearingScenarios.map((scenario: any) => ({
              ...scenario,
              createdAt: new Date(scenario.createdAt),
            })),
            salarySacrificeScenarios: parsed.data.salarySacrificeScenarios.map((scenario: any) => ({
              ...scenario,
              createdAt: new Date(scenario.createdAt),
            })),
            capitalGainsScenarios: parsed.data.capitalGainsScenarios.map((scenario: any) => ({
              ...scenario,
              createdAt: new Date(scenario.createdAt),
              purchaseDate: new Date(scenario.purchaseDate),
              saleDate: new Date(scenario.saleDate),
            })),
          };
          setData(migratedData);
        } else {
          // Handle version migration here if needed
          console.warn('Data version mismatch, using default data');
        }
      }
    } catch (err) {
      console.error('Error loading tax data:', err);
      setError('Failed to load saved data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever data changes
  const saveData = useCallback((newData: TaxDataPersistence) => {
    try {
      const toSave = {
        version: STORAGE_VERSION,
        data: newData,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setData(newData);
      setError(null);
    } catch (err) {
      console.error('Error saving tax data:', err);
      setError('Failed to save data');
    }
  }, []);

  // Tax scenario management
  const saveScenario = useCallback((scenario: Omit<TaxScenario, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newScenario: TaxScenario = {
      ...scenario,
      id: `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newData = {
      ...data,
      scenarios: [...data.scenarios, newScenario],
    };
    saveData(newData);
    return newScenario;
  }, [data, saveData]);

  const updateScenario = useCallback((id: string, updates: Partial<TaxScenario>) => {
    const newData = {
      ...data,
      scenarios: data.scenarios.map(scenario =>
        scenario.id === id
          ? { ...scenario, ...updates, updatedAt: new Date() }
          : scenario
      ),
    };
    saveData(newData);
  }, [data, saveData]);

  const deleteScenario = useCallback((id: string) => {
    const newData = {
      ...data,
      scenarios: data.scenarios.filter(scenario => scenario.id !== id),
      comparisonScenarios: data.comparisonScenarios.filter(scenarioId => scenarioId !== id),
    };
    if (data.currentScenario?.id === id) {
      newData.currentScenario = undefined;
    }
    saveData(newData);
  }, [data, saveData]);

  const setCurrentScenario = useCallback((scenario: TaxScenario | undefined) => {
    const newData = {
      ...data,
      currentScenario: scenario,
    };
    saveData(newData);
  }, [data, saveData]);

  // Negative gearing scenario management
  const saveNegativeGearingScenario = useCallback((scenario: Omit<NegativeGearingScenario, 'id' | 'createdAt'>) => {
    const newScenario: NegativeGearingScenario = {
      ...scenario,
      id: `ng_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    const newData = {
      ...data,
      negativeGearingScenarios: [...data.negativeGearingScenarios, newScenario],
    };
    saveData(newData);
    return newScenario;
  }, [data, saveData]);

  const deleteNegativeGearingScenario = useCallback((id: string) => {
    const newData = {
      ...data,
      negativeGearingScenarios: data.negativeGearingScenarios.filter(scenario => scenario.id !== id),
    };
    saveData(newData);
  }, [data, saveData]);

  // Salary sacrifice scenario management
  const saveSalarySacrificeScenario = useCallback((scenario: Omit<SalarySacrificeScenario, 'id' | 'createdAt'>) => {
    const newScenario: SalarySacrificeScenario = {
      ...scenario,
      id: `ss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    const newData = {
      ...data,
      salarySacrificeScenarios: [...data.salarySacrificeScenarios, newScenario],
    };
    saveData(newData);
    return newScenario;
  }, [data, saveData]);

  const deleteSalarySacrificeScenario = useCallback((id: string) => {
    const newData = {
      ...data,
      salarySacrificeScenarios: data.salarySacrificeScenarios.filter(scenario => scenario.id !== id),
    };
    saveData(newData);
  }, [data, saveData]);

  // Capital gains scenario management
  const saveCapitalGainsScenario = useCallback((scenario: Omit<CapitalGainsScenario, 'id' | 'createdAt'>) => {
    const newScenario: CapitalGainsScenario = {
      ...scenario,
      id: `cg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    const newData = {
      ...data,
      capitalGainsScenarios: [...data.capitalGainsScenarios, newScenario],
    };
    saveData(newData);
    return newScenario;
  }, [data, saveData]);

  const deleteCapitalGainsScenario = useCallback((id: string) => {
    const newData = {
      ...data,
      capitalGainsScenarios: data.capitalGainsScenarios.filter(scenario => scenario.id !== id),
    };
    saveData(newData);
  }, [data, saveData]);

  // Comparison management
  const addToComparison = useCallback((scenarioId: string) => {
    if (!data.comparisonScenarios.includes(scenarioId) && data.comparisonScenarios.length < 5) {
      const newData = {
        ...data,
        comparisonScenarios: [...data.comparisonScenarios, scenarioId],
      };
      saveData(newData);
    }
  }, [data, saveData]);

  const removeFromComparison = useCallback((scenarioId: string) => {
    const newData = {
      ...data,
      comparisonScenarios: data.comparisonScenarios.filter(id => id !== scenarioId),
    };
    saveData(newData);
  }, [data, saveData]);

  const clearComparison = useCallback(() => {
    const newData = {
      ...data,
      comparisonScenarios: [],
    };
    saveData(newData);
  }, [data, saveData]);

  // User preferences
  const setDefaultAgeGroup = useCallback((ageGroup: AgeGroup) => {
    const newData = {
      ...data,
      defaultAgeGroup: ageGroup,
    };
    saveData(newData);
  }, [data, saveData]);

  const addFavoriteStrategy = useCallback((strategy: string) => {
    if (!data.favoriteStrategies.includes(strategy)) {
      const newData = {
        ...data,
        favoriteStrategies: [...data.favoriteStrategies, strategy],
      };
      saveData(newData);
    }
  }, [data, saveData]);

  const removeFavoriteStrategy = useCallback((strategy: string) => {
    const newData = {
      ...data,
      favoriteStrategies: data.favoriteStrategies.filter(s => s !== strategy),
    };
    saveData(newData);
  }, [data, saveData]);

  // Utility functions
  const getScenariosByAgeGroup = useCallback((ageGroup: AgeGroup) => {
    return data.scenarios.filter(scenario => scenario.ageGroup === ageGroup);
  }, [data.scenarios]);

  const getComparisonScenarios = useCallback(() => {
    return data.scenarios.filter(scenario => data.comparisonScenarios.includes(scenario.id));
  }, [data.scenarios, data.comparisonScenarios]);

  const exportData = useCallback(() => {
    return {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      data: data,
    };
  }, [data]);

  const importData = useCallback((importedData: any) => {
    try {
      if (importedData.version === STORAGE_VERSION) {
        saveData(importedData.data);
        return true;
      } else {
        setError('Incompatible data version');
        return false;
      }
    } catch (err) {
      setError('Failed to import data');
      return false;
    }
  }, [saveData]);

  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
    setError(null);
  }, []);

  return {
    // State
    data,
    isLoading,
    error,

    // Tax scenario management
    saveScenario,
    updateScenario,
    deleteScenario,
    setCurrentScenario,
    getScenariosByAgeGroup,

    // Specialized scenario management
    saveNegativeGearingScenario,
    deleteNegativeGearingScenario,
    saveSalarySacrificeScenario,
    deleteSalarySacrificeScenario,
    saveCapitalGainsScenario,
    deleteCapitalGainsScenario,

    // Comparison management
    addToComparison,
    removeFromComparison,
    clearComparison,
    getComparisonScenarios,

    // User preferences
    setDefaultAgeGroup,
    addFavoriteStrategy,
    removeFavoriteStrategy,

    // Utility functions
    exportData,
    importData,
    clearAllData,
  };
}
