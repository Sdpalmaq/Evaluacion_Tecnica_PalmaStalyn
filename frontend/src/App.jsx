import { useState } from 'react';
import BPartnerList from './components/BPartnerList';
import BPartnerForm from './components/BPartnerForm';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('list');

  const handleFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setActiveTab('list');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Speedy ERP
          </h1>
          <p className="text-lg text-gray-600">
            Sistema de Gestión de Terceros - iDempiere
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Listado
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ➕ Nuevo Tercero
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <main>
          {activeTab === 'list' && (
            <BPartnerList refreshTrigger={refreshTrigger} />
          )}
          
          {activeTab === 'create' && (
            <BPartnerForm onSuccess={handleFormSuccess} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Prueba Técnica - Departamento de Tecnología e Innovación</p>
          <p className="mt-1">© 2026 Speedy</p>
        </footer>
      </div>
    </div>
  );
}

export default App;