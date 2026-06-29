'use client';

import React, { useState, useEffect, useRef } from 'react';

const sections = [
  { id: 'about-journal', name: 'About Journal' },
  { id: 'aims-and-scope', name: 'Aims and Scope' },
  { id: 'indexing', name: 'Indexing and Abstracting Information' },
  { id: 'journal-ethics', name: 'Journal Ethics' },
  { id: 'open-access', name: 'Open Access (OA) Publication' },
  { id: 'repository-policy', name: 'Repository Policy' },
  { id: 'creative-commons', name: 'Creative Commons Licensing' },
  { id: 'copyright', name: 'Copyright of the published material' },
  { id: 'plagiarism', name: 'Plagiarism' },
  { id: 'ai-guidelines', name: 'AI Guidelines' },
  { id: 'digital-archiving', name: 'Digital Archiving' },
  { id: 'advertising-policy', name: 'Advertising Policy' },
  { id: 'ahead-of-print', name: 'Ahead of Print Policy' },
  { id: 'revenue-sources', name: 'Revenue Sources' },
  { id: 'about-publisher', name: 'About Publisher' },
];

export default function AboutJournalPage() {
  const [activeSection, setActiveSection] = useState('about-journal');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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

        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 border-r border-gray-200 md:sticky md:top-0 md:self-start md:max-h-screen md:overflow-y-auto">
          <nav className="flex flex-col py-4">
            {sections.map(({ id, name }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`text-left py-2.5 px-4 w-full text-sm border-b border-gray-100 last:border-none transition-colors duration-150
                  ${activeSection === id
                    ? 'text-black font-bold border-l-4 border-[#1a3c5e] bg-blue-50 pl-3'
                    : 'text-[#2563eb] hover:text-[#1d4ed8] hover:bg-slate-50 font-medium'
                  }`}
              >
                {name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 md:px-10 space-y-10 text-sm leading-relaxed text-[#1e293b]">

          {/* About Journal */}
          <section id="about-journal" className="scroll-mt-4 space-y-4 text-justify">
            <h1 className="text-2xl font-bold text-black">About Journal</h1>
            <p>
              <strong>IP Indian Journal of Neurosciences (IJN)</strong> is an open access, peer-reviewed medical quarterly journal, published since 2015 under the auspices of the{' '}
              <a href="#" className="text-[#2563eb] hover:underline">Khyati Education and Research Foundation</a>{' '}
              (KERF), which aims to uplift researchers, scholars, academicians, and professionals in all academic and scientific disciplines. KERF is dedicated to the transfer of technology and research by publishing scientific journals, research content, providing professional memberships, and conducting conferences, seminars, and award programs. With the aim of faster and better dissemination of knowledge, we will be publishing articles{' '}
              <strong>'Ahead of Print'</strong> immediately upon acceptance of manuscript. In addition, the journal allows free access (Open Access) to its contents, which is likely to attract more readers and citations to articles published in journal.
            </p>
            <p>
              Manuscripts should be prepared in accordance with the author guidelines of the journal, which follow the recommendations of the International Committee of Medical Journal Editors (ICMJE), last updated in December 2019. Before submitting a manuscript, contributors are requested to check the guidelines, which are available on the{' '}
              <a href="#" className="text-[#2563eb] hover:underline">journal website</a>{' '}
              or directly from the{' '}
              <a href="#" className="text-[#2563eb] hover:underline">manuscript submission</a>{' '}
              website of the <strong>Manuscript Peer-Review Process</strong> (MPRP).
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Aims and Scope */}
          <section id="aims-and-scope" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Aims and Scope</h2>
            <p>
              The primary aim of the <strong>Indian Journal of Neurosciences</strong> is to publish high-quality, peer-reviewed research that advances the understanding of the nervous system in both health and disease. The journal serves as an interdisciplinary platform for researchers and clinicians to share findings from all areas of the neurosciences, from basic neurobiology to clinical neurology and psychiatry.
            </p>
            <p>The journal welcomes original research, reviews, and case reports. The scope is broad, covering the following areas:</p>
            <ul className="list-disc pl-6 space-y-2 text-left">
              <li><strong>Basic and Developmental Neuroscience:</strong> Neuroanatomy, neurophysiology, neurobiology, neuro-histopathology, genetics, and the development of the central nervous system.</li>
              <li><strong>Clinical Neurosciences:</strong> Neurology, neurosurgery, psychiatry, and onconeurobiology.</li>
              <li><strong>Cognitive and Behavioral Neuroscience:</strong> Studies on memory, sleep disorders, and the neural basis of psychological processes.</li>
              <li><strong>Neuropharmacology and Therapeutics:</strong> Research on neuropharmacology, neuroendocrinology, chemotherapy, and radiotherapy for neurological disorders.</li>
              <li><strong>Diagnostics and Neuroimaging:</strong> Electrophysiology, and all forms of neuroimaging and radiology of the brain.</li>
            </ul>
          </section>

          <hr className="border-gray-200" />

          {/* Indexing */}
          <section id="indexing" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Indexing and Abstracting Information</h2>
            <p>Google Scholar, J-gate, ROAD, CrossRef, Scilit.</p>
          </section>

          <hr className="border-gray-200" />

          {/* Journal Ethics */}
          <section id="journal-ethics" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Journal Ethics</h2>
            <p>
              The journal is committed to upholding the highest standards of ethical behaviour at all stages of the publication process. We strictly adhere to the guidelines of industry associations such as the{' '}
              <a href="https://publicationethics.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">Committee on Publication Ethics (COPE)</a>,{' '}
              <a href="https://www.icmje.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">International Committee of Medical Journal Editors (ICMJE)</a>, and{' '}
              <a href="https://www.wame.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">World Association of Medical Editors (WAME)</a>. These bodies set standards and provide guidelines for best practices, which the journal follows to meet these requirements. To know more about specific policies regarding duplicate publication, conflict of interest, patient consent, etc., please visit the{' '}
              <a href="#" className="text-[#2563eb] hover:underline">author guidelines</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Open Access */}
          <section id="open-access" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Open Access (OA) Publication</h2>
            <p>
              The journal encourages open access publishing, which refers to free, unrestricted online access to research outputs such as journal articles. OA content is open to all without access fees or subscription charges. Articles are freely available immediately after publication without any registration. This means that researchers, readers, scholars, and any layperson from anywhere and at any time have rapid access to the latest research content via the journal's Open Access (OA) Policy:{' '}
              <a href="https://www.ipinnovative.com/open-access-journals" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">www.ipinnovative.com/open-access-journals</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Repository Policy */}
          <section id="repository-policy" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Repository Policy</h2>
            <p>
              Authors can deposit their published article in any repository. After publication of the article in the journal, authors are allowed and encouraged to submit their content online (for example, in institutional repositories or on their website). This can result in fruitful discussion about earlier and more frequent citation of published work, which can help promote the accessibility and reproducibility of research findings for others.
            </p>
            <p>
              If the data have been deposited in a public repository and/or are being used in a secondary analysis, authors should state at the end of the abstract the unique, persistent data set identifier, repository name and number:{' '}
              <a href="https://www.icmje.org/recommendations/browse/manuscript-preparation/preparing-for-submission.html" className="text-[#2563eb] hover:underline text-xs break-all" target="_blank" rel="noreferrer">
                https://www.icmje.org/recommendations/browse/manuscript-preparation/preparing-for-submission.html
              </a>
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Creative Commons */}
          <section id="creative-commons" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Creative Commons Licensing</h2>
            <p>
              The Journal is Open Access (OA) and articles are distributed under the terms of the{' '}
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 License (CC BY-NC-SA 4.0)</a>. This license permits non-commercial to remix, adapt, and build upon the work, as long as appropriate credit is given and any new creations are licensed under identical terms. This framework ensures broad dissemination and reuse while protecting the author's copyright and ensuring they are properly credited for their work.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Copyright */}
          <section id="copyright" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Copyright of the published material</h2>
            <p>
              The journal takes a signed copy of the consent declaration form from authors, where they sign and accept responsibility for releasing this material to the publisher on behalf of all co-authors. However, the author retains the copyright of the content while transferring licensing and publishing rights to the publisher. The author grants the publisher the sole right to commercially utilize the article. For the duration of the copyright's full legal term, they provide the publisher an exclusive right and license to publish. This transfer of publication rights covers the non-exclusive right to reproduce and distribute the article, including reprints, translations, photographic reproductions, microform, electronic form (offline, online), or any other reproduction of a similar nature.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Plagiarism */}
          <section id="plagiarism" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Plagiarism</h2>
            <p>
              The journal considers plagiarism a serious breach of publication ethics. Plagiarism is defined as the act of presenting another's work, ideas, or words as one's own without proper attribution.
            </p>
            <p>
              The journal also strictly prohibits self-plagiarism, which is the redundant reuse of significant portions of an author's own previously published work without appropriate citation. An example of self-plagiarism is submitting a new manuscript that borrows text from the author's prior publications without acknowledging the original source.
            </p>
            <p>
              To ensure academic integrity, all submitted manuscripts are screened for originality using{' '}
              <a href="https://www.ithenticate.com/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">iThenticate</a>{' '}
              plagiarism detection software, which is provided to our editors and reviewers.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* AI Guidelines */}
          <section id="ai-guidelines" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">AI Guidelines</h2>
            <p>
              In research and learning, human judgement is essential to validate conclusions, address bias, and ensure ethical standards. Feedback from users is key, ensuring AI enhances human creativity and intellect, rather than replacing it.
            </p>
            <p>
              These AI guidelines are designed to guide authors in addressing the ethical and technical aspects of AI usage. For more details, please refer to our full policy page, for{' '}
              <a href="#" className="text-[#2563eb] hover:underline">more...</a>
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Digital Archiving */}
          <section id="digital-archiving" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Digital Archiving</h2>
            <p>
              Digital archiving ensures the preservation and accessibility of digital content over time, safeguarding it from technological changes and data loss. We prioritize the longevity and integrity of our journal by utilizing leading digital archiving services{' '}
              <a href="https://www.portico.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">Portico</a>{' '}
              and{' '}
              <a href="https://clockss.org/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">CLOCKSS</a>. Articles in our journal are securely preserved and remain accessible to researchers, educators, and the public today and in the future.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Advertising Policy */}
          <section id="advertising-policy" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Advertising Policy</h2>
            <p>The journal has the discretion to decline any advertisement that does not meet the <strong>journal's advertising policy</strong>:</p>
            <ol className="list-decimal pl-6 space-y-2 text-left">
              <li>Advertisements will not be accepted if they are indecent, offensive, or discriminatory based on personal, racial, ethnic, sexual orientation, or religious grounds, whether in text or artwork.</li>
              <li>The Journal will not accept advertisements for products or services known to be harmful to health, such as tobacco and alcohol.</li>
              <li>Product advertorials will not allow any treatment-specific or drug-specific campaigns to target specific articles related to the advertised products.</li>
            </ol>
            <p>
              The presence of advertisements or product information on the Journal's website does not mean endorsement or approval by the Journal or its publisher regarding the quality or claims made by the manufacturer of the advertised products. Editorial decisions do not depend on any advertisement visible on the website.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Ahead of Print */}
          <section id="ahead-of-print" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Ahead of Print Policy</h2>
            <p>
              Articles published online under the{' '}
              <a href="#" className="text-[#2563eb] hover:underline">'Ahead of Print'</a>{' '}
              model are considered published and can be cited and quoted using DOI. This policy ensures that important research is available to the scientific community as quickly as possible, without the delay of waiting for a print issue.
            </p>
            <p>
              These articles are officially published and should be cited using their permanent Digital Object Identifier (DOI). Once an article is published "Ahead of Print," it is considered the final <strong>Version of Record</strong>. Therefore, no changes can be made to the content. Any necessary corrections to the scientific record will be made through formal notices, such as an Erratum or Corrigendum, in accordance with publication ethics guidelines.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* Revenue Sources */}
          <section id="revenue-sources" className="scroll-mt-4 space-y-4 text-justify">
            <h2 className="text-xl font-bold text-black">Revenue Sources</h2>
            <p>
              This is a self-financed open access journal, which is published in both online and print versions. Article publication charges levied on authors are the only source of income used to maintain administrative and printing costs. Also, a small portion of revenue comes from advertisements and subscriptions.
            </p>
            <p>
              The APC is based on an adjusted scale, providing reduced rates for low- and middle-income countries. Operating expenses, including the cost of web presence, print versions, pre-press preparations, and staff salaries, are supported by the above-mentioned resources. Please{' '}
              <a href="#" className="text-[#2563eb] hover:underline">visit for APC details</a>.
            </p>
          </section>

          <hr className="border-gray-200" />

          {/* About Publisher */}
          <section id="about-publisher" className="scroll-mt-4 space-y-4 text-justify pb-12">
            <h2 className="text-xl font-bold text-black">About Publisher</h2>
            <p>
              IP Innovative Publication Private Limited is a well-established publisher headquartered in New Delhi, India. The publisher specializes in medical, dental, nursing, and pharmacy subjects and has more than 400+ books and 110 journals in its portfolio. Founded in 2011, it has become a well-respected medical publisher in India that fully supports various open-access models through its robust peer-review management system. Researchers, students, doctors, clinicians, and other healthcare professionals access the publisher's journals from around the globe to learn about the latest discoveries and improve patient care. For more information about the publisher,{' '}
              <a href="https://www.ipinnovative.com/" className="text-[#2563eb] hover:underline" target="_blank" rel="noreferrer">click here</a>.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}