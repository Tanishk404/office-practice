import React from 'react';

const CallForPapers: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Content */}
      <main className="text-gray-800">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Call for Papers</h1>

        <section className="mb-8">
          <p className="leading-relaxed mb-4">
            We cordially invite <span className="font-bold">faculty, researchers, and scholars</span> to submit your valuable contributions for our upcoming issues. It is a <span className="font-bold">double-blind, peer-reviewed, and Open Access (OA) journal</span> and accepts manuscripts in the form of <span className="font-bold">research papers, review articles, case reports, and short communications.</span>
          </p>

          <h2 className="text-lg font-bold mb-3">Manuscript Submission Guidelines</h2>
          <p className="mb-2">To submit your manuscript:</p>
          <ul className="list-disc pl-5 space-y-1 mb-6">
            <li>First-time users, click the <a href="#" className="text-blue-600 font-semibold hover:underline">Register</a> button on the submission portal.</li>
            <li>If you are already a registered author, <a href="#" className="text-blue-600 font-semibold hover:underline">log in</a> and post your manuscript for the peer-review process.</li>
          </ul>

          <p className="mb-4">
            Manuscripts submitted for consideration and inclusion in upcoming issues must follow the author guidelines at: 
            <a href="https://ijnonline.org/author-instructions" className="text-blue-600 hover:underline ml-1">
              https://ijnonline.org/author-instructions
            </a>
          </p>

          <p className="font-bold mb-6">Submission Deadline: 2026-07-16</p>

          <button className="text-blue-400 border hover:text-blue-600 border-black font-semibold py-2 px-6 rounded shadow-sm mb-6">
            Submit Manuscript
          </button>

          <div className="space-y-1">
            <p>
              <a href="#" className="text-blue-600 hover:underline block">Manuscript Submission Process</a>
            </p>
            <p>
              <a href="#" className="text-blue-600 hover:underline block">Visit for Training and Events Program</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CallForPapers;