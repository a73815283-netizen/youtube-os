import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { registerFrontendErrorTracking } from './monitoring/error-tracking';
import './i18n';
import './styles.css';

const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('yo-theme') : null;
document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : 'dark');

const root = document.getElementById('root');
if (!root) throw new Error('Application root element is missing.');
registerFrontendErrorTracking();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
