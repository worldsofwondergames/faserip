/**
 * FASERIP FEAT Roll System Tests
 *
 * Tests for column shifts, intensity comparison, color requirements, and action results.
 * Run with: node tests/feat-roll.test.mjs
 */

// Mock the FASERIP config
const FASERIP = {
  rankOrder: [
    'shift0', 'feeble', 'poor', 'typical', 'good', 'excellent',
    'remarkable', 'incredible', 'amazing', 'monstrous', 'unearthly',
    'shiftX', 'shiftY', 'shiftZ', 'class1000', 'class3000', 'class5000', 'beyond'
  ],
  colorOrder: ['white', 'green', 'yellow', 'red'],
  actionTypes: {
    bluntAttacks: {
      label: 'FASERIP.Action.BluntAttacks',
      abbr: 'BA',
      ability: 'fighting',
      results: { white: 'miss', green: 'hit', yellow: 'slam', red: 'stun' }
    },
    energy: {
      label: 'FASERIP.Action.Energy',
      abbr: 'En',
      ability: 'agility',
      results: { white: 'miss', green: 'hit', yellow: 'bullseye', red: 'kill' }
    },
    grappling: {
      label: 'FASERIP.Action.Grappling',
      abbr: 'Gp',
      ability: 'strength',
      results: { white: 'miss', green: 'miss', yellow: 'partial', red: 'hold' }
    },
  },
  actionResults: {
    miss: 'FASERIP.ActionResult.Miss',
    hit: 'FASERIP.ActionResult.Hit',
    slam: 'FASERIP.ActionResult.Slam',
    stun: 'FASERIP.ActionResult.Stun',
    bullseye: 'FASERIP.ActionResult.Bullseye',
    kill: 'FASERIP.ActionResult.Kill',
    partial: 'FASERIP.ActionResult.Partial',
    hold: 'FASERIP.ActionResult.Hold',
  }
};

// ============================================================
// Helper Functions (copied from universal-table.mjs for testing)
// ============================================================

function normalizeRankKey(rankKey) {
  if (!rankKey) return 'typical';
  const key = rankKey.toLowerCase().replace(/[\s-]/g, '');

  if (FASERIP.rankOrder.includes(key)) return key;

  const mappings = {
    'sh0': 'shift0', 'fe': 'feeble', 'pr': 'poor', 'ty': 'typical',
    'gd': 'good', 'ex': 'excellent', 'rm': 'remarkable', 'in': 'incredible',
    'am': 'amazing', 'mn': 'monstrous', 'un': 'unearthly',
    'shx': 'shiftX', 'shy': 'shiftY', 'shz': 'shiftZ',
    'cl1000': 'class1000', 'cl3000': 'class3000', 'cl5000': 'class5000',
    'shiftx': 'shiftX', 'shifty': 'shiftY', 'shiftz': 'shiftZ', 'b': 'beyond',
  };

  return mappings[key] || 'typical';
}

function applyColumnShiftWithLimits(rankKey, shift) {
  const normalizedRank = normalizeRankKey(rankKey);
  const currentIndex = FASERIP.rankOrder.indexOf(normalizedRank);

  if (currentIndex === -1) {
    return { effectiveRank: normalizedRank, wasLimited: false, reason: null };
  }

  // Class 1000+ cannot be shifted
  const classRanks = ['class1000', 'class3000', 'class5000', 'beyond'];
  if (classRanks.includes(normalizedRank)) {
    return {
      effectiveRank: normalizedRank,
      wasLimited: shift !== 0,
      reason: shift !== 0 ? 'classRankNoShift' : null
    };
  }

  // Shiftable ranks clamp between shift0 (index 0) and shiftZ (index 13)
  const minIndex = 0;  // shift0
  const maxIndex = 13; // shiftZ

  let newIndex = currentIndex + shift;
  let wasLimited = false;
  let reason = null;

  if (newIndex < minIndex) {
    newIndex = minIndex;
    wasLimited = true;
    reason = 'minRankReached';
  } else if (newIndex > maxIndex) {
    newIndex = maxIndex;
    wasLimited = true;
    reason = 'maxShiftableRankReached';
  }

  return {
    effectiveRank: FASERIP.rankOrder[newIndex],
    wasLimited,
    reason
  };
}

function getRequiredColor(intensityRank, effectiveRank) {
  const intensityIndex = FASERIP.rankOrder.indexOf(normalizeRankKey(intensityRank));
  const abilityIndex = FASERIP.rankOrder.indexOf(normalizeRankKey(effectiveRank));

  if (intensityIndex === -1 || abilityIndex === -1) {
    return 'green';
  }

  const difference = abilityIndex - intensityIndex;

  if (difference >= 1) return 'green';      // Ability > Intensity
  if (difference === 0) return 'yellow';    // Ability = Intensity
  if (difference >= -1) return 'red';       // Ability 1 rank below
  return 'impossible';                       // Ability 2+ ranks below
}

