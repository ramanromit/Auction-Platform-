import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PillNav.css';

export default function PillNav({
  logo,
  logoAlt,
  items = [],
  activeHref = '/',
  className = '',
  ease = 'power2.easeOut',
  baseColor = '#000000',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor = '#000000',
  theme = 'light',
  initialLoadAnimation = false
}) {
  const [activeItem, setActiveItem] = useState(activeHref);

  return (
    <nav className={`pill-nav ${className}`} style={{ '--base-color': baseColor, '--pill-color': pillColor }}>
      {logo && (
        <div className="pill-nav-logo">
          <img src={logo} alt={logoAlt || 'Logo'} />
        </div>
      )}

      <div className="pill-nav-items">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`pill-nav-item ${activeItem === item.href ? 'active' : ''}`}
            onClick={() => setActiveItem(item.href)}
            style={{
              color: activeItem === item.href ? hoveredPillTextColor : pillTextColor
            }}
          >
            <span className="pill-nav-label">{item.label}</span>
          </Link>
        ))}
        <div className="pill-nav-indicator" />
      </div>
    </nav>
  );
}
