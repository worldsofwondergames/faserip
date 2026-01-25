import { FASERIP } from './config.mjs';

/**
 * Universal Results Table thresholds
 * For each rank, defines the minimum d100 roll needed for each color result
 *
 * Higher rolls are better in FASERIP:
 * - Roll of 01: Always White (automatic failure)
 * - Roll of 100: Always Red (automatic critical success)
 * - Otherwise: Compare roll against thresholds
 *
 * Algorithm:
 *   if roll >= red, return Red
 *   else if roll >= yellow, return Yellow
 *   else if roll >= green, return Green
 *   else return White
 */
export const UNIVERSAL_TABLE = {
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

/**
 * Get the result color for a FEAT roll
 * @param {number} roll - The d100 roll result (1-100)
 * @param {string} rankKey - The rank key (e.g., 'good', 'remarkable')
 * @returns {string} The result color ('white', 'green', 'yellow', or 'red')
 */
export function getFeatResult(roll, rankKey) {
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

/**
 * Normalize a rank key to the standard format used in UNIVERSAL_TABLE
 * @param {string} rankKey - The rank key or name to normalize
 * @returns {string} The normalized rank key
 */
export function normalizeRankKey(rankKey) {
  if (!rankKey) return 'typical';

  const key = rankKey.toLowerCase().replace(/[\s-]/g, '');

  // Direct matches
  if (UNIVERSAL_TABLE[key]) return key;

  // Handle common variations
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

/**
 * Apply column shifts to a rank
 * @param {string} rankKey - The starting rank key
 * @param {number} shift - Number of column shifts (positive = better, negative = worse)
 * @returns {string} The new rank key after shifting
 */
export function applyColumnShift(rankKey, shift) {
  const normalizedRank = normalizeRankKey(rankKey);
  const currentIndex = FASERIP.rankOrder.indexOf(normalizedRank);

  if (currentIndex === -1) {
    console.warn(`FASERIP | Unknown rank for column shift: ${rankKey}`);
    return normalizedRank;
  }

  // Calculate new index, clamping to valid range
  const newIndex = Math.max(0, Math.min(FASERIP.rankOrder.length - 1, currentIndex + shift));
  return FASERIP.rankOrder[newIndex];
}

/**
 * Compare two ranks to determine intensity vs ability result
 * @param {string} intensityRank - The intensity/difficulty rank
 * @param {string} abilityRank - The character's ability rank
 * @returns {object} Object with comparison info and minimum result needed
 */
export function compareRanks(intensityRank, abilityRank) {
  const intensityIndex = FASERIP.rankOrder.indexOf(normalizeRankKey(intensityRank));
  const abilityIndex = FASERIP.rankOrder.indexOf(normalizeRankKey(abilityRank));

  const difference = abilityIndex - intensityIndex;

  if (difference >= 3) {
    return { automatic: true, minimumResult: 'green', description: 'Automatic success' };
  } else if (difference >= 1) {
    return { automatic: false, minimumResult: 'green', description: 'Green result needed' };
  } else if (difference === 0) {
    return { automatic: false, minimumResult: 'yellow', description: 'Yellow result needed' };
  } else if (difference >= -1) {
    return { automatic: false, minimumResult: 'red', description: 'Red result needed' };
  } else {
    return { automatic: false, minimumResult: 'impossible', description: 'Impossible (or Red with GM permission)' };
  }
}

/**
 * Get the color CSS class for a result
 * @param {string} color - The result color
 * @returns {string} CSS class name
 */
export function getResultColorClass(color) {
  const classes = {
    white: 'feat-white',
    green: 'feat-green',
    yellow: 'feat-yellow',
    red: 'feat-red',
  };
  return classes[color] || 'feat-white';
}

/**
 * Get display information for a result color
 * @param {string} color - The result color
 * @returns {object} Object with label and cssClass
 */
export function getResultDisplay(color) {
  return {
    color: color,
    label: FASERIP.resultColors[color] || 'FASERIP.Result.White',
    cssClass: getResultColorClass(color),
  };
}