function meetsColorRequirement(resultColor, requiredColor) {
  if (requiredColor === 'impossible') return false;

  const colorOrder = FASERIP.colorOrder;
  const resultIndex = colorOrder.indexOf(resultColor);
  const requiredIndex = colorOrder.indexOf(requiredColor);

  return resultIndex >= requiredIndex;
}

function getActionResult(actionType, color) {
  const action = FASERIP.actionTypes?.[actionType];
  if (!action) return { resultKey: null, localizedKey: null };

  const resultKey = action.results[color];
  if (!resultKey) return { resultKey: null, localizedKey: null };

  const localizedKey = FASERIP.actionResults?.[resultKey];

  return {
    resultKey,
    localizedKey: localizedKey || null
  };
}

// ============================================================
// Test Runner
// ============================================================

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(description, actual, expected) {
  totalTests++;
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);

  if (actualStr === expectedStr) {
    passedTests++;
  } else {
    failedTests++;
    failures.push({ description, actual, expected });
  }
}

// ============================================================
// Column Shift Tests
// ============================================================

console.log('\n=== COLUMN SHIFT TESTS ===\n');

// Test positive shifts
test('Good +1 CS = Excellent',
  applyColumnShiftWithLimits('good', 1).effectiveRank,
  'excellent'
);

test('Good +2 CS = Remarkable',
  applyColumnShiftWithLimits('good', 2).effectiveRank,
  'remarkable'
);

test('Good +3 CS = Incredible',
  applyColumnShiftWithLimits('good', 3).effectiveRank,
  'incredible'
);

// Test negative shifts
test('Good -1 CS = Typical',
  applyColumnShiftWithLimits('good', -1).effectiveRank,
  'typical'
);

test('Good -2 CS = Poor',
  applyColumnShiftWithLimits('good', -2).effectiveRank,
  'poor'
);

test('Good -3 CS = Feeble',
  applyColumnShiftWithLimits('good', -3).effectiveRank,
  'feeble'
);

// Test clamping at minimum (Shift 0)
test('Feeble -1 CS = Shift0 (clamped)',
  applyColumnShiftWithLimits('feeble', -1).effectiveRank,
  'shift0'
);

test('Feeble -3 CS = Shift0 (clamped)',
  applyColumnShiftWithLimits('feeble', -3).effectiveRank,
  'shift0'
);

test('Shift0 -1 CS = Shift0 (already at min)',
  applyColumnShiftWithLimits('shift0', -1).effectiveRank,
  'shift0'
);

test('Shift0 -1 CS wasLimited = true',
  applyColumnShiftWithLimits('shift0', -1).wasLimited,
  true
);

test('Shift0 -1 CS reason = minRankReached',
  applyColumnShiftWithLimits('shift0', -1).reason,
  'minRankReached'
);

// Test clamping at maximum shiftable rank (Shift Z)
test('Unearthly +3 CS = ShiftZ (clamped)',
  applyColumnShiftWithLimits('unearthly', 3).effectiveRank,
  'shiftZ'
);

test('ShiftY +2 CS = ShiftZ (clamped)',
  applyColumnShiftWithLimits('shiftY', 2).effectiveRank,
  'shiftZ'
);

test('ShiftZ +1 CS = ShiftZ (at max)',
  applyColumnShiftWithLimits('shiftZ', 1).effectiveRank,
  'shiftZ'
);

test('ShiftZ +1 CS wasLimited = true',
  applyColumnShiftWithLimits('shiftZ', 1).wasLimited,
  true
);

test('ShiftZ +1 CS reason = maxShiftableRankReached',
  applyColumnShiftWithLimits('shiftZ', 1).reason,
  'maxShiftableRankReached'
);

// Test Class 1000+ cannot be shifted
test('Class1000 +1 CS = Class1000 (no shift)',
  applyColumnShiftWithLimits('class1000', 1).effectiveRank,
  'class1000'
);

test('Class1000 +1 CS wasLimited = true',
  applyColumnShiftWithLimits('class1000', 1).wasLimited,
  true
);

test('Class1000 +1 CS reason = classRankNoShift',
  applyColumnShiftWithLimits('class1000', 1).reason,
  'classRankNoShift'
);

test('Class3000 -2 CS = Class3000 (no shift)',
  applyColumnShiftWithLimits('class3000', -2).effectiveRank,
  'class3000'
);

test('Class5000 +3 CS = Class5000 (no shift)',
  applyColumnShiftWithLimits('class5000', 3).effectiveRank,
  'class5000'
);

test('Beyond -1 CS = Beyond (no shift)',
  applyColumnShiftWithLimits('beyond', -1).effectiveRank,
  'beyond'
);

