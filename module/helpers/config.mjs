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
 * Action types from the Universal Table with their result columns
 * Each action has: label, abbreviation, governing ability, and results for white/green/yellow/red
 */
FASERIP.actionTypes = {
  bluntAttacks: {
    label: 'FASERIP.Action.BluntAttacks',
    abbr: 'BA',
    ability: 'fighting',
    results: { white: 'miss', green: 'hit', yellow: 'slam', red: 'stun' }
  },
  edgedAttacks: {
    label: 'FASERIP.Action.EdgedAttacks',
    abbr: 'EA',
    ability: 'fighting',
    results: { white: 'miss', green: 'hit', yellow: 'stun', red: 'kill' }
  },
  shooting: {
    label: 'FASERIP.Action.Shooting',
    abbr: 'Sh',
    ability: 'agility',
    results: { white: 'miss', green: 'hit', yellow: 'bullseye', red: 'kill' }
  },
  throwingEdged: {
    label: 'FASERIP.Action.ThrowingEdged',
    abbr: 'TE',
    ability: 'agility',
    results: { white: 'miss', green: 'hit', yellow: 'stun', red: 'kill' }
  },
  throwingBlunt: {
    label: 'FASERIP.Action.ThrowingBlunt',
    abbr: 'TB',
    ability: 'agility',
    results: { white: 'miss', green: 'hit', yellow: 'stun', red: 'stun' }
  },
  energy: {
    label: 'FASERIP.Action.Energy',
    abbr: 'En',
    ability: 'agility',
    results: { white: 'miss', green: 'hit', yellow: 'bullseye', red: 'kill' }
  },
  force: {
    label: 'FASERIP.Action.Force',
    abbr: 'Fo',
    ability: 'agility',
    results: { white: 'miss', green: 'hit', yellow: 'bullseye', red: 'stun' }
  },
  grappling: {
    label: 'FASERIP.Action.Grappling',
    abbr: 'Gp',
    ability: 'strength',
    results: { white: 'miss', green: 'miss', yellow: 'partial', red: 'hold' }
  },
  grabbing: {
    label: 'FASERIP.Action.Grabbing',
    abbr: 'Gb',
    ability: 'strength',
    results: { white: 'miss', green: 'take', yellow: 'grab', red: 'hold' }
  },
  escaping: {
    label: 'FASERIP.Action.Escaping',
    abbr: 'Es',
    ability: 'strength',
    results: { white: 'miss', green: 'miss', yellow: 'escape', red: 'break' }
  },
  charging: {
    label: 'FASERIP.Action.Charging',
    abbr: 'Ch',
    ability: 'endurance',
    results: { white: 'miss', green: 'hit', yellow: 'slam', red: 'stun' }
  },
  dodging: {
    label: 'FASERIP.Action.Dodging',
    abbr: 'Do',
    ability: 'agility',
    results: { white: 'miss', green: 'minus2cs', yellow: 'minus4cs', red: 'minus6cs' }
  },
  evading: {
    label: 'FASERIP.Action.Evading',
    abbr: 'Ev',
    ability: 'fighting',
    results: { white: 'none', green: 'evasion', yellow: 'plus1cs', red: 'plus1cs' }
  },
  blocking: {
    label: 'FASERIP.Action.Blocking',
    abbr: 'Bl',
    ability: 'strength',
    results: { white: 'minus6cs', green: 'minus4cs', yellow: 'minus2cs', red: 'catch' }
  },
  catching: {
    label: 'FASERIP.Action.Catching',
    abbr: 'Ca',
    ability: 'agility',
    results: { white: 'autohit', green: 'miss', yellow: 'damage', red: 'catch' }
  },
  stun: {
    label: 'FASERIP.Action.Stun',
    abbr: 'St',
    ability: 'endurance',
    results: { white: '1to10', green: '1round', yellow: 'no', red: 'no' }
  },
  slam: {
    label: 'FASERIP.Action.Slam',
    abbr: 'Sl',
    ability: 'endurance',
    results: { white: 'grandSlam', green: '1area', yellow: 'stagger', red: 'no' }
  },
  kill: {
    label: 'FASERIP.Action.Kill',
    abbr: 'Ki',
    ability: 'endurance',
    results: { white: 'enLoss', green: 'enduranceSlam', yellow: 'no', red: 'no' }
  },
};

/**
 * Action result labels for localization
 */
