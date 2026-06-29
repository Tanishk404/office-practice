// app/(main)/editorial/page.tsx
import React from "react";

interface EditorialLink {
  label: "ORCID" | "Scholar" | "ResearchGate" | "Scopus";
  url: string;
}

interface EditorialMember {
  id: string;
  name: string;
  title?: string;
  details: string[];
  email?: string;
  country?: string;
  links?: EditorialLink[];
}

interface EditorialSection {
  heading: string;
  members: EditorialMember[];
}

const editorialSections: EditorialSection[] = [
  {
    heading: "Editor in chief",
    members: [
      {
        id: "rajarshi-chakraborty",
        name: "Rajarshi Chakraborty",
        title: "Assistant Professor",
        details: [
          "Department of Neurology",
          "King George's Medical University, Lucknow, Uttar Pradesh",
        ],
        email: "satyalung@gmail.com",
        country: "India",
        links: [
          { label: "ORCID", url: "https://orcid.org/0000-0003-2304-2177" },
          { label: "Scopus", url: "https://www.scopus.com/authid/detail.uri?authorId=57282611300" },
        ],
      },
    ],
  },
  {
    heading: "Associate Editors",
    members: [
      {
        id: "deepak-kumar-singh",
        name: "Deepak Kumar Singh",
        title: "Professor and Head",
        details: [
          "Department of Neurosurgery",
          "Dr. Ram Manohar Lohia Institute of Medical Sciences, Lucknow, Uttar Pradesh",
        ],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0001-9973-5557" }],
      },
      {
        id: "vivek-kumar",
        name: "Vivek Kumar",
        title: "Head of Neurology",
        details: [
          "Department of Direct Neurologist",
          "Max Super speciality Hospital, New Delhi",
        ],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0003-2550-5884" }],
      },
      {
        id: "sandeep",
        name: "Sandeep",
        title: "Associate Professor",
        details: [
          "Department of Neuroscience",
          "Institute of Nutrition & Public Health, Nims University, Jaipur, Rajasthan",
        ],
        country: "India",
        links: [{ label: "ResearchGate", url: "https://www.researchgate.net/profile/Sandeep-Tripathi" }],
      },
      {
        id: "vijay-kumar",
        name: "Vijay Kumar",
        title: "Scientist",
        details: [
          "Department of Protein Chemistry, Neurodegeneration",
          "Jamia Millia Islamia, New Delhi",
        ],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0002-3621-5025" }],
      },
    ],
  },
  {
    heading: "National Editorial Board",
    members: [
      {
        id: "iswar-baitharu",
        name: "Iswar Baitharu",
        title: "Assistant Professor",
        details: [
          "Department of Neurotoxicology, Cognitive Neurosciences",
          "Sambalpur University, Sambalpur, Odisha",
        ],
        country: "India",
        links: [
          { label: "ResearchGate", url: "https://www.researchgate.net/profile/Iswar-Baitharu" },
          { label: "Scholar", url: "https://scholar.google.co.in/citations?user=wRyBnqQAAAAJ&hl=en" },
        ],
      },
      {
        id: "rajesh-singh-yadav",
        name: "Rajesh Singh Yadav",
        title: "Assistant Professor",
        details: [
          "Department of Neurotoxicology",
          "Dr. Harisigh Gour Central University, Sagar, Madhya Pradesh",
        ],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0002-1754-6187" }],
      },
      {
        id: "sharad-pandey",
        name: "Sharad Pandey",
        title: "Assistant Professor",
        details: ["Department of Neurosurgery", "PGIMER Dr. RML Hospital, New Delhi"],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0002-3542-5864" }],
      },
      {
        id: "namit-singhal",
        name: "Namit Singhal",
        title: "Director Neurosciences",
        details: [
          "Department of Neurosurgeon",
          "S S Hospital of Neurosciences, Agra, Uttar Pradesh",
        ],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0001-6892-4531" }],
      },
      {
        id: "sumit-singh",
        name: "Sumit Singh",
        title: "Director",
        details: ["Department of Neurology", "Artemis Hospital, Gurugram, Haryana"],
        country: "India",
      },
      {
        id: "mamata-mishra",
        name: "Mamata Mishra",
        title: "Senior Research Scientist",
        details: [
          "Department of Neuroscience & Stem Cells",
          "Neural Stem Cell Research, Mumbai, Maharashtra",
        ],
        country: "India",
        links: [
          { label: "ORCID", url: "https://orcid.org/0000-0003-3797-7133" },
          { label: "ResearchGate", url: "https://www.researchgate.net/profile/Mamata-Mishra" },
        ],
      },
      {
        id: "mohammed-sheeba-kauser",
        name: "Mohammed Sheeba Kauser",
        title: "Chief Physiotherapist",
        details: [
          "Department of Neuro and Rehabilitation Physiotherapy",
          "Phd Student, Doctor of Philosophy (Physical Therapy) Apex University, Jaipur, Rajasthan",
        ],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0001-5301-3559" }],
      },
      {
        id: "shubhankar-mishra",
        name: "Shubhankar Mishra",
        title: "Consultant",
        details: [
          "Department of Neurology",
          "Kalinga Institute of Medical Science, Bhubaneswar, Odisha",
        ],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0003-0453-4459" }],
      },
    ],
  },
  {
    heading: "International Editorial Board",
    members: [
      {
        id: "riazahmed-syed",
        name: "Riazahmed Syed",
        title: "HOD",
        details: [
          "Department of Consultant Neurologist Pediatrics",
          "King Fahad Military Hospital, Jeddah",
        ],
        country: "Saudi Arabia",
      },
      {
        id: "dayalan-sampath",
        name: "Dayalan Sampath",
        title: "Research Instructor",
        details: [
          "Department of Neuroscience, Neurophysiology, Stress, Depression, Neuropsychiatric Disorders, Stroke, Brain Injury",
          "Texas A&M University System Health Science Center, Bryan",
        ],
        country: "United States",
        links: [
          { label: "ResearchGate", url: "https://www.researchgate.net/profile/Dayalan-Sampath" },
          { label: "Scholar", url: "https://scholar.google.co.in/citations?user=F650JYoAAAAJ&hl=en" },
        ],
      },
      {
        id: "pawan-raj-pulu-ishwara",
        name: "Pawan Raj Pulu Ishwara",
        title: "Assistant Professor",
        details: ["Department of Neurology", "Specialist Neurologist in Ahalia Hospital, Abu Dhabi"],
        country: "United Arab Emirates",
        links: [
          { label: "ORCID", url: "https://orcid.org/0000-0002-4767-389X" },
          { label: "Scholar", url: "https://scholar.google.co.in/citations?user=xkbs4VUAAAAJ&hl=en" },
        ],
      },
      {
        id: "vineet-arora",
        name: "Vineet Arora",
        title: "Postdoctoral Research Associate",
        details: ["Department of Neuroscience", "The Scripps Research Institute, Jupiter, Florida"],
        country: "United States",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0001-7856-0401" }],
      },
      {
        id: "mudasir-ahmad-khanday",
        name: "Mudasir Ahmad Khanday",
        title: "Instructor",
        details: [
          "Department of Neuroscience, Neuro-physiology, Neuropharmacology",
          "Harvard Medical School, Boston, USA",
        ],
        country: "United States",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0002-1619-4159" }],
      },
      {
        id: "goutam-k-tanti",
        name: "Goutam K Tanti",
        title: "Postdoctoral fellow",
        details: ["Technical University Munchen"],
        country: "Germany",
        links: [
          { label: "ORCID", url: "https://orcid.org/0000-0002-1761-6077" },
          { label: "Scholar", url: "https://scholar.google.com/citations?user=IerYFrgAAAAJ&hl=en" },
        ],
      },
      {
        id: "sunil-munshi",
        name: "Sunil Munshi",
        title: "Clinical Associate Professor",
        details: ["Department of Stroke, Nottingham", "City Hospital, Nottingham"],
        country: "United Kingdom",
        links: [{ label: "ResearchGate", url: "https://www.researchgate.net/profile/Sunil-Munshi" }],
      },
      {
        id: "komi-assogba",
        name: "Komi Assogba",
        title: "Professor",
        details: ["Department of Neurology", "University of Lome Neurology Service"],
        country: "Togo",
      },
      {
        id: "sankaranarayani-rajangam",
        name: "Sankaranarayani Rajangam",
        title: "Postdoctoral",
        details: ["Department of Neurophysiology", "Duke University, Durham, North Carolina"],
        country: "United States",
        links: [
          { label: "ResearchGate", url: "https://www.researchgate.net/profile/Sankaranarayani-Rajangam" },
          { label: "Scholar", url: "https://scholar.google.com/citations?user=uiMcXbcAAAAJ&hl=vi" },
        ],
      },
    ],
  },
  {
    heading: "Society Governing Body",
    members: [
      {
        id: "pk-kaviarasan",
        name: "P.K. Kaviarasan",
        title: "President",
        details: ["DVL, RMMCH, AU, Chidambaram"],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0003-1476-9120" }],
      },
      {
        id: "kanav-gupta",
        name: "Kanav Gupta",
        title: "Vice President",
        details: ["N.C. Medical College and Hospital Israna, Haryana and Gupte Eye Hospital, Panipat, Haryana"],
        country: "India",
      },
      {
        id: "lekshmy-aravind",
        name: "Lekshmy Aravind",
        title: "Secretary",
        details: ["SGR Dental College, Bangalore, Karnataka"],
        country: "India",
      },
      {
        id: "isha-gupta",
        name: "Isha Gupta",
        title: "General Secretary",
        details: ["N.C. Medical College and Hospital Israna, Haryana"],
        country: "India",
      },
      {
        id: "chandrashekar-r",
        name: "Chandrashekar R",
        title: "Treasurer",
        details: ["A.J. Institute of Medical Sciences & Research Centre, Mangalore, Karnataka"],
        country: "India",
      },
      {
        id: "dhiraj-b-nikumbh",
        name: "Dhiraj B Nikumbh",
        title: "Executive Member",
        details: ["JMF's ACPM Medical College, Dhule, Maharashtra"],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0002-7440-9007" }],
      },
      {
        id: "rajesh-bareja",
        name: "Rajesh Bareja",
        title: "Member",
        details: ["Government Medical College, Badaun, Uttar Pradesh"],
        country: "India",
        links: [{ label: "ORCID", url: "https://orcid.org/0000-0002-1240-0904" }],
      },
      {
        id: "neha-verma",
        name: "Neha Verma",
        title: "Member",
        details: ["Ph.D. (Management), Vikram University, Madhya Pradesh, MBA, DAVV University, Indore"],
        country: "India",
      },
      {
        id: "nipu-kumari",
        name: "Nipu Kumari",
        title: "Office Bearer",
        details: ["Pursuing DCA (Diploma in Computer Application) IGNOU, New Delhi"],
        country: "India",
      },
    ],
  },
];

