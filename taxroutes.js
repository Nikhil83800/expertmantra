const express = require('express');
const router = express.Router();
const taxConfig = require('../config/taxConfig');

router.post('/calculate', (req, res) => {
  const { regime, ageGroup, income, financialYear, deductions } = req.body;
  
  if (!income || isNaN(income)) {
    return res.status(400).json({ error: 'Invalid income' });
  }
  
  const config = taxConfig[financialYear][regime];
  let taxableIncome = income;
  let totalDeductions = 0;
  
  if (regime === 'old') {
    // Apply standard deduction
    taxableIncome = Math.max(0, taxableIncome - config.standardDeduction);
    totalDeductions += config.standardDeduction;
    
    // Apply 80C deduction
    const sec80c = Math.min(deductions.section80C, config.section80C.limit);
    taxableIncome = Math.max(0, taxableIncome - sec80c);
    totalDeductions += sec80c;
    
    // Apply 80D deduction
    const sec80dLimit = config.section80D[ageGroup] ? config.section80D[ageGroup].limit : config.section80D.general.limit;
    const sec80d = Math.min(deductions.section80D, sec80dLimit);
    taxableIncome = Math.max(0, taxableIncome - sec80d);
    totalDeductions += sec80d;
    
    // Apply HRA and other deductions
    taxableIncome = Math.max(0, taxableIncome - deductions.hra - deductions.other);
    totalDeductions += deductions.hra + deductions.other;
  }
  
  // Calculate tax based on slabs
  let tax = 0;
  const slabs = regime === 'new' ? config.slabs : config.slabs[ageGroup];
  
  for (let i = 0; i < slabs.length; i++) {
    if (taxableIncome <= slabs[i].from) continue;
    
    const taxableAmount = Math.min(
      taxableIncome - slabs[i].from,
      slabs[i].to - slabs[i].from
    );
    
    tax += taxableAmount * (slabs[i].rate / 100);
  }
  
  // Apply rebate if applicable
  if (regime === 'new' && taxableIncome <= config.rebate.limit) {
    tax = Math.max(0, tax - config.rebate.amount);
  } else if (regime === 'old' && taxableIncome <= config.rebate[ageGroup].limit) {
    tax = Math.max(0, tax - config.rebate[ageGroup].amount);
  }
  
  // Calculate surcharge
  let surcharge = 0;
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
    surcharge = tax * 0.10;
  } else if (taxableIncome > 10000000) {
    surcharge = tax * 0.15;
  }
  
  // Calculate health and education cess (4%)
  const cess = (tax + surcharge) * 0.04;
  const totalTax = tax + surcharge + cess;
  
  res.json({
    regime,
    ageGroup,
    financialYear,
    totalIncome: income,
    totalDeductions,
    taxableIncome,
    tax,
    surcharge,
    cess,
    totalTax
  });
});

module.exports = router;