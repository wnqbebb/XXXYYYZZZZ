import React, { useState, useCallback, useRef, KeyboardEvent } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccessibleTabsProps {
  tabs: Tab[];
  /** Label para el tablist */
  ariaLabel?: string;
  /** Tab inicial seleccionado */
  defaultTab?: string;
  /** Callback cuando cambia el tab */
  onChange?: (tabId: string) => void;
}

/**
 * AccessibleTabs - Componente de pestañas completamente accesible
 * 
 * Implementa el patrón ARIA Tabs:
 * - https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * 
 * Navegación:
 * - Flechas izquierda/derecha: Cambiar entre tabs
 * - Home: Primer tab
 * - End: Último tab
 * - Tab: Mover al panel activo
 * 
 * @example
 * <AccessibleTabs
 *   ariaLabel="Configuración de usuario"
 *   tabs={[
 *     { id: 'general', label: 'General', content: <GeneralSettings /> },
 *     { id: 'security', label: 'Seguridad', content: <SecuritySettings /> },
 *   ]}
 * />
 */
export const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
  tabs,
  ariaLabel,
  defaultTab,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      const enabledTabs = tabs.filter((tab) => !tab.disabled);
      const currentEnabledIndex = enabledTabs.findIndex(
        (tab) => tab.id === tabs[currentIndex].id
      );

      let nextIndex = currentEnabledIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = (currentEnabledIndex + 1) % enabledTabs.length;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex =
            (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = enabledTabs.length - 1;
          break;
        default:
          return;
      }

      const nextTab = enabledTabs[nextIndex];
      if (nextTab) {
        handleTabChange(nextTab.id);
        // Enfocar el tab seleccionado
        const tabIndex = tabs.findIndex((t) => t.id === nextTab.id);
        tabRefs.current[tabIndex]?.focus();
      }
    },
    [tabs, handleTabChange]
  );

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="accessible-tabs">
      <div role="tablist" aria-label={ariaLabel} style={{ display: 'flex', borderBottom: '2px solid #ccc' }}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={isDisabled}
              onClick={() => !isDisabled && handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderBottom: isActive ? '3px solid #005fcc' : '3px solid transparent',
                background: 'none',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                fontWeight: isActive ? 'bold' : 'normal',
                color: isActive ? '#005fcc' : 'inherit',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        style={{ padding: '16px' }}
      >
        {activeTabData?.content}
      </div>
    </div>
  );
};

export default AccessibleTabs;