const directory = editorialSections.flatMap((s) => s.members);

const LINK_STYLES: Record<EditorialLink["label"], { bg: string; short: string }> = {
  ORCID: { bg: "bg-[#A6CE39]", short: "iD" },
  Scholar: { bg: "bg-[#4285F4]", short: "GS" },
  ResearchGate: { bg: "bg-[#00CCBB]", short: "RG" },
  Scopus: { bg: "bg-[#FF9900]", short: "Sc" },
};

function LinkBadge({ link }: { link: EditorialLink }) {
  const style = LINK_STYLES[link.label];
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[12px] text-[#025a9c] hover:underline break-all"
    >
      <span
        className={
          "flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white " +
          style.bg
        }
      >
        {style.short}
      </span>
      <span>{link.url}</span>
    </a>
  );
}

function MemberEntry({ member }: { member: EditorialMember }) {
  return (
    <div id={"member-" + member.id} className="px-4 py-4 border-b border-slate-100 last:border-0">
      <h4 className="font-bold text-[15px] text-slate-800">{member.name}</h4>

      {member.title ? (
        <p className="text-[13px] text-slate-600">{member.title}</p>
      ) : null}

      {member.details.map((line, i) => (
        <p key={i} className="text-[13px] text-slate-600">{line}</p>
      ))}

      {member.email ? (
        <p className="text-[13px] text-slate-700 mt-1">
          <strong>Email: </strong>
          <a href={"mailto:" + member.email} className="text-blue-600 hover:underline">
            {member.email}
          </a>
        </p>
      ) : null}

      {member.country ? (
        <p className="text-[13px] text-slate-700">
          <strong>Country: </strong>
          {member.country}
        </p>
      ) : null}

      {member.links && member.links.length > 0 ? (
        <div className="mt-1.5 space-y-1">
          {member.links.map((link, i) => (
            <div key={i}>
              <LinkBadge link={link} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function EditorialPage() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
      <aside className="lg:col-span-3 order-2 lg:order-1">
        <div className="lg:sticky lg:top-4 divide-y divide-slate-100 border border-slate-200 rounded bg-white">
          {directory.map((m) => (
            <a key={m.id} href={"#member-" + m.id} className="block px-3 py-2.5 hover:bg-slate-50">
              <span className="block font-bold text-[13px] text-slate-800">{m.name}</span>
              {m.title ? (
                <span className="block text-[11px] text-slate-500">{m.title}</span>
              ) : null}
            </a>
          ))}
        </div>
      </aside>

      <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
        {editorialSections.map((section) => (
          <section
            key={section.heading}
            className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden"
          >
            <div className="bg-[#e9ecef] border-b-2 border-[#4caf50] px-4 py-2 font-bold text-sm text-slate-800">
              {section.heading}
            </div>
            <div>
              {section.members.map((m) => (
                <MemberEntry key={m.id} member={m} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}