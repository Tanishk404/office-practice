"use client"

import { useState, useEffect } from "react";

const sidebarLinks = [

  { label: "Peer review", href: "#peer-review" },

  { label: "Guidelines for Reviewers", href: "#guidelines" },

  { label: "Peer Review Checklist", href: "#checklist" },

  { label: "Detailed Manuscript Evaluation", href: "#detailed-evaluation" },

  { label: "Reviewing Specific Aspects", href: "#specific-aspects" },

  { label: "Conducting the Review", href: "#conducting" },

  { label: "Originality and Significance", href: "#originality" },

  { label: "Ethical Guidelines for Peer Reviewers", href: "#ethical-guidelines" },

  { label: "Join as a reviewer", href: "#join" },

  { label: "Submitting Your Report", href: "#submitting" },

  { label: "Artificial Intelligence (AI) Guidelines", href: "#ai-guidelines" },

  { label: "How to submit a Review Report", href: "#how-to-submit" },

  { label: "Article peer review process", href: "#author-process" },

  { label: "The Manuscript Workflow: A Step-by-Step Guide", href: "#workflow" },

];



const socialButtons = [

  { label: "f", bg: "#3b5998", title: "Facebook" },

  { label: "𝕏", bg: "#111", title: "Twitter/X" },

  { label: "✉", bg: "#555", title: "Email" },

  { label: "⤢", bg: "#2ecc71", title: "Share" },

  { label: "O", bg: "#d62976", title: "Outlook" },

  { label: "W", bg: "#25d366", title: "WhatsApp" },

  { label: "r", bg: "#ff4500", title: "Reddit" },

  { label: "in", bg: "#0077b5", title: "LinkedIn" },

];



const checklistItems = [

  { sno: "1.", particulars: "Title", description: "Does the title accurately reflect the main subject of the manuscript?" },

  { sno: "2.", particulars: "Abstract", description: "Does the abstract correctly summarize the work described in the manuscript?" },

  { sno: "3.", particulars: "Keywords", description: "Do the keywords reflect the focus and content of the manuscript?" },

  { sno: "4.", particulars: "Background", description: "Does the introduction adequately describe the background and significance of the study?" },

  { sno: "5.", particulars: "Methods", description: "Are the methods (e.g., experiments, data analysis) described in sufficient detail? Are they sound, appropriate, and reproducible? Is the statistical analysis valid?" },

  { sno: "6.", particulars: "Results", description: "Are the results clearly presented? Do they logically follow from the methods?" },

  { sno: "7.", particulars: "Discussion", description: "Does the manuscript interpret the findings appropriately? Are the conclusions supported by the results? Is the study's significance discussed in the context of existing literature?" },

  { sno: "8.", particulars: "Illustrations/tables", description: "Are the figures and tables of good quality, necessary, and illustrative of the content? Do they have clear and informative legends?" },

  { sno: "9.", particulars: "References", description: "Does the manuscript cite relevant, current, and authoritative references?" },

  { sno: "10.", particulars: "Organization", description: "Is the manuscript well-organized, concise, and coherent? Is the language and grammar accurate?" },

  { sno: "11.", particulars: "Significance", description: "Is the research question important and of interest to the journal's readership?" },

  { sno: "12.", particulars: "Ethics", description: "Have all relevant ethical considerations (e.g., patient consent, IRB approval) been adequately addressed and documented?" },

];



const detailedEvaluationItems: [string, string][] = [

  ["Manuscript Structure", "Are all key elements present: Abstract, Introduction, Materials and Methods, Results, Discussion, and References?"],

  ["Title", "Does it clearly describe the manuscript?"],

  ["Abstract", "Does it reflect the content of the manuscript?"],

  ["Introduction", "Does it clearly state the problem being investigated and the study's objective? It should summarize relevant research to provide context and explain what findings are being challenged or extended."],

  ["Material and methods", "Does the author explain how the data was collected with enough detail for the research to be replicated? Is the study design suitable for answering the research question? Have the equipment and materials been adequately described?"],

  ["Results", "Are the findings presented clearly and in a logical sequence? Has the appropriate statistical analysis been conducted? (If you are not comfortable assessing the statistics, please advise the editor). This section should be free of interpretation."],

  ["Discussion and conclusion", "Are the claims in this section supported by the results? Do the authors explain how the results relate to previous research? Does the conclusion clarify how the research advances scientific knowledge?"],

];