FASERIP.actionResults = {
  miss: 'FASERIP.ActionResult.Miss',
  hit: 'FASERIP.ActionResult.Hit',
  slam: 'FASERIP.ActionResult.Slam',
  stun: 'FASERIP.ActionResult.Stun',
  kill: 'FASERIP.ActionResult.Kill',
  bullseye: 'FASERIP.ActionResult.Bullseye',
  partial: 'FASERIP.ActionResult.Partial',
  hold: 'FASERIP.ActionResult.Hold',
  take: 'FASERIP.ActionResult.Take',
  grab: 'FASERIP.ActionResult.Grab',
  escape: 'FASERIP.ActionResult.Escape',
  break: 'FASERIP.ActionResult.Break',
  none: 'FASERIP.ActionResult.None',
  evasion: 'FASERIP.ActionResult.Evasion',
  minus2cs: 'FASERIP.ActionResult.Minus2CS',
  minus4cs: 'FASERIP.ActionResult.Minus4CS',
  minus6cs: 'FASERIP.ActionResult.Minus6CS',
  plus1cs: 'FASERIP.ActionResult.Plus1CS',
  catch: 'FASERIP.ActionResult.Catch',
  autohit: 'FASERIP.ActionResult.Autohit',
  damage: 'FASERIP.ActionResult.Damage',
  '1to10': 'FASERIP.ActionResult.1to10',
  '1round': 'FASERIP.ActionResult.1Round',
  no: 'FASERIP.ActionResult.No',
  grandSlam: 'FASERIP.ActionResult.GrandSlam',
  '1area': 'FASERIP.ActionResult.1Area',
  stagger: 'FASERIP.ActionResult.Stagger',
  enLoss: 'FASERIP.ActionResult.EnLoss',
  enduranceSlam: 'FASERIP.ActionResult.EnduranceSlam',
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
  ammunition: 'FASERIP.Equipment.Type.Ammunition',
};

/**
 * Vehicle types
 */
FASERIP.vehicleTypes = {
  road: 'FASERIP.Vehicle.Type.Road',
  offRoad: 'FASERIP.Vehicle.Type.OffRoad',
  railed: 'FASERIP.Vehicle.Type.Railed',
  gev: 'FASERIP.Vehicle.Type.GEV',
  air: 'FASERIP.Vehicle.Type.Air',
  space: 'FASERIP.Vehicle.Type.Space',
  water: 'FASERIP.Vehicle.Type.Water',
  sub: 'FASERIP.Vehicle.Type.Sub',
};

/**
 * Ammunition round types
 */
FASERIP.roundTypes = {
  standard: 'FASERIP.Ammunition.RoundType.Standard',
  armorPiercing: 'FASERIP.Ammunition.RoundType.ArmorPiercing',
  mercy: 'FASERIP.Ammunition.RoundType.Mercy',
  rubber: 'FASERIP.Ammunition.RoundType.Rubber',
  explosive: 'FASERIP.Ammunition.RoundType.Explosive',
  canister: 'FASERIP.Ammunition.RoundType.Canister',
  gyrojet: 'FASERIP.Ammunition.RoundType.Gyrojet',
  heatSeeker: 'FASERIP.Ammunition.RoundType.HeatSeeker',
  powerPack: 'FASERIP.Ammunition.RoundType.PowerPack',
};

/**
 * Weapon categories
 */
FASERIP.weaponCategories = {
  ranged: 'FASERIP.Weapon.Category.Ranged',
  melee: 'FASERIP.Weapon.Category.Melee',
  thrown: 'FASERIP.Weapon.Category.Thrown',
  other: 'FASERIP.Weapon.Category.Other',
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

/**
 * Weapon property tags
 */
FASERIP.weaponTags = {
  oneHanded: 'FASERIP.Weapon.Tag.OneHanded',
  twoHanded: 'FASERIP.Weapon.Tag.TwoHanded',
  illegal: 'FASERIP.Weapon.Tag.Illegal',
  military: 'FASERIP.Weapon.Tag.Military',
  powerPack: 'FASERIP.Weapon.Tag.PowerPack',
  bursts: 'FASERIP.Weapon.Tag.Bursts',
  scatters: 'FASERIP.Weapon.Tag.Scatters',
  twoMenToFire: 'FASERIP.Weapon.Tag.TwoMenToFire',
  stationary: 'FASERIP.Weapon.Tag.Stationary',
};

/**
 * Map abilities to their associated action types from the Universal Table
 */
FASERIP.abilityActions = {
  fighting: ['bluntAttacks', 'edgedAttacks', 'evading'],
  agility: ['shooting', 'throwingEdged', 'throwingBlunt', 'energy', 'force', 'dodging', 'catching'],
  strength: ['grappling', 'grabbing', 'escaping', 'blocking'],
  endurance: ['charging', 'stun', 'slam', 'kill'],
  reason: [],
  intuition: [],
  psyche: [],
};

/**
 * Color order for success comparison (index-based)
 */
FASERIP.colorOrder = ['white', 'green', 'yellow', 'red'];
