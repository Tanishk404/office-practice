// app/author-instructions/page.tsx
import Link from "next/link";

const TOC = [
  "Overview",
  "Submission Checklist",
  "Manuscript Submission Guidelines",
  "Original Research Article",
  "Review Article",
  "Case Report/Case Series",
  "Letter-to-Editor",
  "Manuscript Formatting",
  "Preparation of Figure, Table, and Artworks",
  "Author Ethical Responsibilities",
  "Supplementary Materials, Data submission",
  "Unpublished and Research Data Policy",
  "Research and Publication Ethics",
  "References Guide",
  "Clinical Trial Registry",
  "Publication Ethics Statement",
  "Plagiarism",
  "Reviewer Suggestions",
  "English Language Corrections",
  "Authorship",
  "Author Appeals",
  "Print copy",
  "Editorial Process and Peer-Review",
  "Author Support",
  "Personal Assistance",
];

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-24 text-[22px] font-semibold text-[#1f2937] mt-10 mb-4 pb-2 border-b border-[#e5e7eb]">
    {children}
  </h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[17px] font-semibold text-[#1f2937] mt-6 mb-2">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-7 text-[#333] mb-4">{children}</p>
);
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 text-[15px] leading-7 text-[#333] mb-4 space-y-1">{children}</ul>
);
const OL = ({ children }: { children: React.ReactNode }) => (
  <ol className="list-decimal pl-6 text-[15px] leading-7 text-[#333] mb-4 space-y-1">{children}</ol>
);
const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline break-words">
    {children}
  </a>
);

