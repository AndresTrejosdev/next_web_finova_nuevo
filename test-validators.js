// Test simple de los validadores
const { validateEnvironment, parseFechaSafe, sanitizeAmount, validateEmail } = require('./src/lib/validators.ts');

console.log('🧪 Testing validators...');

// Test parseFechaSafe
console.log('📅 parseFechaSafe:');
console.log('  "2024-01-01":', parseFechaSafe('2024-01-01'));
console.log('  "01/01/2024":', parseFechaSafe('01/01/2024'));
console.log('  invalid:', parseFechaSafe('invalid-date'));

// Test sanitizeAmount
console.log('\n💰 sanitizeAmount:');
console.log('  1000:', sanitizeAmount(1000));
console.log('  -500:', sanitizeAmount(-500));
console.log('  "1000.50":', sanitizeAmount("1000.50"));
console.log('  null:', sanitizeAmount(null));

// Test validateEmail
console.log('\n📧 validateEmail:');
console.log('  "test@example.com":', validateEmail('test@example.com'));
console.log('  "invalid-email":', validateEmail('invalid-email'));
console.log('  "":', validateEmail(''));

console.log('\n✅ Tests completados');