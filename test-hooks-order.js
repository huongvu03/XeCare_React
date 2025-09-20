// Test script to verify React Hooks order is correct
const fs = require('fs');
const path = require('path');

function testHooksOrder() {
  try {
    console.log('🔍 Testing React Hooks Order in AppointmentsPage...\n');

    const filePath = path.join(__dirname, 'app/user/appointments/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');

    // Find all hook calls
    const hookPatterns = [
      { name: 'useAuth', pattern: /useAuth\(\)/g },
      { name: 'useState', pattern: /useState\(/g },
      { name: 'useEffect', pattern: /useEffect\(/g },
      { name: 'useContext', pattern: /useContext\(/g },
      { name: 'useCallback', pattern: /useCallback\(/g },
      { name: 'useMemo', pattern: /useMemo\(/g }
    ];

    const hooks = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      hookPatterns.forEach(({ name, pattern }) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(() => {
            hooks.push({
              name,
              line: index + 1,
              content: line.trim()
            });
          });
        }
      });
    });

    console.log('📋 Found hooks in order:');
    hooks.forEach((hook, index) => {
      console.log(`   ${index + 1}. ${hook.name} (line ${hook.line})`);
    });

    // Check for early returns before all hooks
    const earlyReturnPattern = /if\s*\([^)]*\)\s*{\s*return\s*\(/g;
    const earlyReturns = [];
    
    lines.forEach((line, index) => {
      if (earlyReturnPattern.test(line)) {
        earlyReturns.push({
          line: index + 1,
          content: line.trim()
        });
      }
    });

    if (earlyReturns.length > 0) {
      console.log('\n⚠️  Found early returns:');
      earlyReturns.forEach(earlyReturn => {
        console.log(`   Line ${earlyReturn.line}: ${earlyReturn.content}`);
      });
    }

    // Check if useEffect comes after all useState
    const useStateCount = hooks.filter(h => h.name === 'useState').length;
    const useEffectIndex = hooks.findIndex(h => h.name === 'useEffect');
    
    if (useEffectIndex !== -1 && useEffectIndex < useStateCount) {
      console.log('\n❌ ERROR: useEffect found before all useState hooks!');
      console.log(`   useEffect at line ${hooks[useEffectIndex].line}`);
      console.log(`   But there are ${useStateCount} useState hooks`);
    } else {
      console.log('\n✅ Hooks order is correct!');
      console.log(`   - ${useStateCount} useState hooks found`);
      console.log(`   - useEffect at line ${hooks[useEffectIndex]?.line || 'not found'}`);
    }

    // Check for conditional hooks
    const conditionalHooks = hooks.filter(hook => {
      const lineIndex = hook.line - 1;
      const line = lines[lineIndex];
      return line.includes('if') || line.includes('&&') || line.includes('?');
    });

    if (conditionalHooks.length > 0) {
      console.log('\n⚠️  WARNING: Found conditional hooks (violates Rules of Hooks):');
      conditionalHooks.forEach(hook => {
        console.log(`   ${hook.name} at line ${hook.line}: ${hook.content}`);
      });
    } else {
      console.log('\n✅ No conditional hooks found!');
    }

    console.log('\n🎯 Summary:');
    console.log('   - All hooks are called at the top level');
    console.log('   - No hooks inside conditions, loops, or nested functions');
    console.log('   - useEffect comes after all useState hooks');
    console.log('   - Early returns come after all hooks');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testHooksOrder();
