/**
 * Universal Table Test Suite
 * Tests every cell of the FASERIP Universal Table (18 ranks x 24 roll ranges = 432 test cases)
 * Plus special case tests for roll 01 and roll 100
 *
 * Run with: node --experimental-vm-modules tests/universal-table.test.mjs
 */

// Mock the FASERIP config object that would normally come from config.mjs
const FASERIP = {
  resultColors: {
    white: 'FASERIP.Result.White',
    green: 'FASERIP.Result.Green',
    yellow: 'FASERIP.Result.Yellow',
    red: 'FASERIP.Result.Red',
  }
};

// Copy of UNIVERSAL_TABLE from universal-table.mjs
const UNIVERSAL_TABLE = {
  shift0:    { green: 66, yellow: 95, red: 100 },
  feeble:    { green: 61, yellow: 91, red: 100 },
  poor:      { green: 56, yellow: 86, red: 100 },
  typical:   { green: 51, yellow: 81, red: 98 },
  good:      { green: 46, yellow: 76, red: 98 },
  excellent: { green: 41, yellow: 71, red: 95 },
  remarkable:{ green: 36, yellow: 66, red: 95 },
  incredible:{ green: 31, yellow: 61, red: 91 },
  amazing:   { green: 26, yellow: 56, red: 91 },
  monstrous: { green: 21, yellow: 51, red: 86 },
  unearthly: { green: 16, yellow: 46, red: 86 },
  shiftX:    { green: 11, yellow: 41, red: 81 },
  shiftY:    { green: 7,  yellow: 41, red: 81 },
  shiftZ:    { green: 4,  yellow: 36, red: 76 },
  class1000: { green: 2,  yellow: 36, red: 76 },
  class3000: { green: 2,  yellow: 31, red: 71 },
  class5000: { green: 2,  yellow: 26, red: 66 },
  beyond:    { green: 2,  yellow: 26, red: 61 },
};

// Copy of normalizeRankKey function
function normalizeRankKey(rankKey) {
  if (!rankKey) return 'typical';
  const key = rankKey.toLowerCase().replace(/[\s-]/g, '');
  if (UNIVERSAL_TABLE[key]) return key;
  const mappings = {
    'sh0': 'shift0',
    'fe': 'feeble',
    'pr': 'poor',
    'ty': 'typical',
    'gd': 'good',
    'ex': 'excellent',
    'rm': 'remarkable',
    'in': 'incredible',
    'am': 'amazing',
    'mn': 'monstrous',
    'un': 'unearthly',
    'shx': 'shiftX',
    'shy': 'shiftY',
    'shz': 'shiftZ',
    'cl1000': 'class1000',
    'cl3000': 'class3000',
    'cl5000': 'class5000',
    'shiftx': 'shiftX',
    'shifty': 'shiftY',
    'shiftz': 'shiftZ',
    'b': 'beyond',
  };
  return mappings[key] || 'typical';
}

// Copy of getFeatResult function
function getFeatResult(roll, rankKey) {
  // Special case: Roll of 01 is always White (automatic failure)
  if (roll === 1) return 'white';

  // Special case: Roll of 100 is always Red (automatic critical success)
  if (roll === 100) return 'red';

  // Normalize the rank key
  const normalizedRank = normalizeRankKey(rankKey);
  const thresholds = UNIVERSAL_TABLE[normalizedRank];

  if (!thresholds) {
    console.warn(`FASERIP | Unknown rank: ${rankKey}, defaulting to typical`);
    return getFeatResult(roll, 'typical');
  }

  // Standard resolution: higher rolls are better
  if (roll >= thresholds.red) return 'red';
  if (roll >= thresholds.yellow) return 'yellow';
  if (roll >= thresholds.green) return 'green';
  return 'white';
}

// ============================================================================
// TEST DATA - Expected results for every cell in the Universal Table
// Based on the official FASERIP Universal Table image
// ============================================================================

/**
 * Expected results for each rank at each roll range
 * Format: { rank: { rollRange: expectedColor } }
 *
 * Roll ranges from the table:
 * 01, 02-03, 04-06, 07-10, 11-15, 16-20, 21-25, 26-30, 31-35, 36-40,
 * 41-45, 46-50, 51-55, 56-60, 61-65, 66-70, 71-75, 76-80, 81-85, 86-90,
 * 91-94, 95-97, 98-99, 100
 */
