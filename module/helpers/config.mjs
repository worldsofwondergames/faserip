export const FASERIP = {};

/**
 * The set of Ability Scores used within the FASERIP system.
 * @type {Object}
 */
FASERIP.abilities = {
  fighting: 'FASERIP.Ability.Fighting.long',
  agility: 'FASERIP.Ability.Agility.long',
  strength: 'FASERIP.Ability.Strength.long',
  endurance: 'FASERIP.Ability.Endurance.long',
  reason: 'FASERIP.Ability.Reason.long',
  intuition: 'FASERIP.Ability.Intuition.long',
  psyche: 'FASERIP.Ability.Psyche.long',
};

FASERIP.abilityAbbreviations = {
  fighting: 'FASERIP.Ability.Fighting.abbr',
  agility: 'FASERIP.Ability.Agility.abbr',
  strength: 'FASERIP.Ability.Strength.abbr',
  endurance: 'FASERIP.Ability.Endurance.abbr',
  reason: 'FASERIP.Ability.Reason.abbr',
  intuition: 'FASERIP.Ability.Intuition.abbr',
  psyche: 'FASERIP.Ability.Psyche.abbr',
};

/**
 * Physical abilities (contribute to Health)
 */
FASERIP.physicalAbilities = ['fighting', 'agility', 'strength', 'endurance'];

/**
 * Mental abilities (contribute to Karma)
 */
FASERIP.mentalAbilities = ['reason', 'intuition', 'psyche'];

/**
 * Rank definitions with standard values and ranges
 * @type {Object}
 */
FASERIP.ranks = {
  shift0: { label: 'FASERIP.Rank.Shift0', abbr: 'Sh0', value: 0, min: 0, max: 0 },
  feeble: { label: 'FASERIP.Rank.Feeble', abbr: 'Fe', value: 2, min: 1, max: 3 },
  poor: { label: 'FASERIP.Rank.Poor', abbr: 'Pr', value: 4, min: 4, max: 5 },
  typical: { label: 'FASERIP.Rank.Typical', abbr: 'Ty', value: 6, min: 6, max: 9 },
  good: { label: 'FASERIP.Rank.Good', abbr: 'Gd', value: 10, min: 10, max: 19 },
  excellent: { label: 'FASERIP.Rank.Excellent', abbr: 'Ex', value: 20, min: 20, max: 29 },
  remarkable: { label: 'FASERIP.Rank.Remarkable', abbr: 'Rm', value: 30, min: 30, max: 39 },
  incredible: { label: 'FASERIP.Rank.Incredible', abbr: 'In', value: 40, min: 40, max: 49 },
  amazing: { label: 'FASERIP.Rank.Amazing', abbr: 'Am', value: 50, min: 50, max: 74 },
  monstrous: { label: 'FASERIP.Rank.Monstrous', abbr: 'Mn', value: 75, min: 75, max: 99 },
  unearthly: { label: 'FASERIP.Rank.Unearthly', abbr: 'Un', value: 100, min: 100, max: 149 },
  shiftX: { label: 'FASERIP.Rank.ShiftX', abbr: 'ShX', value: 150, min: 150, max: 199 },
  shiftY: { label: 'FASERIP.Rank.ShiftY', abbr: 'ShY', value: 200, min: 200, max: 499 },
  shiftZ: { label: 'FASERIP.Rank.ShiftZ', abbr: 'ShZ', value: 500, min: 500, max: 999 },
  class1000: { label: 'FASERIP.Rank.Class1000', abbr: 'Cl1000', value: 1000, min: 1000, max: 2999 },
  class3000: { label: 'FASERIP.Rank.Class3000', abbr: 'Cl3000', value: 3000, min: 3000, max: 4999 },
  class5000: { label: 'FASERIP.Rank.Class5000', abbr: 'Cl5000', value: 5000, min: 5000, max: 9999 },
  beyond: { label: 'FASERIP.Rank.Beyond', abbr: 'By', value: Infinity, min: 10000, max: Infinity },
};

