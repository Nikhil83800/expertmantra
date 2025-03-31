import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import TaxResults from './TaxResults';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const TaxCalculator = () => {
  const [regime, setRegime] = useState('new');
  const [ageGroup, setAgeGroup] = useState('general');
  const [income, setIncome] = useState('');
  const [financialYear, setFinancialYear] = useState('2023-24');
  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    hra: 0,
    other: 0
  });
  const [results, setResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const ageGroups = [
    { value: 'general', label: 'Individual (<60)' },
    { value: 'senior', label: 'Senior Citizen (60-80)' },
    { value: 'super-senior', label: 'Super Senior (>80)' },
    { value: 'huf', label: 'HUF/BOI/AOP' }
  ];

  const financialYears = [
    { value: '2023-24', label: '2023-24 (AY 2024-25)' },
    { value: '2022-23', label: '2022-23 (AY 2023-24)' }
  ];

  const calculateTax = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/calculate', {
        regime,
        ageGroup,
        income: parseFloat(income),
        financialYear,
        deductions
      });
      setResults(response.data);
      getSuggestions();
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const compareRegimes = async () => {
    setLoading(true);
    try {
      const newRegime = await axios.post('/api/calculate', {
        regime: 'new',
        ageGroup,
        income: parseFloat(income),
        financialYear,
        deductions: { section80C: 0, section80D: 0, hra: 0, other: 0 }
      });

      const oldRegime = await axios.post('/api/calculate', {
        regime: 'old',
        ageGroup,
        income: parseFloat(income),
        financialYear,
        deductions
      });

      setComparison({
        newRegime: newRegime.data,
        oldRegime: oldRegime.data
      });
    } catch (error) {
      console.error('Comparison error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = () => {
    const tips = [];
    
    if (regime === 'old') {
      if (deductions.section80C < 150000 && income > 500000) {
        tips.push(`Invest ₹${150000 - deductions.section80C} more in 80C instruments to save ₹${Math.round((150000 - deductions.section80C) * 0.3)} in tax`);
      }
      
      if (deductions.section80D < 25000 && income > 500000) {
        tips.push(`Consider health insurance to claim additional 80D deduction up to ₹25,000`);
      }
    } else if (income > 700000) {
      tips.push('Compare with old regime - you might save more with deductions');
    }
    
    if (income > 1000000) {
      tips.push('Consider tax planning investments before March to optimize liability');
    }
    
    setSuggestions(tips);
  };

  return (
    <div className="tax-calculator">
      <h1>Income Tax Calculator</h1>
      
      <div className="regime-toggle">
        <button 
          className={regime === 'new' ? 'active' : ''}
          onClick={() => setRegime('new')}
        >
          New Regime
        </button>
        <button 
          className={regime === 'old' ? 'active' : ''}
          onClick={() => setRegime('old')}
        >
          Old Regime
        </button>
      </div>
      
      <div className="input-section">
        <div className="form-group">
          <label>Taxpayer Category</label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
            {ageGroups.map(group => (
              <option key={group.value} value={group.value}>{group.label}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Financial Year</label>
          <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
            {financialYears.map(year => (
              <option key={year.value} value={year.value}>{year.label}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Annual Income (₹)</label>
          <input 
            type="number" 
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your income"
          />
        </div>
        
        {regime === 'old' && (
          <div className="deductions-section">
            <h3>Deductions</h3>
            
            <div className="form-group">
              <label>Section 80C (₹)</label>
              <input 
                type="number" 
                value={deductions.section80C}
                onChange={(e) => setDeductions({...deductions, section80C: parseFloat(e.target.value) || 0})}
                placeholder="Max ₹1,50,000"
              />
            </div>
            
            <div className="form-group">
              <label>Section 80D (₹)</label>
              <input 
                type="number" 
                value={deductions.section80D}
                onChange={(e) => setDeductions({...deductions, section80D: parseFloat(e.target.value) || 0})}
                placeholder="Health insurance"
              />
            </div>
            
            <div className="form-group">
              <label>HRA Exemption (₹)</label>
              <input 
                type="number" 
                value={deductions.hra}
                onChange={(e) => setDeductions({...deductions, hra: parseFloat(e.target.value) || 0})}
                placeholder="If applicable"
              />
            </div>
            
            <div className="form-group">
              <label>Other Deductions (₹)</label>
              <input 
                type="number" 
                value={deductions.other}
                onChange={(e) => setDeductions({...deductions, other: parseFloat(e.target.value) || 0})}
                placeholder="80E, 80G, etc."
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button onClick={calculateTax} disabled={!income || loading}>
          {loading ? 'Calculating...' : 'Calculate Tax'}
        </button>
        <button onClick={compareRegimes} disabled={!income || loading}>
          Compare Regimes
        </button>
      </div>
      
      {results && (
        <TaxResults 
          results={results} 
          regime={regime}
          suggestions={suggestions}
          comparison={comparison}
        />
      )}
      
      <style jsx>{`
        .tax-calculator {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .regime-toggle {
          display: flex;
          margin-bottom: 20px;
          border-radius: 5px;
          overflow: hidden;
          border: 1px solid #ddd;
        }
        
        .regime-toggle button {
          flex: 1;
          padding: 10px;
          border: none;
          background: #f5f5f5;
          cursor: pointer;
          font-weight: bold;
        }
        
        .regime-toggle button.active {
          background: #4CAF50;
          color: white;
        }
        
        .input-section {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .deductions-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .action-buttons button {
          flex: 1;
          padding: 12px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .action-buttons button:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default TaxCalculator;