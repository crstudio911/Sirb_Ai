// سيرفرات الموقع بالترتيب: الأول هو الأساسي، واللي بعده احتياطي.
// كل السيرفرات لازم يكون فيها نفس الـ worker.js ونفس المتغيرات (SHET_URL و SECRIT و ALLOW ...).
window.SIRB_CONFIG = Object.freeze({
  // false = زائر الموقع ميشوفش أي رسائل مطورين في الكونسول. خليها true وقت التجربة بس.
  DEBUG: false,
  WORKER_URLS: [
    'https://sirbai-api.mahmoudmomajeed.workers.dev',
    'https://sirbai-api2.7oka12345678910.workers.dev'
  ]
});