// Test 0 shift doesn't flag as limited
test('Good +0 CS = Good (no change)',
  applyColumnShiftWithLimits('good', 0).effectiveRank,
  'good'
);

test('Good +0 CS wasLimited = false',
  applyColumnShiftWithLimits('good', 0).wasLimited,
  false
);

test('Class1000 +0 CS wasLimited = false',
  applyColumnShiftWithLimits('class1000', 0).wasLimited,
  false
);

// ============================================================
// Intensity Comparison Tests
// ============================================================

console.log('\n=== INTENSITY COMPARISON TESTS ===\n');

// Test Ability > Intensity = Green
test('Remarkable vs Typical = Green',
  getRequiredColor('typical', 'remarkable'),
  'green'
);

test('Excellent vs Good = Green',
  getRequiredColor('good', 'excellent'),
  'green'
);

test('Amazing vs Good = Green (multiple ranks higher)',
  getRequiredColor('good', 'amazing'),
  'green'
);

// Test Ability = Intensity = Yellow
test('Good vs Good = Yellow',
  getRequiredColor('good', 'good'),
  'yellow'
);

test('Remarkable vs Remarkable = Yellow',
  getRequiredColor('remarkable', 'remarkable'),
  'yellow'
);

test('Shift0 vs Shift0 = Yellow',
  getRequiredColor('shift0', 'shift0'),
  'yellow'
);

// Test Ability 1 rank below = Red
test('Good vs Typical = Red',
  getRequiredColor('good', 'typical'),
  'red'
);

test('Remarkable vs Excellent = Red',
  getRequiredColor('remarkable', 'excellent'),
  'red'
);

// Test Ability 2+ ranks below = Impossible
test('Good vs Poor = Impossible',
  getRequiredColor('good', 'poor'),
  'impossible'
);

test('Remarkable vs Good = Impossible',
  getRequiredColor('remarkable', 'good'),
  'impossible'
);

test('Amazing vs Typical = Impossible',
  getRequiredColor('amazing', 'typical'),
  'impossible'
);

// ============================================================
// Color Requirement Tests
// ============================================================

console.log('\n=== COLOR REQUIREMENT TESTS ===\n');

// Test white meets nothing (except when nothing required, but we don't have that case)
test('White meets Green = false',
  meetsColorRequirement('white', 'green'),
  false
);

test('White meets Yellow = false',
  meetsColorRequirement('white', 'yellow'),
  false
);

test('White meets Red = false',
  meetsColorRequirement('white', 'red'),
  false
);

// Test green meets green but not yellow/red
test('Green meets Green = true',
  meetsColorRequirement('green', 'green'),
  true
);

test('Green meets Yellow = false',
  meetsColorRequirement('green', 'yellow'),
  false
);

test('Green meets Red = false',
  meetsColorRequirement('green', 'red'),
  false
);

// Test yellow meets green and yellow but not red
test('Yellow meets Green = true',
  meetsColorRequirement('yellow', 'green'),
  true
);

test('Yellow meets Yellow = true',
  meetsColorRequirement('yellow', 'yellow'),
  true
);

test('Yellow meets Red = false',
  meetsColorRequirement('yellow', 'red'),
  false
);

// Test red meets everything
test('Red meets Green = true',
  meetsColorRequirement('red', 'green'),
  true
);

test('Red meets Yellow = true',
  meetsColorRequirement('red', 'yellow'),
  true
);

test('Red meets Red = true',
  meetsColorRequirement('red', 'red'),
  true
);

// Test impossible is never met
test('White meets Impossible = false',
  meetsColorRequirement('white', 'impossible'),
  false
);

test('Red meets Impossible = false',
  meetsColorRequirement('red', 'impossible'),
  false
);

// ============================================================
// Action Result Tests
// ============================================================

console.log('\n=== ACTION RESULT TESTS ===\n');

// Test Blunt Attacks results
test('Blunt White = miss',
  getActionResult('bluntAttacks', 'white').resultKey,
  'miss'
);

test('Blunt Green = hit',
  getActionResult('bluntAttacks', 'green').resultKey,
  'hit'
);

test('Blunt Yellow = slam',
  getActionResult('bluntAttacks', 'yellow').resultKey,
  'slam'
);

test('Blunt Red = stun',
  getActionResult('bluntAttacks', 'red').resultKey,
  'stun'
);

// Test Energy results
test('Energy White = miss',
  getActionResult('energy', 'white').resultKey,
  'miss'
);

test('Energy Green = hit',
  getActionResult('energy', 'green').resultKey,
  'hit'
);

test('Energy Yellow = bullseye',
  getActionResult('energy', 'yellow').resultKey,
  'bullseye'
);

test('Energy Red = kill',
  getActionResult('energy', 'red').resultKey,
  'kill'
);