export default function AuthorInstructionsPage() {
  return (
    <div className="bg-[#f6f8fb] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-6 self-start bg-white rounded-md border border-[#e5e7eb] shadow-sm">
          <div className="px-4 py-3 border-b border-[#e5e7eb]">
            <h2 className="text-[20px] font-semibold text-[#1f2937]">Author Instructions</h2>
          </div>
          <nav className="divide-y divide-[#eceff3]">
            {TOC.map((label, i) => (
              <Link
                key={i}
                href={`#heading-${i}`}
                className="block px-4 py-2 text-[17.5px] text-blue-500 hover:bg-[#f8fafc] hover:text-[#3b82f6]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="bg-white rounded-md border border-[#e5e7eb] shadow-sm p-6 md:p-8">
       
          <H2 id="heading-0">Overview</H2>
          <P>
            All submitted manuscripts are managed by the Manuscript Peer-Review Process, i.e.,{" "}
            <A href="https://www.mprp.in/">MPRP</A>, as a smooth and rigorous double-blind peer-review manuscript
            handling and editorial process. On this single platform, all authors, reviewers, editors, and the
            editorial office work.
          </P>

          <H2 id="heading-1">Submission Checklist</H2>
          <P>A manuscript submission checklist is essential for finalizing an article before sending it to the journal for review.</P>
          <UL>
            <li>One of the author should be designated as the Corresponding author, providing their contact details.</li>
            <li>The author must check the <A href="https://ijnonline.org/about#heading-0">Aims and Scope</A> of the journal.</li>
            <li>The manuscript will be prepared using the MS Word template.</li>
            <li>An author must adhere to various guidelines such as Authorship Criteria, Research and Publication Ethics as per COPE and ICMJE Criteria, Manuscript Preparation, Copyright Format, Illustrations, Data, Reference Format, etc.</li>
            <li>The author must approve the content of the submitted manuscript.</li>
            <li>All necessary files must have been uploaded with Keywords, figures, and tables (including title, description, and footnotes).</li>
            <li>The manuscript should have been spell- and grammar-checked.</li>
            <li>The author must have obtained permission for any copyrighted material.</li>
            <li>For any manuscript involving studies with human participants, it is the author&apos;s responsibility to confirm that ethical approval has been obtained from the relevant committee (e.g., Institutional Review Board, Research Ethics Board) for conducting the research.</li>
          </UL>

          <H2 id="heading-2">Manuscript Submission Guidelines</H2>
          <H3>Manuscript Submission Process</H3>
          <P>
            Manuscripts must be submitted online at <A href="https://www.mprp.in/">www.mprp.in</A>. The submitting
            author is responsible for the manuscript during submission and peer review, ensuring all eligible
            co-authors are listed, have acknowledged authorship criteria, and have approved the submitted version.
            First-time users must <A href="https://www.mprp.in/user-registration">register</A> on the portal and
            complete email verification to log in as an author. Existing users can log in using their credentials,
            or via Google or ORCID ID.
          </P>
          <P>
            Upon successful registration, authors should <A href="https://mprp.in/user-login">login</A> and submit
            their manuscript. The submission process requires the author to provide details regarding funding
            information, ensuring compliance with all funder stipulations.
          </P>

          <H3>Manuscript Preparation</H3>
          <OL>
            <li><b>Title Page Information:</b> Manuscripts must be prepared following the Manuscript Title, Running Title, Author list, Affiliations, Abstract, Word limits, No. of Figures and Tables, and Keywords.</li>
            <li><b>Author Ethical Responsibilities:</b> The author should provide Supplementary Materials, Acknowledgements, Author Contributions, Conflicts of Interest, Source of Funding, Data Availability Statement, and Citations.</li>
            <li><b>Presentation and Format:</b> Spacing, Margins, Page Numbering, Word limit, etc.</li>
          </OL>

          <H3>Cover Letter</H3>
          <P>
            Manuscripts submitted for publication must be accompanied by a concise cover letter that articulates
            the significance of the paper&apos;s content, situates it within the existing body of work, and confirms
            its suitability for the journal&apos;s scope. The cover letter needs to include specific details including:
          </P>
          <OL>
            <li>Journal name</li>
            <li>Manuscript Title</li>
            <li>Type of Manuscript</li>
            <li>Author&apos;s full names (First name, Middle Name, and Last Name)</li>
            <li>Complete Affiliations (in sequences)</li>
            <li>Contact no and email ID</li>
            <li>ORCID ID/Researcher&apos;s profile</li>
            <li>Author should disclose the use of AI in the manuscript as per <A href="https://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html">ICMJE</A> criteria.</li>
            <li>Disclosure of any conflicts of interest or funding sources.</li>
          </OL>

          <H3>Title Page Information</H3>
          <P>The Title page should include:</P>
          <OL>
            <li>The title of a manuscript should be concise, specific, relevant, and informative, and should contain the primary keywords, formulae, and abbreviations used.</li>
            <li>Running title or short title should not be more than 40–50 characters.</li>
            <li>Authors&apos; first and last names must be provided, which can also include the middle name. The standard format used for PubMed/MEDLINE for affiliations is complete address information, including city, pin/zip code, state, and country. The affiliations should be provided as 1, 2, and 3, but should not be marked with symbols.</li>
            <li>The corresponding author manages all pre- and post-publication communication for the manuscript, and must have their name, address, contact number, and email address clearly stated. Updated institutional email addresses and contact numbers for the corresponding author are required, adhering to <A href="https://ipinnovative.com/guidelines/author/authorship-criteria">authorship qualification criteria</A>.</li>
            <li>Keywords: Include between three and six keywords. These will be used for indexing. You can use resources like MeSH (<A href="https://www.ncbi.nlm.nih.gov/mesh/">https://www.ncbi.nlm.nih.gov/mesh/</A>) on Demand to select appropriate keywords.</li>
            <li>Word Count: Provide the electronic word count of the manuscript.</li>
            <li>Tables and Figures: State the number of tables and figures included.</li>
            <li>Conflict of Interest Statement: Declare any potential conflicts of interest. Visit the journal&apos;s Conflict of Interest section for more details.</li>
            <li>Financial Support Statement: List any financial support received by the authors related to the study or manuscript preparation. Refer to the Financial Disclosure section for guidance.</li>
            <li>Authors Contributions: Describe each author&apos;s role in the study, such as designing the research, conducting experiments, and writing the manuscript as per <A href="https://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html">ICMJE</A> Criteria for authorship.</li>
            <li>Confirmation that informed patient consent was obtained for publication of the case details.</li>
          </OL>

          <H2 id="heading-3">Original Research Article</H2>
          <P>
            <b>Structured Abstracts:</b> The abstract should accurately represent the entire content of the
            manuscript, serving as a concise summary rather than an introduction. It must include only information
            that is present in the main text and should not contain any citations. The abstract should be provided
            with a maximum of 150–250 words with the following subheadings:
          </P>
          <OL>
            <li><b>Background:</b> The background for the study should state the study&apos;s purpose, basic procedures, main findings, and principal conclusions.</li>
            <li><b>Methods:</b> Briefly describe the main methods, treatments, or protocols applied and include relevant preregistration numbers. Include ethical approval, CTRI registration (if applicable), and adherence to ethical standards (e.g., Declaration of <A href="https://www.wma.net/policies-post/wma-declaration-of-helsinki/">Helsinki</A>). Include a statement about animal study approval if animals were involved.</li>
            <li><b>Results:</b> Results are presented in logical sequence in tables, text, and figures, giving the main and most important findings.</li>
            <li><b>Conclusion:</b> The conclusion indicates the interpretations with the goal of the study, but avoids unqualified statements.</li>
            <li><b>Keywords:</b> Keywords (MeSH Terms) need to be added after the abstract, and it is recommended to be specific to the article and within the subject discipline.</li>
            <li><b>CTRI No.</b> Must be mentioned at the end of the abstract. (if applicable)</li>
          </OL>
          <P><b>Introduction:</b> The introduction should be briefly placed in a broad context and highlight its significance. It should define the purpose of the work and its significance, including specific and previous studies in the area. The introduction should be kept comprehensible to scientists working outside the topic of the research paper.</P>
          <P><b>Materials and Methods:</b> The Methods section should only include information that was available at the time the study was planned or the protocol was written. New methods and protocols should be described in detail, while well-established methods can be briefly described and appropriately cited. One must provide the name and version of any software used and be clear where the computer code used is available. A statement indicating that the research was approved by an independent local, regional, and national level needs to be mentioned.</P>
          <P><b>Results:</b> Provide a concise and precise description of the experiment results and data on all primary and secondary outcomes, identified in the materials and methods part. All Charts, figures, and Tables are cited in text in numerical order and include a brief description; consider using supplement material to highlight major findings.</P>
          <P><b>Discussion:</b> Discuss the results and how they can be interpreted from the perspective of previous studies and of the working hypotheses. The findings and their implications should be discussed in the broadest context possible.</P>
          <P><b>Conclusions:</b> It summarizes the key points and findings of your manuscript. It determines the overall conclusions of the study and the future research directions.</P>
          <P><b>Acknowledgements:</b> Acknowledgement of grants, funds, persons, and support at the end of the article before the references, and also include them on the title page as a footnote to the title or otherwise. Mention the use of AI tools and support in a separate section at the end of the article.</P>
          <P><b>Authorship Statement:</b> An Authorship Statement is a formal declaration that specifies the contributions, roles, and responsibilities of each individual author in the creation and development of a research paper, article, or academic publication, promoting transparency, accountability, and credibility in scholarly work. (including ICMJE guidelines).</P>
          <P><b>Patents:</b> It is not mandatory, but may be updated if a patent work is reported in the manuscript.</P>

          <H2 id="heading-4">Review Article</H2>
          <P>Review articles are expected to be written by experts who have done substantial research on the subject. We identify and invite experts to write review articles, and also consider unsolicited review articles. Review articles should address a focused topic, issue, or question. A summary of the work done by the authors in the field of review should accompany the manuscript. The author submitting a review article should include a section describing the methods used for locating, selecting, extracting, and synthesizing data.</P>
          <P><b>Structure:</b> Abstract, Keywords, Introduction, Discussion, Conclusion, and References</P>
          <P>The discussion part of the review should be managed into subdivisions headed by informative sub-titles.</P>
          <P><b>The types of Review Articles:</b></P>
          <OL>
            <li><b>Systematic Review:</b> Evidence based research method which answers specific questions by identifying, analysing, and synthesizing all available research on that topic. Must comply with PRISMA.</li>
            <li><b>Meta-Analysis:</b> A statistical method that combines results from various studies on the same topic to provide a more reliable conclusion. It is useful when individual studies have conflicting results. To ensure transparency, reproducibility, and rigor, it is essential for meta-analyses to adhere to the PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) guidelines for systematic reviews and meta-analyses. [<A href="https://www.prisma-statement.org/">PRISMA Guidelines</A>]</li>
            <li><b>Narrative Review:</b> A simple restatement of the literature published on a specific aspect of a topic is summarized, interpreted, and critically discussed without strictly adhering to the standards of a systematic review. It is widely used to explain issues, identify patterns, resolve controversies, and provide recommendations for future research.</li>
          </OL>

          <H2 id="heading-5">Case Report/Case Series</H2>
          <P>Authors should submit novel, interesting, or rare case reports/case series. They should be unique, describe a great diagnostic or therapeutic challenge, and provide a learning point for readers. Cases with clinical significance or implications will be given priority. Case reports do not require extensive patient details and should be submitted as Correspondence, which should not contain more than 800 words.</P>

          <H2 id="heading-6">Letter-to-Editor</H2>
          <P>Letters to the editor should be focused on news or on an article that has been published in a journal within the past year. The letter should focus on a significant aspect of the manuscript, which is, in the author&apos;s opinion, and the comments.</P>
          <P>Editorial, Short Communication, Commentary, and others as mentioned below:</P>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-[14px] border border-[#e5e7eb]">
              <thead className="bg-[#f3f4f6]">
                <tr>
                  <th className="border border-[#e5e7eb] p-2 text-left w-[28%]">Article Types</th>
                  <th className="border border-[#e5e7eb] p-2 text-left">Detail Descriptions</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Original Research Article</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Words limit: 2000–4500 words (Excluding abstract, acknowledgments, tables, figure legends, references)<br />
                    Structured Abstract (150–250 words): Background, Aim/Objectives, Materials and Methods, Results, Conclusion<br />
                    Keywords: (3–10) MeSH (Medical Subject Headings)<br />
                    References: 15–70, formatted in Vancouver style<br />
                    Combined Figures: Up to 8 (minimum resolution 300 DPI, accepted formats: JPEG, PNG, TIFF).<br />
                    Tables: Up to 8 (in Editable format)<br />
                    Article Structure: Introduction, Materials and Methods, Results, Discussion, Conclusions, References
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Review Article</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Words limit: 2500–6000 words (Excluding abstract, acknowledgments, tables, figure legends, references)<br />
                    Headings: Abstract (150–250 words), Keywords, Introduction, Discussion, Conclusion, and References<br />
                    Combined Figures: Up to 8 (minimum resolution 300 DPI, accepted formats: JPEG, PNG, TIFF).<br />
                    Tables: Up to 8 (in Editable format)<br />
                    References: 15–100, formatted in Vancouver style
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Meta-analysis/Systematic Review</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Word limit: 2500–6500 words (Excluding abstract, acknowledgments, tables, figure legends, references)<br />
                    Title: Mention &quot;meta-analysis/Systematic Review&quot; in the title. Example: &quot;Comparative Effectiveness of Regional vs. General Anesthesia: A Meta-Analysis/Systematic Review.&quot;<br />
                    Structured Abstract (150–250 words): Background, Objective, Material &amp; Methods, Results, Conclusions, Keywords (3–6 MeSH terms)<br />
                    Article Structure: Introduction, Materials and Methods, Results, Discussion, Conclusions, Ethics Approval, Acknowledgment, Funding, Conflicts of Interest, Author Contribution.<br />
                    References: 15–100, formatted in Vancouver style<br />
                    Combined Figures: Up to 8 (minimum resolution 300 DPI, accepted formats: JPEG, PNG, TIFF).<br />
                    Tables: Up to 8 (in Editable format)
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Case Report/Case Series</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Words limit: 1000–2500 words (Excluding abstract, acknowledgments, tables, figure legends, references)<br />
                    Main Headings: Unstructured Abstract (150 words max), Introduction, Case Presentation/Series, Discussion, Conclusion, and References<br />
                    Combined Figures: Up to 15 (minimum resolution 300 DPI, accepted formats: JPEG, PNG, TIFF).<br />
                    Tables: Up to 8 (in Editable format)<br />
                    References: 8–25, formatted in Vancouver style
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Letter-to-Editor</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Words limit: 300–800 words (Excluding acknowledgments, tables, figure legends, references)<br />
                    No abstract<br />
                    Figures/Tables: Maximum 2 figure or table (minimum resolution 300 DPI, JPEG/PNG/TIFF)<br />
                    References: 3–8, formatted in Vancouver style
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Short Communication/Commentary</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Words limit: Up to 600–1500 words (Excluding abstract, acknowledgments, tables, figure legends, references)<br />
                    References: 5–15, formatted in Vancouver style<br />
                    Figures/Tables: Maximum 2 figure or table (minimum resolution 300 DPI, JPEG/PNG/TIFF)
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Editorial/Guest Editorial</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Words limit: Up to 400–1200 words (Excluding acknowledgments, tables or figure legends, references)<br />
                    No Abstract<br />
                    Figures/Tables: Maximum 1 figure or table (minimum resolution 300 DPI, JPEG/PNG/TIFF)<br />
                    References: Optional, up to 10, formatted in Vancouver style
                  </td>
                </tr>
                <tr>
                  <td className="border border-[#e5e7eb] p-2 font-medium">Author Ethical Responsibilities</td>
                  <td className="border border-[#e5e7eb] p-2">
                    Conflicts of Interest<br />
                    Funding Source<br />
                    Author Contribution<br />
                    Acknowledgment (Use of AI (if any))<br />
                    Ethical Approval (if applicable)<br />
                    Informed Consent (for case reports/human studies)<br />
                    Data Availability Statement (if applicable)<br />
                    Clinical Trial Registry (only for Clinical trial manuscripts)<br />
                    Kindly cite all references, along with any figures and tables referenced in the article. (Do not cite Abstract)<br />
                    Supplementary Materials (if applicable): Authors may submit supporting datasets, additional tables/figures, or multimedia files to be published online only.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <P><b>Note:</b> Referencing AI-generated material as the primary source is not acceptable.</P>

          <H2 id="heading-7">Manuscript Formatting</H2>
          <P>All manuscripts should follow the given formatting style:</P>
          <UL>
            <li>Manuscripts should be submitted in MS-Word only; no PDF or other format is allowed.</li>
            <li>Use normal font (e.g., 12-point, Times New Roman) for text.</li>
            <li>Use double-spaces for all text, including abstract, table, reference, footnotes, and figure legends.</li>
            <li>Use italics for emphasis.</li>
            <li>Page margins 1 inch from all sides.</li>
            <li>Page numbers at the bottom.</li>
            <li>Reference according to the journal instructions, punctuation marks checked.</li>
            <li>Submission of the manuscript without track changes.</li>
            <li>Use the table function to create a table in Word, not Spreadsheet/Excel.</li>
            <li>Save your file in Docx format (MS Word 2007 (docx) or higher).</li>
            <li>All scientific names should be written in italics.</li>
          </UL>
          <P><b>Measurement of Units:</b> Internationally accepted rules, regulations, policies, and conventions use the International System of Units (SI). In case any other units are mentioned, please provide their equivalent SI.</P>

          <H2 id="heading-8">Preparation of Figure, Table, and Artworks</H2>
          <UL>
            <li>Files for figures and tables must be provided during submission in a single zip/WinRAR file and archives and at a clear and high-resolution pixel width/height, or a resolution of 300 dpi (Dots Per Inch) or higher. Standard formats such as TIFF, JPEG, EPS, and PNG are accepted and preferred.</li>
            <li>Authors are encouraged to prepare tables and figures in colour (RGB at 8-bit).</li>
            <li>Figures include photographs, radiographs, or micrographs and use composite figures containing several panels of photographs.</li>
            <li>All Figures, tables, and artworks must have a caption or a heading. To facilitate the copy-editing of large tables, smaller fonts may be used.</li>
            <li>Tables and Figures/Graphs are always cited in text in consecutive numerical order. In case Table Abbreviations are used, they should be provided in the footer of the Table.</li>
            <li>Identify any previously published material by giving the source in the form of a reference at the end of the table caption.</li>
            <li>The author should check figures for duplications and ensure their clarity and accuracy.</li>
          </UL>

          <H2 id="heading-9">Author Ethical Responsibilities</H2>
          <P><b>Supplementary Materials:</b> It describes any supplementary material published online alongside the manuscript, such as figures, tables, spreadsheets, videos, etc. The author should indicate the name and title of each element as follows: Figure F1: title, Table T1: Title, etc.</P>
          <P><b>Funding and Acknowledgments:</b> Include administrative and technical support, or donations in kind of people, grants, funds, etc., should be placed in a separate section on the title page of the manuscript. Additionally, provide the funding information in a separate section. In case the funding institution is not listed, it can be entered as text. Funding information will be published as searchable metadata for the accepted article, whereas acknowledgments are published on the page.</P>
          <P><b>Author Contributions:</b> Authors are required to include a statement of responsibility, to have made substantial contributions to the conception or design of the work, or the acquisition, analysis, or interpretation of the data, or drafting the work, and substantively revising it as per <A href="https://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html">ICMJE Authorship Criteria</A>. Authorship must include and be limited to those who have contributed substantially to the work.</P>
          <P><b>Data Availability Statement:</b> Provide details regarding where data supporting reported results can be found, including links to publicly archived datasets analysed or generated during the study, or you might choose to exclude this statement if the study did not report any data.</P>
          <P><b>Conflicts of Interest:</b> The Journal mandates authors to disclose any financial or conflicting interests affecting the study&apos;s outcome at the time of manuscript submission, including any involvement in employment, consultation, ownership, or testimony. If no role is stated, sponsors must be excluded. Conflict-of-interest information will be communicated in a published statement. Please visit the COPE guidelines on <A href="https://publicationethics.org/guidance?f%5B0%5D=topics%3A28">Conflict of Interest/Competing Interests</A> for more details.</P>
          <P>If no conflicts exist, the authors should state that they declare no conflicts of interest.</P>
          <P><b>Citation:</b> Reference and Citation in supplementary files are permitted and provided that they also appear in the main text and the reference list in order.</P>

          <H2 id="heading-10">Supplementary Materials, Data submission</H2>
          <P>Journal is committed to accepting open scientific exchange and enabling our authors to achieve best practices in sharing and archiving research data. Authors of published articles in the Journal are encouraged to share their research data. Every journal guideline can be found on the journal&apos;s <A href="https://ipinnovative.com/guidelines/author">Instructions for Authors</A>. The Policy of data sharing concerns the minimal dataset support and findings of a published study. Collected data should be publicly available and cited under the guidelines of the journal.</P>

          <H2 id="heading-11">Unpublished and Research Data Policy</H2>
          <UL>
            <li>At the time of submission, the availability of data limits should be mentioned in the manuscript. All observations on the submitted manuscript should be published by the authors as unpublished data or supplementary information. Submission of data to the journal indicates that all raw data and resources specified in the publication will be publicly accessible to any researcher who wants to use them for non-commercial reasons without violating participant confidentiality. It is recommended that authors ensure their datasets are either included in the primary publication or other supporting files or deposited in publicly accessible repositories.</li>
            <li>Journal accepts all sequence names, and the accession numbers provided by the databases must be provided in the materials and methods section of the article.</li>
          </UL>

          <H2 id="heading-12">Research and Publication Ethics</H2>
          <P>For more details, visit <A href="https://ipinnovative.com/guidelines/author/research-and-publication-ethics">here</A>.</P>
          <H3>Statement on the Welfare of Animals Rights</H3>
          <P>For more details, visit <A href="https://ipinnovative.com/guidelines/author/research-and-publication-ethics">here</A>.</P>

          <H2 id="heading-13">References Guide</H2>
          <P>The Journal follows the NLM style guide (<A href="https://www.nlm.nih.gov/bsd/uniform_requirements.html">https://www.nlm.nih.gov/bsd/uniform_requirements.html</A>) and ICMJE guidelines for references style and we generally prefer Vancouver referencing style with some exception for the published and unpublished content.</P>
          <H3>How to cite references</H3>
          <P>Write references list according to the appearance or citation of the references in the text. A single number will be used if a source is mentioned more than once. Citations that are not included in the main text but are included in the tables, figures, etc., should be placed at the end of the list. The abstract is not allowed to cite any sources.</P>
          <P>Citations in the text should be formatted as superscript numbers or either put them in square brackets, without links to the references like: Kumar et al <sup>16</sup> found that… Or Kumar et al.[16]</P>

          <H3>How to write references</H3>
          <P>Reference should be written or listed numerically according to the type of publication or content under the heading references which is mentioned below:</P>

          <H3>Journals or Periodicals</H3>
          <P><i>Article Published online or in Print with fewer than six authors</i></P>
          <P>Author surname is followed by the first initials. Article title. Title of the journal with a standard abbreviation. Year of publication; Volume (Issue number): Pages. DOI of the article.</P>
          <P><b>Example:</b></P>
          <P>Dev JS, Nair AS, TV A, Pillai AM, Parameswaran S. Advancements in remote EEG monitoring: Technology, applications, and future directions. <i>IP Indian J Neurosci</i>. 2025;11(1):3-7. <A href="https://doi.org/10.18231/j.ijn.2025.002">https://doi.org/10.18231/j.ijn.2025.002</A></P>

          <P><i>Article Published online or in Print with more than six authors</i></P>
          <P>Author surname is followed by the first initials after six authors name add et al. Article title. Title of the journal with a standard abbreviation. Year of publication; Volume (Issue number): Pages. DOI of the article.</P>
          <P><b>Example:</b></P>
          <P>Joshua SA, Dsouza M, Jarosinski J, Vijayakumar J, Hughes S, Shivaram Y, et al. A topographical, structural and functional review of the sexual dimorphic nucleus of preoptic area in hypothalamus – A descriptive review. <i>IP Indian J Neurosci</i>. 2025;11(2):63-9. <A href="https://doi.org/10.18231/j.ijn.2025.016">https://doi.org/10.18231/j.ijn.2025.016</A></P>

          <H3>Book</H3>
          <P>Author surname is followed by the first initials. Book title. Edition (if applicable). Place: Publisher; Year.</P>
          <P><b>Example:</b> Tushir S, Agarwal G. Textbook of dietary supplements and nutraceuticals for the students of B.Pharm 8th Semester. 1st ed. New Delhi: IP Innovative Publication Pvt Ltd; 2025.</P>

          <H3>Book Chapter</H3>
          <P>Author surname is followed by first initials. Title of the chapter. In: Surname editor Initial(s), editor. Book title. Edition (if available). Place: Publisher; Year. Pages.</P>
          <P><b>Example:</b> Das BS. Re–Imagining gender: Reading transgender biographies from psychosocial perspectives. In: Chandra S. Reengagement of transgender persons challenges and opportunities. 2nd ed. New Delhi: IP Innovative Publication Pvt Ltd; 2021. p. 19-33.</P>

          <H3>E-Book</H3>
          <P>Author surname is followed by first initials. Book title [Internet]. Place: Publisher; Year [cited date]. Available from: URL.</P>
          <P><b>Example:</b> Faiz O, Moffat D. Anatomy at a Glance [Internet]. UK: Blackwell Science; 2002 [Cited 2025 8 Oct]. Available from: <A href="https://archive.org/details/AnatomyAtAGlance/page/n3/mode/2up">https://archive.org/details/AnatomyAtAGlance/page/n3/mode/2up</A></P>

          <H3>Conference Proceeding Papers</H3>
          <P>Author surname is followed by first initials. Title of paper. In: Surname editor Initial(s), editor. Title of the conference. Place: Publisher; Year. Pages.</P>
          <P><b>Example:</b> Venkatesh A. Role of human resources in organizational innovation for sustainability of new business. In: Lohara J. 2nd International Conference on Innovation and Sustainability of New Businesses. New Delhi: IP Innovative Publication; 2019. p. 216-9.</P>

          <H3>Newspaper Articles</H3>
          <P>Author surname is followed by first initials. (if available). Title of article. Title of newspaper. Date; Pages (if available): column (if available).</P>
          <P><b>Example:</b> Coronavirus in India live updates: Delhi reports 57 new cases, zero deaths in last 24 hours. The Times of India. Sep 15, 2021.</P>

          <H3>Blogs</H3>
          <P>Author surname is followed by first initials. (if available). Title of blog [Internet]. Publisher Name. Date - [cited date]. Available from: URL</P>
          <P><b>Example:</b> Manhas R, Saproo K. The Intelligent Libraries: Adapting to the AI Age [Internet]. IP Innovative Publication. 2024 Sep 7 - [cited 2025 Sep 26]. Available from: <A href="https://blog.ipinnovative.com/the-intelligent-libraries-adapting-to-the-ai-age/">https://blog.ipinnovative.com/the-intelligent-libraries-adapting-to-the-ai-age/</A>.</P>

          <H3>Preprint</H3>
          <P>Author surname is followed by first initials. Title of Article/thesis. Preprint website name. Followed by [Preprint]. Year [Cited date] URL. DOI (If available).</P>
          <P><b>Example:</b> Carré A, Ibáñez-Molero S, Peeper DS, Altelaar M, Stecker KE. Decoding interaction-induced proteome changes in cocultures with hybrid quantification and SILAC-directed real time search. BioRxiv.org [Preprint]. 2025 [cited 15 Sep 2025]. Available from: <A href="https://www.biorxiv.org/content/10.1101/2025.09.09.675040v1">https://www.biorxiv.org/content/10.1101/2025.09.09.675040v1</A></P>
          <P>DOI: <A href="https://doi.org/10.1101/2025.09.09.675040">https://doi.org/10.1101/2025.09.09.675040</A></P>

          <H3>Thesis Published</H3>
          <P>Author surname is followed by first initials. Title of Thesis (Type of Thesis). Place of Publication: Publisher/University Name; Year of Publication.</P>
          <P><b>Example:</b> Bosse-Joseph C. Modulating the mTOR Pathway Using Inducible Retrogradely Transported AAVs as a Novel Approach to Improve Motor Recovery in Spinal Cord Injury. (Research). (2024). Theses and Dissertations--Medical Sciences. 26. <A href="https://uknowledge.uky.edu/medsci_etds/26">https://uknowledge.uky.edu/medsci_etds/26</A></P>

          <H3>Website</H3>
          <P>Author surname is followed by first initials. Title [Internet]. Place: Publisher; Date of publication [updated date; cited date]. Available from: URL.</P>
          <P><b>Example:</b> Donovan R. Everything You Need to Know About Heart Disease. [Internet]. New York: Healthline; Updated on Feb 27, 2020. Available from: <A href="https://www.healthline.com/health/heart-disease">https://www.healthline.com/health/heart-disease</A>.</P>
          <P>Always use the standard abbreviation of the journal&apos;s name according to the ISSN list of titles. If you are unsure, please write the full journal title. Authors are responsible for the accuracy or validation of the references.</P>

          <H2 id="heading-14">Clinical Trial Registry</H2>
          <P>It is recommended that clinical trials be prospectively registered in a public domain database, and the clinical trial registration number should be mentioned in all papers reporting their results. Authors are asked to provide the name of the trial register and the clinical trial registration number in the manuscript. If a clinical trial is not registered or registered retrospectively, the reason must be provided at the time or before the time of the patient&apos;s first enrolment as a condition of consideration for publication.</P>
          <P>Journal follows the International Committee of Medical Journal Editors (ICMJE) <A href="https://www.icmje.org/recommendations/browse/publishing-and-editorial-issues/clinical-trial-registration.html">guidelines</A>. Authors are highly encouraged to pre-register clinical trials with an international clinical trial register and cite a reference to the registration in the methodology section. Suitable databases include <A href="https://ctri.nic.in/Clinicaltrials/login.php">http://ctri.nic.in/Clinicaltrials/login.php</A> and those listed by the World Health Organization <A href="https://www.who.int/tools/clinical-trials-registry-platform">International Clinical Trials Registry Platform</A>.</P>
          <P>Journal reserves the right to reject a paper without trial registration for further peer review process. Reports of randomized clinical trials should present information on all major studies, including the protocol, assignment of interventions based on the <A href="https://www.consort-spirit.org/">CONSORT statement</A>. A suitable database must be included and requires a complete consolidation of standard reporting trials as per the CONSORT minimum guidelines for publication.</P>
          <P>Clinical trial abstracts should include items that the <A href="https://www.consort-spirit.org/">CONSORT</A> group has identified as essential. Funding sources should be listed separately after the abstract to facilitate proper display and indexing for search retrieval.</P>
          <H3>Specific Study Designs and Reporting Guidelines</H3>
          <P>Journal requires a complete <A href="https://www.consort-spirit.org/extensions">CONSORT 2010 Checklist</A> key document and <A href="https://www.consort-spirit.org/extensions">CONSORT 2010 flow diagram</A>, as a condition of submission of reporting the results of the randomized clinical trial. The author can find templates of these reporting guidelines on the CONSORT <A href="https://www.consort-spirit.org/">website</A>. Authors are also referred to the <A href="https://www.equator-network.org/">EQUATOR network</A> for further information on the available reporting guidelines for health research. Authors are encouraged to follow the guidelines of SAGER&apos;s &quot;Sex and Gender Equity in Research&quot; rationale for the SAGER guidelines and recommend use when relevant. Authors should describe in the background whether sex and gender differences may be expected. If sex and gender analysis were not conducted, the rationale should be provided in the discussion. The journal suggests that the author follow the full <A href="https://www.equator-network.org/reporting-guidelines/sager-guidelines/">guidelines of SAGER</A>.</P>
          <H3>Good Clinical Practices (GCP)</H3>
          <P>For the planning, execution, monitoring, auditing, documentation, analysis, and reporting of clinical trials, Good Clinical Practice (GCP) is a global ethical and scientific quality standard. Additionally, it safeguards the trial subjects&apos; anonymity, integrity, and rights. It is crucial to comprehend the history behind the development of the ICH-GCP standards since it clarifies the rationale and necessity of doing so.</P>
          <P>The ICH-GCP is a unified standard that safeguards the rights, safety, and well-being of human participants, reduces human exposure to investigational products, enhances data quality, accelerates the marketing of new drugs, and lowers costs for sponsors and the public. Adhering to this standard offers public assurance that the rights, safety, and welfare of trial participants are safeguarded and aligned with the principles of the Declaration of Helsinki, ensuring the reliability of clinical trial data.</P>

          <H2 id="heading-15">Publication Ethics Statement</H2>
          <P>For more information, visit to the <A href="https://ipinnovative.com/guidelines/author/publication-ethics-statement">Publication Ethics</A> section.</P>

          <H2 id="heading-16">Plagiarism</H2>
          <P>The journal considers plagiarism a serious breach of publication ethics. Plagiarism is defined as the act of presenting another&apos;s work, ideas, or words as one&apos;s own without proper attribution. The journal also strictly prohibits self-plagiarism, which is the redundant reuse of significant portions of an author&apos;s own previously published work without appropriate citation. Self-plagiarism involves reusing one&apos;s own work without proper citation, using another&apos;s production without credit, or presenting a new idea derived from an existing source. Our Journal considers this as plagiarism, and <A href="https://www.ithenticate.com/">iThenticate</A> software is provided to editors and reviewers.</P>

          <H2 id="heading-17">Reviewer Suggestions</H2>
          <P>Once the manuscript has been submitted, you are requested to suggest any two potential reviewers with appropriate expertise to review the manuscript. The editors will not necessarily approach these referees. The suggested reviewer should be from a different institution from the authors, or the author may identify appropriate Editorial Board members of the journal as potential reviewers. You may suggest reviewers among the authors whom you frequently cite in your paper.</P>

          <H2 id="heading-18">English Language Corrections</H2>
          <P>The submitted manuscript must be grammatically correct. In case guidance is required with English writing, it is recommended to have the manuscript professionally edited prior to the submission. These services can be facilitated by Innovative Author Services. Professional editing will enable reviewers and future readers to understand and assess the content of submitted manuscripts. All accepted manuscripts undergo language editing.</P>

          <H2 id="heading-19">Authorship</H2>
          <P>The journal and publisher assume all authors agreed with the guidelines <A href="https://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html">International Committee of Medical Journal Editors (ICMJE)</A>, which state that all authors gave explicit consent to the manuscript submission and that they obtained consent from the authors&apos; responsibilities at the institution where the study was conducted. Those who contributed to the work but did not qualify for authorship should be listed in the acknowledgements.</P>
          <P>Any updates on the author list should be approved by all authors, including any who have been removed from the list. The publisher reserves the right to request confirmation that all authors meet the authorship conditions. Please visit for more details about <A href="https://www.icmje.org/recommendations/browse/roles-and-responsibilities/defining-the-role-of-authors-and-contributors.html">authorship</A>, and check the <A href="https://ipinnovative.com/guidelines/author/publication-ethics-statement">Innovative Publication Ethics website</A>.</P>

          <H2 id="heading-20">Author Appeals</H2>
          <P>The author has the right to send an appeal to the editorial office of the journal by sending an email. The appeal must provide a detailed justification, including all point-by-point responses to the reviewer&apos;s and or Editor&apos;s comments. Expert advisory recommendations on the manuscript may recommend acceptance, for further peer review, or uphold the original rejection decision. A rejection decision at this stage is final and cannot be reversed.</P>

          <H2 id="heading-21">Print copy</H2>
          <P>The corresponding author will receive one print copy of the issue. In case the corresponding author or any other authors are looking for an additional hard copy, they can order from the editorial office at an Individual price of a single issue. The publisher and the society are not responsible for providing additional copies if the original is lost.</P>

          <H2 id="heading-22">Editorial Process and Peer-Review</H2>
          <H3>Primary Scrutiny</H3>
          <P>The Editorial office reviews manuscripts submitted via the portal to ensure they are properly prepared and adhere to the journal&apos;s editorial policies, including human experimentation. Non-suitable manuscripts are rejected before peer review, and those not prepared are returned for revision. The Managing Editor then consults the journal, Editor-in-Chief, or Associate Editors.</P>
          <H3>Peer-Review</H3>
          <P>Once the primary scrutiny completed, at least two independent experts for peer review will be assigned by the Editorial Office. Reviewers should not have published with any of the co-authors during the past three years and should not currently work or collaborate with any of the institutions of the co-authors. All the submitted manuscripts and communications are managed by the Pre-Publication Portal of the peer-review system. The editorial office team will communicate the decision to editors and inform the author.</P>
          <P>All review comments should be communicated to authors via the pre-publication portal. In case the author disagrees with a reviewer, they must provide a clear response.</P>
          <H3>Peer-Review Duration</H3>
          <P>The Journal follows the ideal average duration between the submission and publication of an article. The first decision after submission will be taken within 1–7 days and will be communicated to the authors. It generally takes 8–12 weeks for the peer-review process. Apart from this, the publication time is as per publication schedule after the acceptance of an article. It may vary on the basis of many factors, such as the article type, the journal&apos;s internal process, and the availability of peer reviewers, along with authors, reviewers, and editorial staff communications.</P>

          <H2 id="heading-23">Author Support</H2>
          <P>To support the Author during the article submission, please visit the journal homepage. For detailed instructions on preparation of the manuscript submission, please visit. Please <A href="https://ipinnovative.com/contact">visit</A>, in case of a <A href="https://www.mprp.in/">query</A>, once the article gets accepted. One can check our author <A href="https://ipinnovative.com/faq">FAQ</A> or write us at <A href="mailto:support@ipinnovative.com">support@ipinnovative.com</A>. One can also visit for <A href="https://ipinnovative.com/webinar">Training and Support</A>.</P>

          <H2 id="heading-24">Personal Assistance</H2>
          <P>In case an author requires assistance with the submission of their manuscript at our online submission portal, please contact <A href="mailto:editorialoffice@ipinnovative.com">editorialoffice@ipinnovative.com</A>.</P>
        </main>
      </div>
    </div>
  );
}