const workflowSteps: [string, string][] = [

  ["1. Editorial Office Screening", "The corresponding author submits the manuscript to the journal via the Manuscript Review Process (MPRP) portal (or relevant journal website). The journal's editorial office (EO) performs an initial technical check to ensure the submission meets the journal's composition and management requirements."],

  ["2. Initial Evaluation by the Editor", "Once the technical check is completed, the editorial office level evaluates the manuscript to determine if it is appropriate for the journal's scope and fit. If it is appropriate for peer review, it is sent straight on ('Fast-track') or returned to the author with comments to be revised before it can be considered for peer review."],

  ["3. Invitation to Reviewers", "The handling editor sends invitations to potential reviewers with relevant expertise in the field. As responses are received, further invitations are sent if necessary, until the required number of reviewers have agreed to review the manuscript (typically 2–3)."],

  ["4. Assignment to Reviewers", "Potential reviewers assess the invitation based on their expertise, availability, and any potential conflicts of interest. They then accept or decline the invitation. When declining, it is helpful to suggest an alternative reviewer."],

  ["5. The Review is Conducted", "The reviewer evaluates the manuscript thoroughly to form an assessment of it to see if it helps our knowledge through the process of doing proper peer review. The reviewer will prepare a detailed report. The review is then submitted to the journal with a recommendation to Accept, Reject, or revise the manuscript."],

  ["6. Decide to Communicate", "The editor considers all reviewer reports before making a final decision. If the reviews are conflicting, the editor may also seek additional reviews."],

  ["7. Decision is Communicated", "The decision is communicated to the author, including the anonymous reviewer comments."],

  ["8. Revision", "If accepted, the manuscript is sent to the production team. If the paper is sent for revision, the original reviewers may be asked to please review the new version, unless they have opted out of further participation. For minor changes, the author may be asked to revise the manuscript. Authors are asked to complete an online response to reviewers form."],

  ["9. Post-Acceptance", "Once accepted, the manuscript enters the production stage. This includes typesetting, proofreading and proof reading (e.g. a galley proof, or a typeset version). Once production steps are complete, the article is published online and promoted to the wider community."],

  ["10. After submitting the manuscript", "After submitting revisions, authors receive a thank-you email from the editorial office. A Certificate of Reviewing can also be downloaded from the reviewers system on the MPRP portal by clicking on the certificate option. The final decision on the manuscript is made."],

];



