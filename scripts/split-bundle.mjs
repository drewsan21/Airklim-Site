// One-shot refactor: extract static data out of App.tsx and convert
// below-the-fold / route-only components to React.lazy dynamic imports.
import fs from 'node:fs';

const app = fs.readFileSync('src/App.tsx', 'utf8');
const lines = app.split('\n');

const find = (pred, start = 0) => {
  for (let i = start; i < lines.length; i++) if (pred(lines[i])) return i;
  throw new Error('marker not found');
};
const arrEnd = (start) => {
  let i = start;
  while (lines[i].trim() !== '];') i++;
  return i;
};

const imgStart = find((l) => l.startsWith('// ===== LIFESTYLE IMAGES'));
const typesStart = find((l) => l.startsWith('// ===== TYPES'));
const pStart = find((l) => l.startsWith('const panasonicProducts'));
const tStart = find((l) => l.startsWith('const tclProducts'));
const hStart = find((l) => l.startsWith('const heaterProducts'));
const cStart = find((l) => l.startsWith('const commercialProducts'));
const svgMarker = find((l) => l.startsWith('// ===== SVG COMPONENT'));

// ---------- src/data/productImages.ts ----------
const imageBlock = lines.slice(imgStart, typesStart).join('\n').trim();
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync(
  'src/data/productImages.ts',
  imageBlock.replace(/^const /gm, 'export const ') + '\n'
);

// ---------- src/data/homeProducts.ts ----------
const blocks = [
  [pStart - 1, arrEnd(pStart), 'panasonicProducts'],
  [tStart - 1, arrEnd(tStart), 'tclProducts'],
  [hStart, arrEnd(hStart), 'heaterProducts'],
  [cStart, arrEnd(cStart), 'commercialProducts'],
]
  .map(([s, e, name]) =>
    lines.slice(s, e + 1).join('\n').replace(`const ${name}`, `export const ${name}`)
  )
  .join('\n');

fs.writeFileSync(
  'src/data/homeProducts.ts',
  `// Home landing product catalog (extracted from App.tsx for code-splitting)
import {
  panasonicEthereaGrafiteImg,
  panasonicEthereaBiancoImg,
  panasonicTZImg,
  panasonicConsoleImg,
  panasonicOutdoorImg,
  panasonicRemoteImg,
  tclBreezeInImg,
  panasonicDuctedImg,
  panasonicMultiSplitImg,
  panasonicProfessionalImg,
  aquareaImg,
  ecoiVrfImg,
} from './productImages';

// ===== TYPES =====
export interface Product {
  name: string;
  power: string;
  series: string;
  stock: number;
  brand: string;
  variant: 'indoor' | 'outdoor';
  desc: string;
  features: string[];
  price?: string;
  image?: string;
  category: string;
}

${blocks}
`
);

// ---------- rewrite App.tsx ----------
const lazyDefs = (names, mod, named = true) =>
  names
    .map((n) =>
      named
        ? `const ${n} = lazy(() => import('${mod}').then(m => ({ default: m.${n} })));`
        : `const ${n} = lazy(() => import('${mod}'));`
    )
    .join('\n');