// Test Grappling results (special - green is also miss)
test('Grappling White = miss',
  getActionResult('grappling', 'white').resultKey,
  'miss'
);

test('Grappling Green = miss',
  getActionResult('grappling', 'green').resultKey,
  'miss'
);

test('Grappling Yellow = partial',
  getActionResult('grappling', 'yellow').resultKey,
  'partial'
);

test('Grappling Red = hold',
  getActionResult('grappling', 'red').resultKey,
  'hold'
);

// Test unknown action type
test('Unknown action = null',
  getActionResult('unknownAction', 'green').resultKey,
  null
);

// Test localization keys are returned
test('Blunt Yellow localizedKey = FASERIP.ActionResult.Slam',
  getActionResult('bluntAttacks', 'yellow').localizedKey,
  'FASERIP.ActionResult.Slam'
);

test('Energy Yellow localizedKey = FASERIP.ActionResult.Bullseye',
  getActionResult('energy', 'yellow').localizedKey,
  'FASERIP.ActionResult.Bullseye'
);

// ============================================================
// Integration Tests - Full FEAT Flow
// ============================================================

console.log('\n=== INTEGRATION TESTS ===\n');

// Test scenario: Good Fighting, Typical Intensity, no shift
// Expected: Green required (Good > Typical)
{
  const ability = 'good';
  const intensity = 'typical';
  const shift = 0;

  const shiftResult = applyColumnShiftWithLimits(ability, shift);
  const requiredColor = getRequiredColor(intensity, shiftResult.effectiveRank);

  test('Good vs Typical, no shift: effectiveRank = good',
    shiftResult.effectiveRank,
    'good'
  );

  test('Good vs Typical, no shift: required = green',
    requiredColor,
    'green'
  );
}

// Test scenario: Good Fighting, Remarkable Intensity, no shift
// Expected: Red required (Good is 2 ranks below Remarkable)
{
  const ability = 'good';
  const intensity = 'remarkable';
  const shift = 0;

  const shiftResult = applyColumnShiftWithLimits(ability, shift);
  const requiredColor = getRequiredColor(intensity, shiftResult.effectiveRank);

  test('Good vs Remarkable, no shift: required = impossible',
    requiredColor,
    'impossible'
  );
}

// Test scenario: Good Fighting, Remarkable Intensity, +2 CS
// Now effective rank = Remarkable, so Yellow required
{
  const ability = 'good';
  const intensity = 'remarkable';
  const shift = 2;

  const shiftResult = applyColumnShiftWithLimits(ability, shift);
  const requiredColor = getRequiredColor(intensity, shiftResult.effectiveRank);

  test('Good +2 CS vs Remarkable: effectiveRank = remarkable',
    shiftResult.effectiveRank,
    'remarkable'
  );

  test('Good +2 CS vs Remarkable: required = yellow',
    requiredColor,
    'yellow'
  );
}

// Test scenario: Typical Strength, Good Intensity, -2 CS
// Typical is index 3, -2 = index 1 = Feeble (4 below Good), so Impossible
{
  const ability = 'typical';
  const intensity = 'good';
  const shift = -2;

  const shiftResult = applyColumnShiftWithLimits(ability, shift);
  const requiredColor = getRequiredColor(intensity, shiftResult.effectiveRank);

  test('Typical -2 CS: effectiveRank = feeble',
    shiftResult.effectiveRank,
    'feeble'
  );

  test('Feeble vs Good: required = impossible',
    requiredColor,
    'impossible'
  );
}

// Test scenario: Class1000 with shift attempted
{
  const ability = 'class1000';
  const intensity = 'class1000';
  const shift = 3;

  const shiftResult = applyColumnShiftWithLimits(ability, shift);
  const requiredColor = getRequiredColor(intensity, shiftResult.effectiveRank);

  test('Class1000 +3 CS: effectiveRank = class1000 (no shift)',
    shiftResult.effectiveRank,
    'class1000'
  );

  test('Class1000 vs Class1000: required = yellow',
    requiredColor,
    'yellow'
  );
}

// ============================================================
// Results Summary
// ============================================================

console.log('\n========================================');
console.log('           TEST RESULTS');
console.log('========================================\n');

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failures.length > 0) {
  console.log('\n--- FAILURES ---\n');
  for (const f of failures) {
    console.log(`FAIL: ${f.description}`);
    console.log(`  Expected: ${JSON.stringify(f.expected)}`);
    console.log(`  Actual:   ${JSON.stringify(f.actual)}`);
  }
}

console.log('\n========================================');
if (failedTests === 0) {
  console.log('        ALL TESTS PASSED!');
} else {
  console.log(`        ${failedTests} TEST(S) FAILED`);
}
console.log('========================================\n');

// Exit with appropriate code
process.exit(failedTests > 0 ? 1 : 0);