export default function ReviewerInstructionsPage() {

  const [activeHash, setActiveHash] = useState<string>("");



  useEffect(() => {

    const onScroll = () => {

      const ids = sidebarLinks.map((l) => l.href.replace("#", ""));

      for (const id of [...ids].reverse()) {

        const el = document.getElementById(id);

        if (el && el.getBoundingClientRect().top <= 120) {

          setActiveHash(`#${id}`);

          return;

        }

      }

      setActiveHash("");

    };

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);

  }, []);



  const h2: React.CSSProperties = {

    fontSize: "22px",

    fontWeight: 700,

    color: "#111",

    margin: "0 0 10px 0",

    fontFamily: "Arial, sans-serif",

  };



  const sectionStyle: React.CSSProperties = {

    marginBottom: "40px",

    paddingBottom: "32px",

    borderBottom: "1px solid #e5e7eb",

  };



  const para: React.CSSProperties = {

    fontSize: "15px",

    color: "#111",

    lineHeight: 1.75,

    margin: "0 0 8px 0",

    fontFamily: "Arial, sans-serif",

  };



  const bold: React.CSSProperties = { fontWeight: 700 };



  const ulStyle: React.CSSProperties = {

    margin: "8px 0 8px 24px",

    padding: 0,

  };



  const liStyle: React.CSSProperties = {

    fontSize: "15px",

    color: "#111",

    lineHeight: 1.75,

    marginBottom: "8px",

    fontFamily: "Arial, sans-serif",

  };



  return (

    <div style={{ display: "flex", minHeight: "100vh", background: "#fff", color: "#111", position: "relative" }}>



      {/* ── SOCIAL SHARE BUTTONS (far left, fixed) ── */}

     



      {/* ── SIDEBAR ── */}

      <aside

        style={{

          width: "280px",

          flexShrink: 0,

          background: "#f9fafb",

          borderRight: "1px solid #e5e7eb",

          position: "sticky",

          top: 0,

          height: "100vh",

          overflowY: "auto",

          padding: "28px 0",

          marginLeft: "40px", // space for social buttons

        }}

      >

        {/* Sidebar Title */}

        <div

          style={{

            fontWeight: 700,

            fontSize: "17px",

            color: "#111",

            padding: "0 20px 16px 20px",

            marginBottom: "4px",

            fontFamily: "Arial, sans-serif",

          }}

        >

          Reviewer Instructions

        </div>



        {/* Nav Links */}

        <nav>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>

            {sidebarLinks.map((link) => {

              const active = activeHash === link.href;

              return (

                <li key={link.href} style={{ borderTop: "1px solid #e5e7eb" }}>

                  <a

                    href={link.href}

                    style={{

                      display: "block",

                      padding: "10px 20px",

                      fontSize: "14px",

                      color: "#2563eb",

                      textDecoration: "none",

                      fontWeight: active ? 600 : 400,

                      background: active ? "#eff6ff" : "transparent",

                      fontFamily: "Arial, sans-serif",

                      lineHeight: 1.5,

                    }}

                  >

                    {link.label}

                  </a>

                </li>

              );

            })}

          </ul>

        </nav>

      </aside>



      {/* ── MAIN CONTENT ── */}

      <main

        style={{

          flex: 1,

          minWidth: 0,

          padding: "36px 60px 80px 48px",

          maxWidth: "980px",

        }}

      >



        {/* Peer Review */}

        <section id="peer-review" style={sectionStyle}>

          <h2 style={h2}>Peer review</h2>

          <p style={para}><span style={bold}>What is Peer Review?</span></p>

          <p style={para}>

            Peer review is the critical evaluation of a scholarly work by independent experts in the same field. It is the

            system used to assess the quality, validity, and significance of a manuscript before it is published.

            Independent researchers with relevant expertise assess submitted manuscripts for originality and scientific

            merit to help editors determine whether a manuscript is suitable for publication in the journal.

          </p>

          <p style={{ ...para, ...bold }}>How does it work?</p>

          <p style={para}>

            When a manuscript is submitted, it first undergoes an initial assessment by the editorial team to ensure it

            meets the journal&apos;s submission criteria and scope. If it meets these requirements, the manuscript is sent for

            peer review. The editorial team assigns the manuscript to potential reviewers who are experts in the relevant

            field. These reviewers provide detailed feedback, including recommendations for modifications. This valuable

            feedback helps improve the quality of the research and ensures its suitability for publication.

          </p>

          <p style={{ ...para, ...bold }}>Double blind peer review</p>

          <p style={para}>

            The journal follows a double-blind peer-review process, which means the identities of both the author and the

            reviewers are concealed from each other throughout the process. This anonymity helps maintain the integrity of

            the review by ensuring that research is evaluated based on its content and merit rather than the reputation or

            background of the authors.

          </p>

        </section>



        {/* Guidelines for Reviewers */}

        <section id="guidelines" style={sectionStyle}>

          <h2 style={h2}>Guidelines for Reviewers</h2>

          <p style={para}>When you are invited to review a manuscript, please consider the following points:</p>

          <ul style={ulStyle}>

            <li style={liStyle}>

              <span style={bold}>Expertise</span>: Does the manuscript align with your area of expertise? The editor who

              approached you may only be aware of your work in a broader context. Please review the abstract to determine

              if you are competent to provide a thorough assessment. Only accept an invitation if you have the necessary

              expertise.

            </li>

            <li style={liStyle}>

              <span style={bold}>Time Commitment</span>: Reviewing a manuscript is a time-consuming task, often requiring

              an average of 4–6 hours for a thorough evaluation. Please consider whether you can meet the deadline

              provided in the invitation. If you are unable to conduct the review, please inform the editor immediately.

              If possible, we encourage you to suggest an alternative reviewer.

            </li>

            <li style={liStyle}>

              <span style={bold}>Conflicts of Interest</span>: Are there any potential conflicts of interest that could

              influence your judgment? This may include personal, professional, or financial interests. A conflict of

              interest does not necessarily disqualify you from reviewing, but you must disclose it fully to the editor

              to allow them to make an informed decision.

            </li>

          </ul>

        </section>



        {/* Peer Review Checklist */}

        <section id="checklist" style={sectionStyle}>

          <h2 style={h2}>Peer Review Checklist</h2>

          <div style={{ border: "1px solid #d1d5db", borderRadius: "4px", overflow: "hidden" }}>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>

              <thead>

                <tr style={{ background: "#fff", borderBottom: "2px solid #d1d5db" }}>

                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#111", width: "70px" }}>S. No</th>

                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#111", width: "160px" }}>Particulars</th>

                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#111" }}>Details Description</th>

                </tr>

              </thead>

              <tbody>

                {checklistItems.map((item, i) => (

                  <tr key={item.sno} style={{ borderBottom: "1px solid #e5e7eb", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>

                    <td style={{ padding: "10px 16px", color: "#111", verticalAlign: "top" }}>{item.sno}</td>

                    <td style={{ padding: "10px 16px", fontWeight: 700, color: "#111", verticalAlign: "top" }}>{item.particulars}</td>

                    <td style={{ padding: "10px 16px", color: "#111", lineHeight: 1.6, verticalAlign: "top" }}>{item.description}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>



        {/* Detailed Manuscript Evaluation */}

        <section id="detailed-evaluation" style={sectionStyle}>

          <h2 style={h2}>Detailed Manuscript Evaluation</h2>

          <ol style={{ margin: "8px 0 8px 24px", padding: 0 }}>

            {detailedEvaluationItems.map(([title, body], i) => (

              <li key={i} style={{ ...liStyle, marginBottom: "10px" }}>

                <span style={bold}>{title}</span>: {body}

              </li>

            ))}

          </ol>

        </section>



        {/* Reviewing Specific Aspects */}

        <section id="specific-aspects" style={sectionStyle}>

          <h2 style={h2}>Reviewing Specific Aspects</h2>

          <ul style={ulStyle}>

            <li style={liStyle}>

              <span style={bold}>Language:</span> It is not the reviewer&apos;s job to copyedit a manuscript for language.

              If a paper is poorly written to the extent that it is difficult to understand, please bring this to the

              editor&apos;s attention. You may suggest a &ldquo;Minor Revision&rdquo; for the author to address language issues.

            </li>

            <li style={liStyle}>

              <span style={bold}>Previous research:</span> Does the article appropriately reference the previous research

              it builds upon? Are there any important works that have been omitted? Are the citations accurate?

            </li>

            <li style={liStyle}>

              <span style={bold}>Ethical Issues:</span>

              <ul style={{ ...ulStyle, listStyleType: "circle" }}>

                <li style={liStyle}><span style={bold}>Plagiarism:</span> If you suspect that a manuscript is a substantial copy of another work, please notify the editor in detail.</li>

                <li style={liStyle}><span style={bold}>Fraud:</span> It is difficult to detect deliberate fraud, but if you have serious concerns about the authenticity of the results, please discuss them confidentially with the editor.</li>

                <li style={liStyle}><span style={bold}>Other Ethical Concerns:</span> For medical research, ensure patient confidentiality has been maintained. Any violation of accepted norms for the ethical treatment of animal or human subjects should be reported to the editor.</li>

              </ul>

            </li>

            <li style={liStyle}>

              <span style={bold}>Prioritizing the Review: Scientific Content vs. Formatting</span>

              <ul style={{ ...ulStyle, listStyleType: "circle" }}>

                <li style={liStyle}><span style={bold}>Minor Spelling and Grammar</span>: Reviewers are not expected to correct minor spelling or grammatical mistakes. These will be addressed by our production team during the copyediting phase.</li>

                <li style={liStyle}><span style={bold}>Reference Formatting</span>: Please focus on the content and accuracy of the references rather than the specific formatting or style. The reference list will be formatted to the journal&apos;s style during production.</li>

              </ul>

            </li>

          </ul>

        </section>



        {/* Conducting the Review */}

        <section id="conducting" style={sectionStyle}>

          <h2 style={h2}>Conducting the Review</h2>

          <p style={para}>

            Your review must be conducted confidentially. The manuscript you have been asked to review should not be

            disclosed to any third party. You should not attempt to contact the author directly. Please be aware that

            your recommendations will contribute significantly to the final decision made by the editor.

          </p>

        </section>



        {/* Originality and Significance */}

        <section id="originality" style={sectionStyle}>

          <h2 style={h2}>Originality and Significance</h2>

          <ul style={ulStyle}>

            <li style={liStyle}>Is the manuscript sufficiently novel and interesting to warrant publication? Does it add to the body of knowledge?</li>

            <li style={liStyle}>Does the manuscript adhere to the journal&apos;s standards? Is the research question important?</li>

            <li style={liStyle}>

              To determine originality, you may wish to conduct a literature search using tools like PubMed, Scopus, or

              the Cochrane Library to see if the research has been covered previously.{" "}

              <a href="https://www.cochranelibrary.com/" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>

                www.cochranelibrary.com/

              </a>

            </li>

          </ul>

        </section>



        {/* Ethical Guidelines */}

        <section id="ethical-guidelines" style={sectionStyle}>

          <h2 style={h2}>Ethical Guidelines for Peer Reviewers</h2>

          <p style={para}>

            The journal follows the ethical guidelines for peer reviewers published by the{" "}

            <a href="https://publicationethics.org" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Committee on Publication Ethics</a>{" "}

            (COPE){" "}

            <a href="https://publicationethics.org/resources/guidelines-new/cope-ethical-guidelines-peer-reviewers" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Ethical Guideline for Peer Reviewers</a>.

            We are committed to ensuring that peer review is fair, unbiased, and timely. The decision to accept or

            reject a manuscript is based on the manuscript&apos;s importance, originality, and clarity.

          </p>

        </section>



        {/* Join as a reviewer */}

        <section id="join" style={sectionStyle}>

          <h2 style={h2}>Join as a reviewer</h2>

          <p style={para}>

            Serving as a reviewer is essential to the publication process and an excellent way to contribute to the

            scientific community. We cordially invite you to join our team of reviewers. You can register via the{" "}

            <a href="#" style={{ color: "#2563eb" }}>MPRP (Manuscript Peer Review Process)</a>.

            New users must register and verify their email before completing their reviewer profile.

          </p>

        </section>



        {/* Submitting Your Report */}

        <section id="submitting" style={sectionStyle}>

          <h2 style={h2}>Submitting Your Report</h2>

          <p style={para}>

            Once you have completed your evaluation, please write and submit your report through the MPRP portal. You

            will be asked to provide your feedback under two headings:

          </p>

          <ul style={ulStyle}>

            <li style={liStyle}>

              <span style={bold}>Comments for the Editor and Author:</span> This is your main review. Provide specific,

              constructive comments on the manuscript&apos;s strengths and weaknesses. Number your comments to make it

              easy for the authors to respond.

            </li>

            <li style={liStyle}>

              <span style={bold}>Confidential Comments to the Editor (optional):</span> Use this section to raise any

              concerns that you do not wish to share with the authors, such as suspicions of plagiarism or ethical issues.

            </li>

          </ul>

          <p style={{ ...para, marginTop: "12px" }}>

            <span style={bold}>Recommendation:</span> When you make a recommendation, please use one of the following categories:

          </p>

          <ul style={ulStyle}>

            {["Accept (No revision)", "Minor Revision", "Major Revision", "Reject"].map((item) => (

              <li key={item} style={liStyle}>{item}</li>

            ))}

          </ul>

          <p style={para}>

            If you recommend revisions, please clearly identify what changes are required and indicate to the editor

            whether you would be willing to review the revised manuscript.

          </p>

        </section>



        {/* AI Guidelines */}

        <section id="ai-guidelines" style={sectionStyle}>

          <h2 style={h2}>Artificial Intelligence (AI) Guidelines</h2>

          <p style={para}>

            The use of artificial intelligence can augment the quality and credibility of research. The use of tools in

            peer review must be transparent and disclosed.

          </p>

        </section>



        {/* How to submit a Review Report */}

        <section id="how-to-submit" style={sectionStyle}>

          <h2 style={h2}>How to submit a Review Report</h2>

          <p style={para}>Before submitting your report via the MPRP portal, please ensure the following:</p>

          <ul style={ulStyle}>

            <li style={liStyle}>Your comments are clear, constructive and organised in a positive and organised manner.</li>

            <li style={liStyle}>You have addressed the key questions in the review checklist.</li>

            <li style={liStyle}><span style={bold}>Recognise the Authors&apos; Contributions:</span> Your feedback is constructive and actionable.</li>

            <li style={liStyle}>Your feedback is constructive and actionable.</li>

          </ul>

        </section>



        {/* Article peer review process */}

        <section id="author-process" style={sectionStyle}>

          <h2 style={h2}>Article peer review process</h2>

          <ul style={ulStyle}>

            <li style={liStyle}>

              Peer review process can be broadly summarised into various steps, although these steps can vary slightly

              between journals as mentioned in the diagram below.

            </li>

          </ul>

          <div

          className="items-center justify-center"

            style={{

              backgroundColor: 'red',

              padding: "24px",

              marginTop: "20px",

              display: "flex",

              justifyItems: 'center',

              alignItems: 'center',

              

              background: "#fff",

            }}

          >

            <img className='xl:h-[70%] xl:w-[70%] items-center justify-center' src="/Manuscript.jpg" alt="Flowchart" style={{ display: "block", }} />



          </div>

        </section>



        {/* Manuscript Workflow */}

        <section id="workflow" style={{ ...sectionStyle, borderBottom: "none" }}>

          <h2 style={h2}>The Manuscript Workflow: A Step-by-Step Guide</h2>

          {workflowSteps.map(([title, body]) => (

            <div key={title} style={{ marginBottom: "16px" }}>

              <p style={{ ...para, fontWeight: 700, marginBottom: "4px" }}>{title}</p>

              <p style={{ ...para, marginBottom: 0 }}>{body}</p>

            </div>

          ))}

          <p style={{ ...para, marginTop: "20px" }}>

            Reviewers should remember that they represent the journal&apos;s readership. The primary question to consider

            is &ldquo;Will the readers of the journal find this paper novel and informative?&rdquo;

          </p>

        </section>



      </main>

    </div>

  );

} 

