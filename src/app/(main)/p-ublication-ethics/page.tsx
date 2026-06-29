'use client';

import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'editorial-policies', name: 'Editorial Policies' },
  { id: 'plagiarism', name: 'Plagiarism' },
  { id: 'peer-review', name: 'Peer Review' },
  { id: 'conflicts-of-interest', name: 'Conflicts of Interest' },
  { id: 'retraction-policy', name: 'Retraction Policy' },
  { id: 'in-house-manuscripts', name: 'Journal policy on In-House Manuscript Submissions' },
  { id: 'patient-consent', name: 'Patient Consent Forms' },
  { id: 'ethics-committee', name: 'Ethics Committee Permission' },
  { id: 'publication-ethics-statement', name: 'Publication Ethics and Malpractice Statement' },
  { id: 'authors-responsibilities', name: 'Authors Responsibilities' },
  { id: 'reviewers-responsibilities', name: 'Reviewers Responsibilities' },
  { id: 'publisher-responsibilities', name: 'Publisher Responsibilities' },
  { id: 'penalty', name: 'Penalty' },
];

export default function PublicationEthicsPage() {
  const [activeSection, setActiveSection] = useState('editorial-policies');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-sans antialiased">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 bg-white shadow-sm">

        {/* Left Sidebar */}
        <aside className="w-full md:w-64 shrink-0 border-r border-gray-200 md:sticky md:top-0 md:self-start md:max-h-screen md:overflow-y-auto">
          <div className="py-4">
            <h1 className="text-base font-bold text-black px-4 pb-3 border-b border-gray-200">Publication Ethics</h1>
            <nav className="flex flex-col mt-1">
              {sections.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`text-left py-2.5 px-4 w-full text-[13px] border-b border-gray-100 last:border-none transition-colors duration-150
                    ${activeSection === id
                      ? 'text-[#2563eb] font-semibold border-l-4 border-[#2563eb] bg-blue-50 pl-3'
                      : 'text-[#2563eb] hover:text-[#1d4ed8] hover:bg-slate-50 font-medium'
                    }`}
                >
                  {name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 md:px-10 space-y-8 text-sm leading-relaxed text-[#2d3748]">

          {/* Editorial Policies */}
          <section id="editorial-policies" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Editorial Policies</h2>
            <p>
              <strong>IP Indian Journal of Neurosciences</strong> is committed to upholding the integrity of the scientific record. Our Publication Ethics and Malpractice Statement is based on the Code of Conduct and Best Practice Guidelines for scientific publications, which includes the Recommendations for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals (<strong>ICMJE</strong>) and the Principles of Transparency and Best Practice in Scholarly Publishing (a joint statement by{' '}
              <a href="https://publicationethics.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">COPE</a>,{' '}
              <a href="https://www.wame.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">WAME</a>, and{' '}
              <a href="https://oaspa.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">OASPA</a>). The journal requires its editors to follow the{' '}
              <a href="https://publicationethics.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">Committee on Publication Ethics (COPE)</a>{' '}
              <a href="https://publicationethics.org/guidance/Guidelines" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">"Best Practice Guidelines for Journal Editors."</a>
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Plagiarism */}
          <section id="plagiarism" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Plagiarism</h2>
            <p>
              Plagiarism is the representation of another person's words, ideas, or expressions as one's own original work. It occurs when an author incorporates someone else's ideas or work into their own without giving due credit, with or without the original author's permission. The journal also considers "self-plagiarism" a form of plagiarism. An example of self-plagiarism is when an author borrows from their own previously published work without proper citation in a newly submitted manuscript. We provide{' '}
              <a href="https://www.ithenticate.com/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">iThenticate software</a>{' '}
              to our editors and reviewers as part of our manuscript submission system.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Peer Review */}
          <section id="peer-review" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Peer Review</h2>
            <p>
              The journal relies on a double-blind peer-review process to assess the quality of manuscripts submitted for publication. Independent researchers in relevant fields assess submitted manuscripts for originality, validity, and significance to help editors determine whether a manuscript should be published. The journal follows a double-blind review process, in which the identities of authors and reviewers are concealed from each other throughout the review process. The journal follows the Committee on Publication Ethics (<strong>COPE</strong>) guidelines on the{' '}
              <a href="https://publicationethics.org/guidance/Guidelines" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">Peer Review Process</a>{' '}
              can be found and{' '}
              <a href="https://publicationethics.org/guidance/Guidelines" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">Ethical Guidelines for the reviewer</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Conflicts of Interest */}
          <section id="conflicts-of-interest" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Conflicts of Interest</h2>
            <p>
              The journal requires authors to sign a disclosure form at the time of manuscript submission. Authors are expected to disclose any financial interests or conflicts that could impact the outcome of the study, including employment, consultations, stock ownership, honoraria, patent applications, or expert testimony. Projects funded by industry must include a full declaration of the funder's involvement. If the funder had no role, authors must state the following: "The sponsors had no role in the design, execution, analysis, or writing of this study." If the manuscript is accepted, the Conflict of Interest information will be published with the article. Refer to the COPE guidelines on{' '}
              <a href="https://publicationethics.org/guidance/Guidelines" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">Conflict of Interest/Competing Interests</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Retraction Policy */}
          <section id="retraction-policy" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Retraction Policy</h2>
            <p>
              An article can be considered for retraction, if the integrity of the published work is jeopardized as a result of flaws in the scientific conduct, writing and data interpretation. A study may also be retracted if it violates publication or research ethical guidelines. In such circumstances, the original article is marked as retracted but a PDF version of the published article remains available online, and the retraction statement is mutually linked to the published paper. Journal follows the{' '}
              <a href="https://retractionwatch.com/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">COPE Retraction Guidelines</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* In-House Manuscripts */}
          <section id="in-house-manuscripts" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Journal policy on In-House Manuscript Submissions</h2>
            <p>
              Manuscripts submitted by any member of the journal's editorial board are assigned to an independent editor for oversight. The submitting board member is recused from the review process, and all decisions are made independently. In addition, these manuscripts are reviewed by at least two external reviewers.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Patient Consent Forms */}
          <section id="patient-consent" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Patient Consent Forms</h2>
            <p>
              For all research involving human subjects, informed consent to participate in the study must be obtained from participants (or their legal guardian). This requires informing them of the study's purpose, methods, potential benefits, and risks. Authors must confirm that participants understood this information and voluntarily consented to participate. A statement confirming that informed consent was obtained must be included in the "Materials and Methods" section of the manuscript. The Editors reserve the right to request a copy of the consent forms if necessary.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Ethics Committee Permission */}
          <section id="ethics-committee" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Ethics Committee Permission</h2>
            <p>
              All research involving human subjects must be approved by the authors' Institutional Review Board (IRB) or an equivalent ethics committee. These guidelines may vary by country, and authors must follow their local and national regulations. The IRB approval number and protocol number must be stated in the manuscript.
            </p>
            <p>
              If the study adheres to the ethical principles for medical research involving human subjects outlined in the <strong>World Medical Association (WMA) Declaration of Helsinki</strong>, this must be stated in the "Methods" section. Visit{' '}
              <a href="https://www.wma.net/policies-post/wma-declaration-of-helsinki-ethical-principles-for-medical-research-involving-human-subjects/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">WMA Declaration Policy</a>.
            </p>
            <p>
              Any study involving animals must have the protocol approved by the relevant institutional animal care and use committee. Procedures must follow the ethical standards of the responsible committee on animal experimentation.
            </p>
            <p>We follow the latest Core Practices applicable in publishing scholarly study for editors and journal publisher and institutions as outlined by COPE Core Practices:</p>
            <ul className="list-none pl-2 space-y-1 text-left">
              {[
                { label: 'Allegations of misconduct', href: 'https://publicationethics.org/core-practices' },
                { label: 'Authorship and contributorship', href: 'https://publicationethics.org/core-practices' },
                { label: 'Complaints and appeals', href: 'https://publicationethics.org/core-practices' },
                { label: 'Conflicts of Interest / Competing interests', href: 'https://publicationethics.org/core-practices' },
                { label: 'Data and reproducibility', href: 'https://publicationethics.org/core-practices' },
                { label: 'Ethical oversight', href: 'https://publicationethics.org/core-practices' },
                { label: 'Intellectual property', href: 'https://publicationethics.org/core-practices' },
                { label: 'Journal management', href: 'https://publicationethics.org/core-practices' },
                { label: 'Peer review processes', href: 'https://publicationethics.org/core-practices' },
                { label: 'Post-publication discussions and corrections', href: 'https://publicationethics.org/core-practices' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">• {label}</a>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-gray-200" />

          {/* Publication Ethics and Malpractice Statement */}
          <section id="publication-ethics-statement" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Publication Ethics and Malpractice Statement</h2>
            <p className="font-semibold text-black">Editor Responsibilities</p>
            <ul className="list-none space-y-2 text-left">
              <li>
                <strong>Publication Decisions:</strong> Editors are responsible for deciding which manuscripts to accept, reject, or request modifications for, based on peer-review reports and the manuscript's fit with the journal's scope. They are committed to the timely publication of corrections, clarifications, and retractions to maintain the integrity of the academic record.
              </li>
              <li>
                <strong>Fair Review:</strong> Editors must ensure that manuscripts are evaluated for their intellectual content without regard to the author's race, gender, sexual orientation, religious belief, ethnic origin, citizenship, or political philosophy.
              </li>
              <li>
                <strong>Confidentiality:</strong> The editor and editorial staff must keep all information regarding submitted manuscripts confidential.
              </li>
              <li>
                <strong>Disclosure of Conflicts of Interest:</strong> Editors and editorial board members must not use unpublished material from a submitted manuscript for their own research without the author's explicit written consent.
              </li>
              <li>
                <strong>Editorial Integrity and Decision-Making:</strong> Editors will take all reasonable steps to ensure the quality of the material they publish, recognizing that different sections of the journal may have different standards. They are responsible for ensuring that author guidelines are kept up-to-date and are clear and comprehensive. Editors will not reverse a decision to accept a manuscript for publication unless serious problems, such as data fabrication or plagiarism, are subsequently identified.
              </li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          {/* Authors Responsibilities */}
          <section id="authors-responsibilities" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Authors Responsibilities</h2>
            <ul className="list-none space-y-2 text-left">
              <li>
                <strong>Originality and Reporting Standards:</strong> Authors must present an accurate account of the work performed and ensure their work is entirely original. All data must be real and authentic.
              </li>
              <li>
                <strong>Previous Publication:</strong> Authors must certify that the manuscript has not been previously published and is not under consideration by another journal. Submitting the same manuscript to multiple journals concurrently is unethical.
              </li>
              <li>
                <strong>Authorship:</strong> All individuals who have made a significant contribution should be listed as co-authors. The submitting author must ensure all co-authors have approved the final version of the manuscript.
              </li>
              <li>
                <strong>Conflicts of Interest:</strong> Authors must disclose any potential conflicts of interest that could be construed as influencing the manuscript.
              </li>
              <li>
                <strong>Errors in Published Works:</strong> If authors discover a significant error in their published work, they are obligated to promptly notify the journal editor and cooperate to retract or correct the paper.
              </li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          {/* Reviewers Responsibilities */}
          <section id="reviewers-responsibilities" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Reviewers Responsibilities</h2>
            <ul className="list-none space-y-2 text-left">
              <li>
                <strong>Confidentiality:</strong> Manuscripts received for review are confidential documents and must not be shared or discussed with others.
              </li>
              <li>
                <strong>Objectivity:</strong> Reviews must be conducted objectively. Personal criticism of the author is inappropriate.
              </li>
              <li>
                <strong>Conflicts of Interest:</strong> Reviewers must decline to review manuscripts in which they have conflicts of interest resulting from competitive, collaborative, or other relationships with any of the authors or institutions.
              </li>
              <li>
                <strong>Promptness:</strong> If a reviewer feels unable to complete the review within the stipulated time, they should notify the editor promptly and withdraw from the process.
              </li>
              <li>
                <strong>Acknowledgement of Sources:</strong> Reviewers should identify relevant published work that has not been cited by the authors and bring any substantial similarity between the manuscript and other published content to the editor's attention.
              </li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          {/* Publisher Responsibilities */}
          <section id="publisher-responsibilities" className="scroll-mt-4 space-y-3 text-justify">
            <h2 className="text-base font-bold text-black">Publisher Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2 text-left">
              <li>The publisher is committed to supporting the editors in upholding the COPE Code of Conduct, ensuring the autonomy of editorial decisions, and protecting intellectual property.</li>
              <li>We are dedicated to maintaining the integrity of the academic record and ensuring that business needs do not compromise intellectual and ethical standards.</li>
              <li>
                The publisher ensures the permanent availability and preservation of scholarly research through digital archiving. For details on innovative archiving policy, Please click here:{' '}
                <a href="https://ipinnovative.com/guidelines/publisher/digital-archiving" className="text-[#2563eb] hover:underline text-xs break-all" target="_blank" rel="noreferrer">
                  https://ipinnovative.com/guidelines/publisher/digital-archiving
                </a>
              </li>
            </ul>
            <p>
              All research manuscripts and other submission types are subject to thorough peer review, usually by at least two external peer reviewers. After an initial screening for suitability by the journal's editors, an editor will invite appropriate independent reviewers with relevant expertise. The editorial decision is based on the reviewer reports, which are made available to the authors along with the decision. For submissions where a journal editor is an author, the editor is recused from the entire peer-review process to ensure impartiality. Further information about the journal's specific peer-review model is available on the journal's information pages.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Penalty */}
          <section id="penalty" className="scroll-mt-4 space-y-3 text-justify pb-12">
            <h2 className="text-base font-bold text-black">Penalty</h2>
            <p>
              <strong>Duplicate Submission:</strong> If a manuscript is found to be under consideration at another journal simultaneously, the review process will be terminated. The authors, reviewers, and editorial board will be notified. All authors will be prohibited from submitting to the journal for a period of three years.
            </p>
            <p>
              <strong>Duplicate Publication:</strong> If a published article is found to be a duplicate of a publication in another journal, it will be investigated. If confirmed, the article will be retracted, and the editors of both journals and the authors' institutions will be notified.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}