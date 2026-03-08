import React, { useState } from 'react';
import { Coffee, ClipboardList, BookOpen, Building2, Menu, X } from 'lucide-react';
import DailyGreeting from './components/DailyGreeting';
import ServiceReport from './components/ServiceReport';
import KnowledgeBase from './components/KnowledgeBase';
import { cn } from './utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'greeting' | 'report' | 'knowledge';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('greeting');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'greeting', label: '每日温情问候', icon: Coffee, component: DailyGreeting },
    { id: 'report', label: '服务动态汇报', icon: ClipboardList, component: ServiceReport },
    { id: 'knowledge', label: '通告与知识查询', icon: BookOpen, component: KnowledgeBase },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || DailyGreeting;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-100 border border-slate-100">
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZWE1ZTk7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y5NzMxNjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxwYXRoIGQ9Ik0xMCA0MCBMNTAgMTAgTDkwIDQwIEw5MCA5MCBMMTAgOTAgWiIgZmlsbD0idXJsKCNncmFkKSIgLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjQ1IiByPSIxMCIgZmlsbD0id2hpdGUiIC8+CiAgPHJlY3QgeD0iNDUiIHk9IjU1IiB3aWR0aD0iMTAiIGhlaWdodD0iMjUiIGZpbGw9IndoaXRlIiAvPgogIDxyZWN0IHg9IjU1IiB5PSI2NSIgd2lkdG09IjgiIGhlaWdodD0iNCIgZmlsbD0id2hpdGUiIC8+CiAgPHJlY3QgeD0iNTUiIHk9IjczIiB3aWR0aD0iOCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+" 
                    alt="Logo" 
                    className="w-full h-full object-cover p-1"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  小钥匙客服助手
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "border-primary text-slate-900"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    )}
                  >
                    <tab.icon className={cn("w-4 h-4 mr-2", activeTab === tab.id ? "text-primary" : "text-slate-400")} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center w-full pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-emerald-50 border-primary text-primary"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                    )}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} 物业客服助手 · 提升服务价值，温暖社区生活
          </p>
        </div>
      </footer>
    </div>
  );
}
