import React from 'react';
import ImageEditor from './components/ImageEditor';
import '@fontsource/noto-sans-devanagari/400.css';
import '@fontsource/noto-sans-devanagari/700.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 font-devanagari">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/navsrijan-logo.png" alt="Navsrijan" className="h-8 w-auto" />
            <h1 className="text-xl font-semibold text-gray-900">कोट मेकर</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ImageEditor />
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            अपनी तस्वीरों के साथ सुंदर कोट्स बनाएं
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;