const newImports = `import { useState, useEffect, useCallback, lazy, Suspense, type ComponentType, type FormEvent, type ReactNode } from 'react';
import {
  ContoTermicoCalculator,
  BTUCalculator,
  ProductComparison,
  WhatsAppButton,
  EnergySavingsSimulator,
  PromotionsSection,
  KnowledgeBase,
  FinancingCalculator,
  OrderTracking,
  InstallerMap
} from './Features';
import { useAuth, useCart } from './hooks';
import { LanguageProvider, LanguageSwitcher } from './LanguageContext';
import { useWebVitals, preloadCriticalResources } from './Performance';
import { securityMiddleware } from './security';
import { useAdminAuth } from './management/hooks/useAdminAuth';
import { useGA4, useFacebookPixel, useGTM, useRemarketing, ReferralSystem, GamificationWidget } from './MarketingAdvanced';
import { useSchemaMarkup } from './SEOAdvanced';
import { TranslationProvider, LanguageCurrencySelector, InternationalShipping } from './International';
import {
  Product,
  panasonicProducts,
  tclProducts,
  heaterProducts,
  commercialProducts,
} from './data/homeProducts';
import { heroBg, familyHome, happyFamily, modernLiving, bedroomPeace, kidsPlay, panasonicEthereaBiancoImg, tclBreezeInImg, aquareaImg, ecoiVrfImg, residentialLifeImg, commercialLifeImg, proPartnerBadge } from './data/productImages';
import './MobileOptimization.css';

// ===== Code-split: route-only components (loaded on demand) =====
const ManagementLogin = lazy(() => import('./management/ManagementLogin').then(m => ({ default: m.ManagementLogin })));
const ManagementDashboard = lazy(() => import('./management/ManagementDashboard').then(m => ({ default: m.ManagementDashboard })));
const BusinessSignupPage = lazy(() => import('./AuthPages').then(m => ({ default: m.BusinessSignupPage })));
const IndividualSignupPage = lazy(() => import('./AuthPages').then(m => ({ default: m.IndividualSignupPage })));
const LoginPage = lazy(() => import('./AuthPages').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./AuthPages').then(m => ({ default: m.DashboardPage })));
const initializeTestAccounts = () => import('./config/testAccounts').then(m => m.initializeTestAccounts());

// ===== Code-split: below-the-fold sections & deferred UI =====
${lazyDefs(['CookieBanner'], './CookieBanner')}
${lazyDefs(['LegalPages'], './LegalPages')}
${lazyDefs(['BlogSection'], './Blog')}
${lazyDefs(['VideoSection'], './VideoSection')}
${lazyDefs(['TestimonialsSection'], './TestimonialsSection')}
${lazyDefs(['GallerySection'], './GallerySection')}
${lazyDefs(['AuthModal', 'CartSidebar', 'UserDashboard'], './Commerce')}
${lazyDefs(['LeadMagnetSection', 'SmartPopupSystem', 'NewsletterSection', 'SocialSharing'], './Marketing')}
${lazyDefs(['EmailAutomationSystem', 'AnalyticsDashboard'], './Analytics')}
${lazyDefs(['NPSSurvey', 'FeedbackWidget', 'UsabilityTestRecorder'], './UXResearch')}
${lazyDefs(['ErrorBoundary', 'UptimeMonitor', 'ErrorLogViewer'], './ErrorTracking')}
import { useErrorHandler, usePerformanceMonitoring } from './ErrorTracking';
import { useServiceWorker, usePreloadResources, configureCDN } from './PerformanceAdvanced';
${lazyDefs(['WishlistSection', 'ReviewsSection', 'CouponSystem', 'OrderTrackingAdvanced', 'LoyaltyProgram'], './EcommerceAdvanced')}
${lazyDefs(['VirtualShowroom'], './ARVRExperience')}
${lazyDefs(['ERPIntegration', 'AccountingIntegration', 'ShippingIntegration', 'AdvancedAnalytics', 'InventoryManagement', 'CustomerSupportIntegration'], './ThirdPartyIntegrations')}
${lazyDefs(['CompleteProductCatalog'], './CompleteProductCatalog')}

const fallback = <div className="py-12 text-center text-white/30 text-sm">Caricamento…</div>;
const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);
`;

// body of App.tsx from the SVG marker onward, with targeted replacements
let body = lines.slice(svgMarker).join('\n');

body = body.replace('children: React.ReactNode', 'children: ReactNode');
body = body.replace('(e: React.FormEvent)', '(e: FormEvent)');
body = body.replace(
  "import { useState, useEffect, useCallback } from 'react';",
  ''
); // safety

