module.exports = {
    '2023-24': {
      new: {
        slabs: [
          { from: 0, to: 300000, rate: 0 },
          { from: 300001, to: 600000, rate: 5 },
          { from: 600001, to: 900000, rate: 10 },
          { from: 900001, to: 1200000, rate: 15 },
          { from: 1200001, to: 1500000, rate: 20 },
          { from: 1500001, to: Infinity, rate: 30 }
        ],
        rebate: {
          limit: 700000,
          amount: 25000
        }
      },
      old: {
        slabs: {
          general: [
            { from: 0, to: 250000, rate: 0 },
            { from: 250001, to: 500000, rate: 5 },
            { from: 500001, to: 1000000, rate: 20 },
            { from: 1000001, to: Infinity, rate: 30 }
          ],
          senior: [
            { from: 0, to: 300000, rate: 0 },
            { from: 300001, to: 500000, rate: 5 },
            { from: 500001, to: 1000000, rate: 20 },
            { from: 1000001, to: Infinity, rate: 30 }
          ],
          'super-senior': [
            { from: 0, to: 500000, rate: 0 },
            { from: 500001, to: 1000000, rate: 20 },
            { from: 1000001, to: Infinity, rate: 30 }
          ],
          huf: [
            { from: 0, to: 250000, rate: 0 },
            { from: 250001, to: 500000, rate: 5 },
            { from: 500001, to: 1000000, rate: 20 },
            { from: 1000001, to: Infinity, rate: 30 }
          ]
        },
        rebate: {
          general: { limit: 500000, amount: 12500 },
          senior: { limit: 500000, amount: 10000 },
          'super-senior': { limit: 500000, amount: 0 },
          huf: { limit: 500000, amount: 12500 }
        },
        standardDeduction: 50000,
        section80C: { limit: 150000 },
        section80D: {
          general: { limit: 25000 },
          senior: { limit: 50000 },
          'super-senior': { limit: 50000 },
          huf: { limit: 25000 }
        }
      }
    }
  };