/**
 * Ordered array of rank keys for column shifting
 */
FASERIP.rankOrder = [
  'shift0', 'feeble', 'poor', 'typical', 'good', 'excellent',
  'remarkable', 'incredible', 'amazing', 'monstrous', 'unearthly',
  'shiftX', 'shiftY', 'shiftZ', 'class1000', 'class3000', 'class5000', 'beyond'
];

/**
 * Character origins for Heroes and Villains
 */
FASERIP.origins = {
  alteredHuman: 'FASERIP.Origin.AlteredHuman',
  mutant: 'FASERIP.Origin.Mutant',
  highTech: 'FASERIP.Origin.HighTech',
  robot: 'FASERIP.Origin.Robot',
  alien: 'FASERIP.Origin.Alien',
  magic: 'FASERIP.Origin.Magic',
  birthright: 'FASERIP.Origin.Birthright',
};

/**
 * FEAT result colors
 */
FASERIP.resultColors = {
  white: 'FASERIP.Result.White',
  green: 'FASERIP.Result.Green',
  yellow: 'FASERIP.Result.Yellow',
  red: 'FASERIP.Result.Red',
};

/**
 * Attack types and their result columns
 */
FASERIP.attackTypes = {
  blunt: {
    label: 'FASERIP.Attack.Blunt',
    ability: 'fighting',
    results: ['miss', 'hit', 'slam', 'stun']
  },
  edged: {
    label: 'FASERIP.Attack.Edged',
    ability: 'fighting',
    results: ['miss', 'hit', 'stun', 'kill']
  },
  shooting: {
    label: 'FASERIP.Attack.Shooting',
    ability: 'agility',
    results: ['miss', 'hit', 'bullseye', 'kill']
  },
  energy: {
    label: 'FASERIP.Attack.Energy',
    ability: 'agility',
    results: ['miss', 'hit', 'bullseye', 'kill']
  },
  force: {
    label: 'FASERIP.Attack.Force',
    ability: 'agility',
    results: ['miss', 'hit', 'bullseye', 'stun']
  },
  grappling: {
    label: 'FASERIP.Attack.Grappling',
    ability: 'strength',
    results: ['miss', 'partial', 'full', 'escape']
  },
  charging: {
    label: 'FASERIP.Attack.Charging',
    ability: 'endurance',
    results: ['miss', 'hit', 'slam', 'stun']
  },
};

/**
 * Talent categories
 */
FASERIP.talentCategories = {
  weapon: 'FASERIP.Talent.Category.Weapon',
  fighting: 'FASERIP.Talent.Category.Fighting',
  professional: 'FASERIP.Talent.Category.Professional',
  scientific: 'FASERIP.Talent.Category.Scientific',
  mystic: 'FASERIP.Talent.Category.Mystic',
  other: 'FASERIP.Talent.Category.Other',
};

/**
 * Equipment types
 */
FASERIP.equipmentTypes = {
  weapon: 'FASERIP.Equipment.Type.Weapon',
  armor: 'FASERIP.Equipment.Type.Armor',
  vehicle: 'FASERIP.Equipment.Type.Vehicle',
  gear: 'FASERIP.Equipment.Type.Gear',
};

/**
 * Weapon attack types
 */
FASERIP.weaponAttackTypes = {
  shooting: 'FASERIP.Weapon.AttackType.Shooting',
  energy: 'FASERIP.Weapon.AttackType.Energy',
  force: 'FASERIP.Weapon.AttackType.Force',
  edged: 'FASERIP.Weapon.AttackType.Edged',
  blunt: 'FASERIP.Weapon.AttackType.Blunt',
  throwing: 'FASERIP.Weapon.AttackType.Throwing',
  grappling: 'FASERIP.Weapon.AttackType.Grappling',
};