// wrap admin/auth routes in Suspense
body = body.replace(
  `  if (isAdminRoute) {
    if (!admin) {
      return <ManagementLogin onLoginSuccess={() => window.location.hash = '#admin'} />;
    }
    return <ManagementDashboard />;
  }`,
  `  if (isAdminRoute) {
    return (
      <Suspense fallback={fallback}>
        {!admin ? (
          <ManagementLogin onLoginSuccess={() => (window.location.hash = '#admin')} />
        ) : (
          <ManagementDashboard />
        )}
      </Suspense>
    );
  }`
);
body = body.replace(
  `  if (['signup-business', 'signup-individual', 'login', 'dashboard'].includes(authPage)) {
    if (authPage === 'signup-business') return <BusinessSignupPage />;
    if (authPage === 'signup-individual') return <IndividualSignupPage />;
    if (authPage === 'login') return <LoginPage />;
    return <DashboardPage />;
  }`,
  `  if (['signup-business', 'signup-individual', 'login', 'dashboard'].includes(authPage)) {
    const Page = (
      { 'signup-business': BusinessSignupPage, 'signup-individual': IndividualSignupPage, login: LoginPage, dashboard: DashboardPage } as
        Record<string, ComponentType>
    )[authPage];
    return (
      <Suspense fallback={fallback}>
        <Page />
      </Suspense>
    );
  }`
);

// lazy-init test accounts inside the existing effect
body = body.replace(
  `    securityMiddleware.initialize();
    initializeTestAccounts();`,
  `    securityMiddleware.initialize();
    initializeTestAccounts().then((init) => init());`
);

// wrap every JSX usage of a lazily-loaded component in <Lazy>
const lazyNames = [
  'CookieBanner', 'LegalPages', 'BlogSection', 'VideoSection', 'TestimonialsSection',
  'GallerySection', 'AuthModal', 'CartSidebar', 'UserDashboard', 'LeadMagnetSection',
  'SmartPopupSystem', 'NewsletterSection', 'SocialSharing', 'EmailAutomationSystem',
  'AnalyticsDashboard', 'NPSSurvey', 'FeedbackWidget', 'UsabilityTestRecorder',
  'ErrorBoundary', 'UptimeMonitor', 'ErrorLogViewer', 'WishlistSection', 'ReviewsSection',
  'CouponSystem', 'OrderTrackingAdvanced', 'LoyaltyProgram', 'VirtualShowroom',
  'ERPIntegration', 'AccountingIntegration', 'ShippingIntegration', 'AdvancedAnalytics',
  'InventoryManagement', 'CustomerSupportIntegration', 'CompleteProductCatalog',
];

// All lazy usages in App.tsx are single-line self-closing JSX tags.
body = body
  .split('\n')
  .map((line) => {
    const m = line.match(/^(\s*)(<[A-Za-z][\w]*.*\/>)$/);
    if (!m) return line;
    const [, indent, tag] = m;
    const nameMatch = tag.match(/^<([A-Z][\w]*)/);
    if (nameMatch && lazyNames.includes(nameMatch[1])) {
      return `${indent}<Lazy>${tag}</Lazy>`;
    }
    return line;
  })
  .join('\n');

// The admin/auth route replacements above produced multi-line self-closing tags — wrap them too
body = body.replace(
  `          <ManagementLogin onLoginSuccess={() => (window.location.hash = '#admin')} />`,
  `          <Lazy><ManagementLogin onLoginSuccess={() => (window.location.hash = '#admin')} /></Lazy>`
);
body = body.replace(
  `        <Page />`,
  `        <Lazy><Page /></Lazy>`
);

// ErrorBoundary is a paired tag wrapping the whole tree — wrap its children in Suspense
body = body.replace('    <ErrorBoundary>\n', '    <Suspense fallback={fallback}>\n    <ErrorBoundary>\n');
body = body.replace('    </ErrorBoundary>\n', '    </ErrorBoundary>\n    </Suspense>\n');

fs.writeFileSync('src/App.tsx', newImports + '\n' + body);
console.log('split done');