const EXPECTED_RESULTS = {
  shift0: {
    1: 'white',      // 01
    2: 'white', 3: 'white',  // 02-03
    4: 'white', 5: 'white', 6: 'white',  // 04-06
    7: 'white', 8: 'white', 9: 'white', 10: 'white',  // 07-10
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',  // 11-15
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',  // 16-20
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',  // 21-25
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',  // 26-30
    31: 'white', 32: 'white', 33: 'white', 34: 'white', 35: 'white',  // 31-35
    36: 'white', 37: 'white', 38: 'white', 39: 'white', 40: 'white',  // 36-40
    41: 'white', 42: 'white', 43: 'white', 44: 'white', 45: 'white',  // 41-45
    46: 'white', 47: 'white', 48: 'white', 49: 'white', 50: 'white',  // 46-50
    51: 'white', 52: 'white', 53: 'white', 54: 'white', 55: 'white',  // 51-55
    56: 'white', 57: 'white', 58: 'white', 59: 'white', 60: 'white',  // 56-60
    61: 'white', 62: 'white', 63: 'white', 64: 'white', 65: 'white',  // 61-65
    66: 'green', 67: 'green', 68: 'green', 69: 'green', 70: 'green',  // 66-70
    71: 'green', 72: 'green', 73: 'green', 74: 'green', 75: 'green',  // 71-75
    76: 'green', 77: 'green', 78: 'green', 79: 'green', 80: 'green',  // 76-80
    81: 'green', 82: 'green', 83: 'green', 84: 'green', 85: 'green',  // 81-85
    86: 'green', 87: 'green', 88: 'green', 89: 'green', 90: 'green',  // 86-90
    91: 'green', 92: 'green', 93: 'green', 94: 'green',  // 91-94
    95: 'yellow', 96: 'yellow', 97: 'yellow',  // 95-97
    98: 'yellow', 99: 'yellow',  // 98-99
    100: 'red',  // 100
  },

  feeble: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',
    31: 'white', 32: 'white', 33: 'white', 34: 'white', 35: 'white',
    36: 'white', 37: 'white', 38: 'white', 39: 'white', 40: 'white',
    41: 'white', 42: 'white', 43: 'white', 44: 'white', 45: 'white',
    46: 'white', 47: 'white', 48: 'white', 49: 'white', 50: 'white',
    51: 'white', 52: 'white', 53: 'white', 54: 'white', 55: 'white',
    56: 'white', 57: 'white', 58: 'white', 59: 'white', 60: 'white',
    61: 'green', 62: 'green', 63: 'green', 64: 'green', 65: 'green',
    66: 'green', 67: 'green', 68: 'green', 69: 'green', 70: 'green',
    71: 'green', 72: 'green', 73: 'green', 74: 'green', 75: 'green',
    76: 'green', 77: 'green', 78: 'green', 79: 'green', 80: 'green',
    81: 'green', 82: 'green', 83: 'green', 84: 'green', 85: 'green',
    86: 'green', 87: 'green', 88: 'green', 89: 'green', 90: 'green',
    91: 'yellow', 92: 'yellow', 93: 'yellow', 94: 'yellow',
    95: 'yellow', 96: 'yellow', 97: 'yellow',
    98: 'yellow', 99: 'yellow',
    100: 'red',
  },

  poor: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',
    31: 'white', 32: 'white', 33: 'white', 34: 'white', 35: 'white',
    36: 'white', 37: 'white', 38: 'white', 39: 'white', 40: 'white',
    41: 'white', 42: 'white', 43: 'white', 44: 'white', 45: 'white',
    46: 'white', 47: 'white', 48: 'white', 49: 'white', 50: 'white',
    51: 'white', 52: 'white', 53: 'white', 54: 'white', 55: 'white',
    56: 'green', 57: 'green', 58: 'green', 59: 'green', 60: 'green',
    61: 'green', 62: 'green', 63: 'green', 64: 'green', 65: 'green',
    66: 'green', 67: 'green', 68: 'green', 69: 'green', 70: 'green',
    71: 'green', 72: 'green', 73: 'green', 74: 'green', 75: 'green',
    76: 'green', 77: 'green', 78: 'green', 79: 'green', 80: 'green',
    81: 'green', 82: 'green', 83: 'green', 84: 'green', 85: 'green',
    86: 'yellow', 87: 'yellow', 88: 'yellow', 89: 'yellow', 90: 'yellow',
    91: 'yellow', 92: 'yellow', 93: 'yellow', 94: 'yellow',
    95: 'yellow', 96: 'yellow', 97: 'yellow',
    98: 'yellow', 99: 'yellow',
    100: 'red',
  },

  typical: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',
    31: 'white', 32: 'white', 33: 'white', 34: 'white', 35: 'white',
    36: 'white', 37: 'white', 38: 'white', 39: 'white', 40: 'white',
    41: 'white', 42: 'white', 43: 'white', 44: 'white', 45: 'white',
    46: 'white', 47: 'white', 48: 'white', 49: 'white', 50: 'white',
    51: 'green', 52: 'green', 53: 'green', 54: 'green', 55: 'green',
    56: 'green', 57: 'green', 58: 'green', 59: 'green', 60: 'green',
    61: 'green', 62: 'green', 63: 'green', 64: 'green', 65: 'green',
    66: 'green', 67: 'green', 68: 'green', 69: 'green', 70: 'green',
    71: 'green', 72: 'green', 73: 'green', 74: 'green', 75: 'green',
    76: 'green', 77: 'green', 78: 'green', 79: 'green', 80: 'green',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'yellow', 87: 'yellow', 88: 'yellow', 89: 'yellow', 90: 'yellow',
    91: 'yellow', 92: 'yellow', 93: 'yellow', 94: 'yellow',
    95: 'yellow', 96: 'yellow', 97: 'yellow',
    98: 'red', 99: 'red',
    100: 'red',
  },

  good: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',
    31: 'white', 32: 'white', 33: 'white', 34: 'white', 35: 'white',
    36: 'white', 37: 'white', 38: 'white', 39: 'white', 40: 'white',
    41: 'white', 42: 'white', 43: 'white', 44: 'white', 45: 'white',
    46: 'green', 47: 'green', 48: 'green', 49: 'green', 50: 'green',
    51: 'green', 52: 'green', 53: 'green', 54: 'green', 55: 'green',
    56: 'green', 57: 'green', 58: 'green', 59: 'green', 60: 'green',
    61: 'green', 62: 'green', 63: 'green', 64: 'green', 65: 'green',
    66: 'green', 67: 'green', 68: 'green', 69: 'green', 70: 'green',
    71: 'green', 72: 'green', 73: 'green', 74: 'green', 75: 'green',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'yellow', 87: 'yellow', 88: 'yellow', 89: 'yellow', 90: 'yellow',
    91: 'yellow', 92: 'yellow', 93: 'yellow', 94: 'yellow',
    95: 'yellow', 96: 'yellow', 97: 'yellow',
    98: 'red', 99: 'red',
    100: 'red',
  },

  excellent: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',
    31: 'white', 32: 'white', 33: 'white', 34: 'white', 35: 'white',
    36: 'white', 37: 'white', 38: 'white', 39: 'white', 40: 'white',
    41: 'green', 42: 'green', 43: 'green', 44: 'green', 45: 'green',
    46: 'green', 47: 'green', 48: 'green', 49: 'green', 50: 'green',
    51: 'green', 52: 'green', 53: 'green', 54: 'green', 55: 'green',
    56: 'green', 57: 'green', 58: 'green', 59: 'green', 60: 'green',
    61: 'green', 62: 'green', 63: 'green', 64: 'green', 65: 'green',
    66: 'green', 67: 'green', 68: 'green', 69: 'green', 70: 'green',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'yellow', 87: 'yellow', 88: 'yellow', 89: 'yellow', 90: 'yellow',
    91: 'yellow', 92: 'yellow', 93: 'yellow', 94: 'yellow',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  remarkable: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',
    31: 'white', 32: 'white', 33: 'white', 34: 'white', 35: 'white',
    36: 'green', 37: 'green', 38: 'green', 39: 'green', 40: 'green',
    41: 'green', 42: 'green', 43: 'green', 44: 'green', 45: 'green',
    46: 'green', 47: 'green', 48: 'green', 49: 'green', 50: 'green',
    51: 'green', 52: 'green', 53: 'green', 54: 'green', 55: 'green',
    56: 'green', 57: 'green', 58: 'green', 59: 'green', 60: 'green',
    61: 'green', 62: 'green', 63: 'green', 64: 'green', 65: 'green',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'yellow', 87: 'yellow', 88: 'yellow', 89: 'yellow', 90: 'yellow',
    91: 'yellow', 92: 'yellow', 93: 'yellow', 94: 'yellow',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  incredible: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'white', 27: 'white', 28: 'white', 29: 'white', 30: 'white',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'green', 37: 'green', 38: 'green', 39: 'green', 40: 'green',
    41: 'green', 42: 'green', 43: 'green', 44: 'green', 45: 'green',
    46: 'green', 47: 'green', 48: 'green', 49: 'green', 50: 'green',
    51: 'green', 52: 'green', 53: 'green', 54: 'green', 55: 'green',
    56: 'green', 57: 'green', 58: 'green', 59: 'green', 60: 'green',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'yellow', 87: 'yellow', 88: 'yellow', 89: 'yellow', 90: 'yellow',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  amazing: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'white', 22: 'white', 23: 'white', 24: 'white', 25: 'white',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'green', 37: 'green', 38: 'green', 39: 'green', 40: 'green',
    41: 'green', 42: 'green', 43: 'green', 44: 'green', 45: 'green',
    46: 'green', 47: 'green', 48: 'green', 49: 'green', 50: 'green',
    51: 'green', 52: 'green', 53: 'green', 54: 'green', 55: 'green',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'yellow', 87: 'yellow', 88: 'yellow', 89: 'yellow', 90: 'yellow',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  monstrous: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'white', 17: 'white', 18: 'white', 19: 'white', 20: 'white',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'green', 37: 'green', 38: 'green', 39: 'green', 40: 'green',
    41: 'green', 42: 'green', 43: 'green', 44: 'green', 45: 'green',
    46: 'green', 47: 'green', 48: 'green', 49: 'green', 50: 'green',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  unearthly: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'white', 12: 'white', 13: 'white', 14: 'white', 15: 'white',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'green', 37: 'green', 38: 'green', 39: 'green', 40: 'green',
    41: 'green', 42: 'green', 43: 'green', 44: 'green', 45: 'green',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'yellow', 82: 'yellow', 83: 'yellow', 84: 'yellow', 85: 'yellow',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  shiftX: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'white', 8: 'white', 9: 'white', 10: 'white',
    11: 'green', 12: 'green', 13: 'green', 14: 'green', 15: 'green',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'green', 37: 'green', 38: 'green', 39: 'green', 40: 'green',
    41: 'yellow', 42: 'yellow', 43: 'yellow', 44: 'yellow', 45: 'yellow',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'red', 82: 'red', 83: 'red', 84: 'red', 85: 'red',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  shiftY: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'white', 5: 'white', 6: 'white',
    7: 'green', 8: 'green', 9: 'green', 10: 'green',
    11: 'green', 12: 'green', 13: 'green', 14: 'green', 15: 'green',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'green', 37: 'green', 38: 'green', 39: 'green', 40: 'green',
    41: 'yellow', 42: 'yellow', 43: 'yellow', 44: 'yellow', 45: 'yellow',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'yellow', 77: 'yellow', 78: 'yellow', 79: 'yellow', 80: 'yellow',
    81: 'red', 82: 'red', 83: 'red', 84: 'red', 85: 'red',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  shiftZ: {
    1: 'white',
    2: 'white', 3: 'white',
    4: 'green', 5: 'green', 6: 'green',
    7: 'green', 8: 'green', 9: 'green', 10: 'green',
    11: 'green', 12: 'green', 13: 'green', 14: 'green', 15: 'green',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'yellow', 37: 'yellow', 38: 'yellow', 39: 'yellow', 40: 'yellow',
    41: 'yellow', 42: 'yellow', 43: 'yellow', 44: 'yellow', 45: 'yellow',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'red', 77: 'red', 78: 'red', 79: 'red', 80: 'red',
    81: 'red', 82: 'red', 83: 'red', 84: 'red', 85: 'red',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  class1000: {
    1: 'white',
    2: 'green', 3: 'green',
    4: 'green', 5: 'green', 6: 'green',
    7: 'green', 8: 'green', 9: 'green', 10: 'green',
    11: 'green', 12: 'green', 13: 'green', 14: 'green', 15: 'green',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'green', 32: 'green', 33: 'green', 34: 'green', 35: 'green',
    36: 'yellow', 37: 'yellow', 38: 'yellow', 39: 'yellow', 40: 'yellow',
    41: 'yellow', 42: 'yellow', 43: 'yellow', 44: 'yellow', 45: 'yellow',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'yellow', 72: 'yellow', 73: 'yellow', 74: 'yellow', 75: 'yellow',
    76: 'red', 77: 'red', 78: 'red', 79: 'red', 80: 'red',
    81: 'red', 82: 'red', 83: 'red', 84: 'red', 85: 'red',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  class3000: {
    1: 'white',
    2: 'green', 3: 'green',
    4: 'green', 5: 'green', 6: 'green',
    7: 'green', 8: 'green', 9: 'green', 10: 'green',
    11: 'green', 12: 'green', 13: 'green', 14: 'green', 15: 'green',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'green', 27: 'green', 28: 'green', 29: 'green', 30: 'green',
    31: 'yellow', 32: 'yellow', 33: 'yellow', 34: 'yellow', 35: 'yellow',
    36: 'yellow', 37: 'yellow', 38: 'yellow', 39: 'yellow', 40: 'yellow',
    41: 'yellow', 42: 'yellow', 43: 'yellow', 44: 'yellow', 45: 'yellow',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'yellow', 67: 'yellow', 68: 'yellow', 69: 'yellow', 70: 'yellow',
    71: 'red', 72: 'red', 73: 'red', 74: 'red', 75: 'red',
    76: 'red', 77: 'red', 78: 'red', 79: 'red', 80: 'red',
    81: 'red', 82: 'red', 83: 'red', 84: 'red', 85: 'red',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  class5000: {
    1: 'white',
    2: 'green', 3: 'green',
    4: 'green', 5: 'green', 6: 'green',
    7: 'green', 8: 'green', 9: 'green', 10: 'green',
    11: 'green', 12: 'green', 13: 'green', 14: 'green', 15: 'green',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'yellow', 27: 'yellow', 28: 'yellow', 29: 'yellow', 30: 'yellow',
    31: 'yellow', 32: 'yellow', 33: 'yellow', 34: 'yellow', 35: 'yellow',
    36: 'yellow', 37: 'yellow', 38: 'yellow', 39: 'yellow', 40: 'yellow',
    41: 'yellow', 42: 'yellow', 43: 'yellow', 44: 'yellow', 45: 'yellow',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'yellow', 62: 'yellow', 63: 'yellow', 64: 'yellow', 65: 'yellow',
    66: 'red', 67: 'red', 68: 'red', 69: 'red', 70: 'red',
    71: 'red', 72: 'red', 73: 'red', 74: 'red', 75: 'red',
    76: 'red', 77: 'red', 78: 'red', 79: 'red', 80: 'red',
    81: 'red', 82: 'red', 83: 'red', 84: 'red', 85: 'red',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },

  beyond: {
    1: 'white',
    2: 'green', 3: 'green',
    4: 'green', 5: 'green', 6: 'green',
    7: 'green', 8: 'green', 9: 'green', 10: 'green',
    11: 'green', 12: 'green', 13: 'green', 14: 'green', 15: 'green',
    16: 'green', 17: 'green', 18: 'green', 19: 'green', 20: 'green',
    21: 'green', 22: 'green', 23: 'green', 24: 'green', 25: 'green',
    26: 'yellow', 27: 'yellow', 28: 'yellow', 29: 'yellow', 30: 'yellow',
    31: 'yellow', 32: 'yellow', 33: 'yellow', 34: 'yellow', 35: 'yellow',
    36: 'yellow', 37: 'yellow', 38: 'yellow', 39: 'yellow', 40: 'yellow',
    41: 'yellow', 42: 'yellow', 43: 'yellow', 44: 'yellow', 45: 'yellow',
    46: 'yellow', 47: 'yellow', 48: 'yellow', 49: 'yellow', 50: 'yellow',
    51: 'yellow', 52: 'yellow', 53: 'yellow', 54: 'yellow', 55: 'yellow',
    56: 'yellow', 57: 'yellow', 58: 'yellow', 59: 'yellow', 60: 'yellow',
    61: 'red', 62: 'red', 63: 'red', 64: 'red', 65: 'red',
    66: 'red', 67: 'red', 68: 'red', 69: 'red', 70: 'red',
    71: 'red', 72: 'red', 73: 'red', 74: 'red', 75: 'red',
    76: 'red', 77: 'red', 78: 'red', 79: 'red', 80: 'red',
    81: 'red', 82: 'red', 83: 'red', 84: 'red', 85: 'red',
    86: 'red', 87: 'red', 88: 'red', 89: 'red', 90: 'red',
    91: 'red', 92: 'red', 93: 'red', 94: 'red',
    95: 'red', 96: 'red', 97: 'red',
    98: 'red', 99: 'red',
    100: 'red',
  },
};

// ============================================================================
// TEST RUNNER
// ============================================================================

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(description, roll, rank, expected) {
  totalTests++;
  const actual = getFeatResult(roll, rank);
  if (actual === expected) {
    passedTests++;
    return true;
  } else {
    failedTests++;
    failures.push({
      description,
      roll,
      rank,
      expected,
      actual,
    });
    return false;
  }
}

function runAllTests() {
  console.log('========================================');
  console.log('FASERIP Universal Table Test Suite');
  console.log('========================================\n');

  // Test every cell in the Universal Table
  for (const [rank, rollResults] of Object.entries(EXPECTED_RESULTS)) {
    console.log(`Testing rank: ${rank}`);
    let rankPassed = 0;
    let rankFailed = 0;

    for (const [rollStr, expected] of Object.entries(rollResults)) {
      const roll = parseInt(rollStr, 10);
      const passed = test(`${rank} roll ${roll}`, roll, rank, expected);
      if (passed) {
        rankPassed++;
      } else {
        rankFailed++;
      }
    }

    if (rankFailed === 0) {
      console.log(`  ✓ All ${rankPassed} tests passed\n`);
    } else {
      console.log(`  ✗ ${rankFailed} tests failed, ${rankPassed} passed\n`);
    }
  }

  // Test abbreviation mappings
  console.log('Testing rank abbreviation mappings...');
  const abbreviationTests = [
    ['fe', 'feeble', 50, 'white'],
    ['pr', 'poor', 60, 'green'],
    ['ty', 'typical', 85, 'yellow'],
    ['gd', 'good', 99, 'red'],
    ['ex', 'excellent', 75, 'yellow'],
    ['rm', 'remarkable', 70, 'yellow'],
    ['in', 'incredible', 65, 'yellow'],
    ['am', 'amazing', 92, 'red'],
    ['mn', 'monstrous', 50, 'green'],
    ['un', 'unearthly', 45, 'green'],
    ['shx', 'shiftX', 80, 'yellow'],
    ['shy', 'shiftY', 81, 'red'],
    ['shz', 'shiftZ', 75, 'yellow'],
    ['b', 'beyond', 60, 'yellow'],
  ];

  for (const [abbr, fullName, roll, expected] of abbreviationTests) {
    test(`Abbreviation ${abbr} -> ${fullName} roll ${roll}`, roll, abbr, expected);
  }
  console.log(`  ✓ Abbreviation tests complete\n`);

  // Summary
  console.log('========================================');
  console.log('TEST SUMMARY');
  console.log('========================================');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log('');

  if (failures.length > 0) {
    console.log('FAILURES:');
    console.log('----------------------------------------');
    for (const f of failures) {
      console.log(`  ${f.description}`);
      console.log(`    Expected: ${f.expected}, Got: ${f.actual}`);
    }
    console.log('');
  }

  if (failedTests === 0) {
    console.log('✓ ALL TESTS PASSED');
  } else {
    console.log(`✗ ${failedTests} TESTS FAILED`);
    process.exit(1);
  }
}

// Run tests
runAllTests();
