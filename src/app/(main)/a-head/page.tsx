import React from 'react';

const AheadOfPrint: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Heading */}
      <h1 className="text-xl font-bold text-gray-800 mb-6">Ahead of Print</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-3">
          <ul className="space-y-4">
            <li>
              {/* Added 'break-words' and adjusted width for 2-line effect */}
              <a 
                href="#" 
                className="text-blue-600 hover:underline block leading-snug xl:w-64 break-words"
              >
                When Paroxysms are Not Seizures: Episodic Hyperpnea in Joubert Syndrome
              </a>
              <hr className="mt-4 border-gray-300" />
            </li>
          </ul>
        </aside>

        {/* Content Card */}
        <main className="md:col-span-9">
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-blue-600 font-semibold text-lg mb-2">
              When Paroxysms are Not Seizures: Episodic Hyperpnea in Joubert Syndrome
            </h2>
            
            <p className="text-gray-900 text-sm mb-1">
              <span className="font-bold">Authors:</span> Victor Tiwari, Priya Srivastava, Ritwiz Bihari, Shubham Kumar
            </p>
            
            <p className="text-gray-900 text-sm mb-1">
              <span className="font-bold">DOI:</span> 
              <a href="https://doi.org/10.18231/j.ijn.16657.1781693729" className="text-blue-600 hover:underline ml-1">
                10.18231/j.ijn.16657.1781693729
              </a>
            </p>
            
            <p className="text-gray-900 text-sm mb-4">
              <span className="font-bold">Keywords:</span> Joubert Syndrome, Episodic Hyperpnea, Molar Tooth sign
            </p>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              Joubert syndrome is a rare genetic disorder [1] characterized by hypotonia, progressive ataxia, global developmental delay, oculomotor apraxia, and breathing dysregulation, with the “molar tooth...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AheadOfPrint;