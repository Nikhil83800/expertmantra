import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';

const TaxResults = ({ results, regime, suggestions, comparison }) => {
  const taxData = {
    labels: ['Tax', 'Take Home'],
    datasets: [
      {
        data: [results.totalTax, results.taxableIncome - results.totalTax],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB']
      }
    ]
  };

  const comparisonData = {
    labels: ['New Regime', 'Old Regime'],
    datasets: [
      {
        label: 'Total Tax',
        data: comparison ? [comparison.newRegime.totalTax, comparison.oldRegime.totalTax] : [0, 0],
        backgroundColor: ['#FFCE56', '#4BC0C0']
      }
    ]
  };

  return (
    <div className="results-section">
      <h2>Tax Calculation Results</h2>
      
      <div className="result-breakup">
        <div className="result-item">
          <span>Total Income:</span>
          <span>₹{results.totalIncome.toLocaleString()}</span>
        </div>
        
        {regime === 'old' && (
          <div className="result-item">
            <span>Total Deductions:</span>
            <span>₹{results.totalDeductions.toLocaleString()}</span>
          </div>
        )}
        
        <div className="result-item">
          <span>Taxable Income:</span>
          <span>₹{results.taxableIncome.toLocaleString()}</span>
        </div>
        
        <div className="result-item highlight">
          <span>Total Tax Liability:</span>
          <span>₹{results.totalTax.toLocaleString()}</span>
        </div>
        
        <div className="chart-container">
          <Pie data={taxData} />
        </div>
      </div>
      
      {suggestions.length > 0 && (
        <div className="suggestions">
          <h3>Tax Saving Suggestions</h3>
          <ul>
            {suggestions.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
      
      {comparison && (
        <div className="comparison-section">
          <h2>Regime Comparison</h2>
          
          <div className="comparison-results">
            <div className="regime-result">
              <h3>New Regime</h3>
              <p>Tax: ₹{comparison.newRegime.totalTax.toLocaleString()}</p>
            </div>
            
            <div className="regime-result">
              <h3>Old Regime</h3>
              <p>Tax: ₹{comparison.oldRegime.totalTax.toLocaleString()}</p>
            </div>
            
            <div className="chart-container">
              <Bar data={comparisonData} options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Tax Comparison'
                  }
                }
              }} />
            </div>
            
            <div className="recommendation">
              <h3>Recommendation</h3>
              <p>
                {comparison.newRegime.totalTax < comparison.oldRegime.totalTax 
                  ? 'New regime is better for you' 
                  : 'Old regime is better for you'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .results-section,
        .comparison-section {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        
        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        
        .result-item.highlight {
          font-weight: bold;
          font-size: 1.1em;
          color: #4CAF50;
        }
        
        .chart-container {
          margin-top: 30px;
          height: 300px;
        }
        
        .suggestions {
          margin-top: 20px;
          padding: 15px;
          background: #fff8e1;
          border-left: 4px solid #ffc107;
        }
        
        .suggestions ul {
          padding-left: 20px;
        }
        
        .comparison-results {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .regime-result {
          background: white;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .comparison-results {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TaxResults;