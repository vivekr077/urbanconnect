import React from 'react';
import Link from 'next/link';
import Container from '../common/Container';
import { siteConfig } from '../../config/site';

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-12 transition-all duration-300 mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <span className="font-bold text-slate-900 dark:text-white">
              Urban<span className="text-emerald-500">Connect</span>
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} UrbanConnect. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link href="/about" className="hover:text-emerald-500 transition-colors">About</Link>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
              GitHub
            </a>
            <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
export default Footer;
