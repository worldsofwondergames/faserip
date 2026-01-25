import { FASERIP } from './config.mjs';

/**
 * Convert a numeric value to its corresponding rank key
 * @param {number} value - The numeric value
 * @returns {string} The rank key (e.g., 'good', 'remarkable')
 */
export function valueToRankKey(value) {
  if (value === null || value === undefined || value < 0) return 'shift0';

  // Iterate through ranks to find the matching range
  for (const [key, rank] of Object.entries(FASERIP.ranks)) {
    if (value >= rank.min && value <= rank.max) {
      return key;
    }
  }

  // If value exceeds all ranges, return highest rank
  return 'class5000';
}

/**
 * Convert a numeric value to its rank abbreviation
 * @param {number} value - The numeric value
 * @returns {string} The rank abbreviation (e.g., 'Gd', 'Rm')
 */
export function valueToRankAbbr(value) {
  const rankKey = valueToRankKey(value);
  return FASERIP.ranks[rankKey]?.abbr || 'Ty';
}

/**
 * Convert a numeric value to its rank label
 * @param {number} value - The numeric value
 * @returns {string} The rank label localization key
 */
export function valueToRankLabel(value) {
  const rankKey = valueToRankKey(value);
  return FASERIP.ranks[rankKey]?.label || 'FASERIP.Rank.Typical';
}

/**
 * Convert a rank key to its standard numeric value
 * @param {string} rankKey - The rank key (e.g., 'good', 'remarkable')
 * @returns {number} The standard numeric value for that rank
 */
export function rankToValue(rankKey) {
  if (!rankKey) return 6; // Default to Typical

  const normalizedKey = rankKey.toLowerCase().replace(/[\s-]/g, '');
  const rank = FASERIP.ranks[normalizedKey];

  if (rank) return rank.value;

  // Try to find by abbreviation
  for (const [key, r] of Object.entries(FASERIP.ranks)) {
    if (r.abbr.toLowerCase() === normalizedKey) {
      return r.value;
    }
  }

  return 6; // Default to Typical
}

/**
 * Calculate Health from abilities
 * Health = Fighting + Agility + Strength + Endurance
 * @param {object} abilities - Object containing ability values
 * @returns {number} The calculated Health value
 */
export function calculateHealth(abilities) {
  if (!abilities) return 0;

  const fighting = abilities.fighting?.value || 0;
  const agility = abilities.agility?.value || 0;
  const strength = abilities.strength?.value || 0;
  const endurance = abilities.endurance?.value || 0;

  return fighting + agility + strength + endurance;
}

/**
 * Calculate Karma from abilities
 * Karma = Reason + Intuition + Psyche
 * @param {object} abilities - Object containing ability values
 * @returns {number} The calculated Karma value
 */
export function calculateKarma(abilities) {
  if (!abilities) return 0;

  const reason = abilities.reason?.value || 0;
  const intuition = abilities.intuition?.value || 0;
  const psyche = abilities.psyche?.value || 0;

  return reason + intuition + psyche;
}

/**
 * Get the starting Popularity for an origin
 * @param {string} origin - The origin key
 * @returns {number} The starting Popularity value
 */
export function getStartingPopularity(origin) {
  if (!origin) return 10;

  const lowPopOrigins = ['mutant', 'robot'];
  if (lowPopOrigins.includes(origin.toLowerCase())) {
    return 0;
  }

  return 10;
}

/**
 * Format a rank for display (abbreviation + value)
 * @param {number} value - The numeric value
 * @param {boolean} showValue - Whether to show the numeric value
 * @returns {string} Formatted string like "Rm (30)" or just "Rm"
 */
export function formatRank(value, showValue = true) {
  const abbr = valueToRankAbbr(value);
  if (showValue) {
    return `${abbr} (${value})`;
  }
  return abbr;
}

/**
 * Parse a rank string and return the numeric value
 * Handles formats like "Remarkable", "Rm", "30", "Rm (30)"
 * @param {string} rankString - The rank string to parse
 * @returns {number} The numeric value
 */
export function parseRank(rankString) {
  if (!rankString) return 6;

  // If it's already a number
  if (typeof rankString === 'number') return rankString;

  const str = String(rankString).trim();

  // Try to extract a number from formats like "Rm (30)"
  const numMatch = str.match(/\((\d+)\)/);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  // Try to parse as plain number
  const asNumber = parseInt(str, 10);
  if (!isNaN(asNumber)) {
    return asNumber;
  }

  // Try to convert from rank name/abbreviation
  return rankToValue(str);
}

/**
 * Validate that a value is within a valid rank range
 * @param {number} value - The value to validate
 * @returns {number} The clamped value (minimum 0)
 */
export function clampRankValue(value) {
  return Math.max(0, value);
}

/**
 * Get all abilities organized by type
 * @returns {object} Object with physical and mental ability arrays
 */
export function getAbilitiesByType() {
  return {
    physical: FASERIP.physicalAbilities,
    mental: FASERIP.mentalAbilities,
    all: [...FASERIP.physicalAbilities, ...FASERIP.mentalAbilities],
  };
}

/**
 * Calculate initiative modifier based on Intuition
 * @param {number} intuitionValue - The Intuition ability value
 * @returns {number} The initiative modifier
 */
export function getInitiativeModifier(intuitionValue) {
  // In FASERIP, initiative is 1d10 + Intuition rank value
  return intuitionValue || 0;
}

/**
 * Determine if an ability is physical or mental
 * @param {string} abilityKey - The ability key
 * @returns {string} 'physical', 'mental', or 'unknown'
 */
export function getAbilityType(abilityKey) {
  if (FASERIP.physicalAbilities.includes(abilityKey)) return 'physical';
  if (FASERIP.mentalAbilities.includes(abilityKey)) return 'mental';
  return 'unknown';
}
