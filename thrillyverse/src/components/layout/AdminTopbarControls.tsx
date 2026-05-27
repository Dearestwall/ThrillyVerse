'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

type Props = {
  onToggleSidebar: () => void;
  collapsed: boolean;
  onOpenMobileMenu?: () => void;
};

export function AdminTopbarControls({
  onToggleSidebar,
  collapsed,
  onOpenMobileMenu,
}: Props) {
  const [animating, setAnimating] = useState(false);
  const [mobileAnimating, setMobileAnimating] = useState(false);

  const handleToggle = () => {
    setAnimating(true);
    onToggleSidebar();
    window.setTimeout(() => setAnimating(false), 220);
  };

  const handleOpenMobile = () => {
    setMobileAnimating(true);
    onOpenMobileMenu?.();
    window.setTimeout(() => setMobileAnimating(false), 180);
  };

  return (
    <div className="admin-topbar-controls">
      <div className="admin-topbar-controls__left">
        <button
          className="btn btn-secondary btn-sm admin-nav-toggle md:hidden admin-control-btn"
          type="button"
          aria-label="Open admin menu"
          onClick={handleOpenMobile}
          style={{
            transform: mobileAnimating ? 'translateY(-1px) scale(0.97)' : 'none',
          }}
        >
          <Menu size={18} />
          <span className="admin-control-text">Menu</span>
        </button>

        <button
          className="btn btn-secondary btn-sm hidden md:inline-flex admin-collapse-btn admin-control-btn"
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={handleToggle}
          style={{
            transform: animating ? 'translateY(-1px) scale(0.97)' : 'none',
          }}
        >
          <span className="admin-control-icon">
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </span>
          <span className="admin-control-text">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>

      <div className="admin-topbar-controls__right">
        <ThemeToggle />
      </div>
    </div>
  );
}