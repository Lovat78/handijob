// DEBUG: Force CV link in sidebar
console.log('🔍 DEBUG CV INTELLIGENT - Sidebar candidat');

// Ajout temporaire debug dans Sidebar.tsx
const debugCandidateNav = () => {
  console.log('User role:', user?.role);
  console.log('Navigation items for candidate:', navigationItems.filter(item => 
    !item.role || item.role === 'candidate'
  ));
};

// Vérifier que l'item CV existe
const cvItem = navigationItems.find(item => item.path === '/cv-generator');
console.log('CV Generator item found:', cvItem);

export { debugCandidateNav };