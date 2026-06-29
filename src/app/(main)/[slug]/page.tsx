import { DbConnection } from "@/lib/Db";
import Page from "@/models/Page";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav/Nav";
import PageSidebar from "@/components/PageSidebar";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  try {
    await DbConnection();
    const page = await Page.findOne({ slug, isActive: true }).lean();
    return page ? JSON.parse(JSON.stringify(page)) : null;
  } catch {
    return null;
  }
}

// ── HTML entities + tags clean karo ──────────────────────────────────────────
function cleanText(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, "")
    .replace(/&[a-z]+;/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Saari H2 headings extract karo ───────────────────────────────────────────
function extractH2Headings(html: string): { id: string; text: string }[] {
  const regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  const headings: { id: string; text: string }[] = [];
  const seen = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = cleanText(match[1]);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
    headings.push({ id, text });
  }
  return headings;
}

// ── H3 headings extract karo ─────────────────────────────────────────────────
function extractH3Headings(html: string): { id: string; text: string }[] {
  const regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  const headings: { id: string; text: string }[] = [];
  const seen = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = cleanText(match[1]);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    const id = "h3-" + text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 55);
    headings.push({ id, text });
  }
  return headings;
}

// ── Person names extract (Editorial pages) ────────────────────────────────────
function extractPersonNames(html: string): { id: string; text: string }[] {
  const regex = /<p[^>]*>\s*<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi;
  const names: { id: string; text: string }[] = [];
  const seen = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = cleanText(match[1]);
    if (
      !text || seen.has(text) || text.length > 70 ||
      /^(email|country|department|institute|university|professor|doctor|dr\.|prof\.|http)/i.test(text)
    ) continue;
    seen.add(text);
    const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
    names.push({ id, text });
  }
  return names;
}

// ── H2 tags mein id inject karo ──────────────────────────────────────────────
function injectH2Ids(html: string): string {
  const seen = new Set<string>();
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_, attrs, content) => {
    const text = cleanText(content);
    if (!text) return `<h2${attrs}>${content}</h2>`;
    let id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
    if (seen.has(id)) id = `${id}-${seen.size}`;
    seen.add(id);
    const newAttrs = attrs.includes("id=")
      ? attrs.replace(/id="[^"]*"/, `id="${id}"`)
      : ` id="${id}"${attrs}`;
    return `<h2${newAttrs}>${content}</h2>`;
  });
}

// ── H3 tags mein id inject karo ──────────────────────────────────────────────
function injectH3Ids(html: string): string {
  const seen = new Set<string>();
  return html.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/gi, (_, attrs, content) => {
    const text = cleanText(content);
    if (!text) return `<h3${attrs}>${content}</h3>`;
    let id = "h3-" + text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 55);
    if (seen.has(id)) id = `${id}-${seen.size}`;
    seen.add(id);
    const newAttrs = attrs.includes("id=")
      ? attrs.replace(/id="[^"]*"/, `id="${id}"`)
      : ` id="${id}"${attrs}`;
    return `<h3${newAttrs}>${content}</h3>`;
  });
}

// ── Person name paragraphs mein id inject karo ────────────────────────────────
function injectPersonIds(html: string): string {
  const seen = new Set<string>();
  return html.replace(
    /(<p)([^>]*>)\s*(<(?:strong|b)[^>]*>)([\s\S]*?)(<\/(?:strong|b)>)/gi,
    (full, ptag, pclose, openTag, name, closeTag) => {
      const text = cleanText(name);
      if (
        !text || seen.has(text) || text.length > 70 ||
        /^(email|country|department|institute|university|professor|doctor|dr\.|prof\.|http)/i.test(text)
      ) return full;
      seen.add(text);
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
      return `${ptag} id="${id}"${pclose}${openTag}${name}${closeTag}`;
    }
  );
}

// ── Best headings extract karo — DB showSidebar field ke basis pe ─────────────
// showSidebar = true  → headings dhundo aur sidebar dikhao
// showSidebar = false → koi sidebar nahi
function extractBestHeadings(
  html: string,
  slug: string
): {
  headings: { id: string; text: string }[];
  mode: "headings" | "persons";
  processedHtml: string;
} {
  // Editorial pages → person names
  const editorialSlugs = ["editorial", "editorial-board"];
  if (editorialSlugs.some((s) => slug === s || slug.startsWith(s))) {
    const headings = extractPersonNames(html);
    return { headings, mode: "persons", processedHtml: injectPersonIds(html) };
  }

  // Try H2 headings
  const h2 = extractH2Headings(html);
  if (h2.length >= 2) {
    return { headings: h2, mode: "headings", processedHtml: injectH2Ids(html) };
  }

  // Try H3 headings
  const h3 = extractH3Headings(html);
  if (h3.length >= 2) {
    return { headings: h3, mode: "headings", processedHtml: injectH3Ids(injectH2Ids(html)) };
  }

  // H2 agar sirf 1 hai to bhi dikhao (single section page)
  if (h2.length === 1) {
    return { headings: h2, mode: "headings", processedHtml: injectH2Ids(html) };
  }

  // Kuch nahi mila
  return { headings: [], mode: "headings", processedHtml: injectH2Ids(html) };
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return notFound();

  const html = page.content || "";

  // ✅ DB field: showSidebar — admin se control hota hai
  // Default true agar field exist nahi karti (purane pages ke liye)
  const showSidebar: boolean = page.showSidebar !== false;

  let headings: { id: string; text: string }[] = [];
  let mode: "headings" | "persons" = "headings";
  let processedHtml = html;

  if (showSidebar) {
    const result = extractBestHeadings(html, slug);
    headings = result.headings;
    mode = result.mode;
    processedHtml = result.processedHtml;
  } else {
    // Sidebar nahi chahiye — sirf H2 ids inject karo scroll ke liye
    processedHtml = injectH2Ids(html);
  }

  // Sidebar sirf tab dikhao jab showSidebar ON ho aur 2+ headings hon
  const sidebarVisible = showSidebar && headings.length >= 2;

  return (
    <div className="min-h-screen bg-white">
 
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Page Title */}
        <h1 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-tight mb-1">
          {page.title}
        </h1>
        <div className="w-full h-[3px] bg-[#4caf50] mt-2 mb-5 sm:mb-7" />

        {/* Mobile sidebar */}
        {sidebarVisible && (
          <div className="lg:hidden mb-4">
            <PageSidebar headings={headings} mode={mode} />
          </div>
        )}

        {/* Desktop layout */}
        <div className="lg:flex lg:gap-10 lg:items-start">

          {/* Desktop sidebar */}
          {sidebarVisible && (
            <aside className="hidden lg:block w-[230px] shrink-0 sticky top-6 self-start">
              <PageSidebar headings={headings} mode={mode} />
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div
              className="page-content"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          </div>

        </div>
      </main>

      <style>{`
        /* ── Base ── */
        .page-content {
          font-size: 14.5px;
          line-height: 1.8;
          color: #333333;
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        }

        /* ── Headings ── */
        .page-content h1 {
          font-size: 22px; font-weight: 700; color: #111827;
          margin: 32px 0 14px 0;
        }
        .page-content h2 {
          font-size: 18px; font-weight: 700; color: #111827;
          margin: 32px 0 12px 0; padding-bottom: 6px;
          border-bottom: 1px solid #e5e7eb;
          scroll-margin-top: 24px; line-height: 1.3;
        }
        .page-content h2:first-child { margin-top: 0; }
        .page-content h3 {
          font-size: 15px; font-weight: 700; color: #1f2937;
          margin: 18px 0 6px 0; scroll-margin-top: 24px;
        }
        .page-content h4 {
          font-size: 14px; font-weight: 700; color: #374151;
          margin: 14px 0 5px 0;
        }

        /* ── Paragraphs ── */
        .page-content p {
          margin: 0 0 12px 0; text-align: justify;
          scroll-margin-top: 24px;
        }

        /* ── Lists ── */
        .page-content ul, .page-content ol {
          margin: 6px 0 14px 0; padding-left: 22px;
        }
        .page-content li { margin-bottom: 6px; }

        /* ── Links ── */
        .page-content a { color: #1a73e8; text-decoration: underline; }
        .page-content a:hover { color: #1558b0; }

        /* ── Bold ── */
        .page-content strong, .page-content b { font-weight: 700; color: #111827; }

        /* ── TABLE — CKEditor figure.table wrapper ── */
        .page-content figure.table {
          width: 100%; margin: 20px 0;
          overflow-x: auto; display: block;
          -webkit-overflow-scrolling: touch;
        }
        .page-content figure.table table,
        .page-content table {
          width: 100%; border-collapse: collapse;
          font-size: 13.5px; display: table !important;
          table-layout: auto; border: 1px solid #d1d5db;
        }
        .page-content table { margin: 16px 0; }
        .page-content th {
          background: #f8f9fa; border: 1px solid #d1d5db;
          padding: 10px 14px; text-align: left;
          font-weight: 700; color: #1f2937; vertical-align: top;
        }
        .page-content td {
          border: 1px solid #d1d5db; padding: 9px 13px;
          vertical-align: top; word-break: break-word;
        }
        .page-content td p { margin: 0 0 4px 0 !important; text-align: left !important; }
        .page-content td p:last-child { margin-bottom: 0 !important; }
        .page-content td strong, .page-content td b { font-weight: 700; color: #111827; display: inline; }
        .page-content td ul, .page-content td ol { margin: 4px 0; padding-left: 18px; }
        .page-content td li { margin-bottom: 3px; }

        /* ── Blockquote ── */
        .page-content blockquote {
          border-left: 3px solid #4caf50; padding-left: 16px;
          margin: 14px 0; color: #6b7280; font-style: italic;
        }

        /* ── Images ── */
        .page-content img { max-width: 100%; height: auto; vertical-align: middle; border-radius: 2px; }
        .page-content a img, .page-content p a img {
          display: inline !important; vertical-align: middle;
          margin: 0 3px 2px 0; max-height: 18px; width: auto;
        }
        .page-content figure.image {
          display: block; margin: 12px auto; text-align: center;
        }
        .page-content figure.image img { display: block; max-width: 100%; height: auto; margin: 0 auto; }
        .page-content figure.image.image-style-side,
        .page-content figure.image.image-style-align-right {
          float: right; margin: 4px 0 8px 16px; max-width: 48%;
        }
        .page-content figure.image.image-style-align-left {
          float: left; margin: 4px 16px 8px 0; max-width: 48%;
        }
        .page-content figure.image figcaption {
          font-size: 12px; color: #6b7280; margin-top: 4px;
          font-style: italic; text-align: center;
        }
        .page-content::after { content: ""; display: table; clear: both; }

        /* ── HR ── */
        .page-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .page-content { font-size: 14px; line-height: 1.75; }
          .page-content h2 { font-size: 16px; }
          .page-content h3 { font-size: 14.5px; }
          .page-content p { text-align: left; }
          .page-content td p { text-align: left !important; }
          .page-content figure.image.image-style-side,
          .page-content figure.image.image-style-align-right,
          .page-content figure.image.image-style-align-left {
            float: none; display: block; margin: 12px auto; max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  return {
    title: page?.title || "Page Not Found",
    description: page?.metaDescription || "",
  };
}





















// import { DbConnection } from "@/lib/Db";
// import Page from "@/models/Page";
// import { notFound } from "next/navigation";
// import Nav from "@/components/Nav/Nav";
// import PageSidebar from "@/components/PageSidebar";

// interface Props {
//   params: Promise<{ slug: string }>;
// }

// async function getPage(slug: string) {
//   try {
//     await DbConnection();
//     const page = await Page.findOne({ slug, isActive: true }).lean();
//     return page ? JSON.parse(JSON.stringify(page)) : null;
//   } catch {
//     return null;
//   }
// }

// // ── HTML clean karo ───────────────────────────────────────────────────────────
// function cleanText(raw: string): string {
//   return raw
//     .replace(/<[^>]+>/g, "")
//     .replace(/&nbsp;/gi, " ")
//     .replace(/&amp;/gi, "&")
//     .replace(/&lt;/gi, "<")
//     .replace(/&gt;/gi, ">")
//     .replace(/&quot;/gi, '"')
//     .replace(/&#\d+;/g, "")
//     .replace(/&[a-z]+;/gi, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// // ── H2 headings extract ───────────────────────────────────────────────────────
// function extractH2Headings(html: string): { id: string; text: string }[] {
//   const regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
//   const headings: { id: string; text: string }[] = [];
//   const seen = new Set<string>();
//   let match;
//   while ((match = regex.exec(html)) !== null) {
//     const text = cleanText(match[1]);
//     if (!text || seen.has(text)) continue;
//     seen.add(text);
//     const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
//     headings.push({ id, text });
//   }
//   return headings;
// }

// // ── H3 headings extract ───────────────────────────────────────────────────────
// function extractH3Headings(html: string): { id: string; text: string }[] {
//   const regex = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
//   const headings: { id: string; text: string }[] = [];
//   const seen = new Set<string>();
//   let match;
//   while ((match = regex.exec(html)) !== null) {
//     const text = cleanText(match[1]);
//     if (!text || seen.has(text)) continue;
//     seen.add(text);
//     const id = "h3-" + text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 55);
//     headings.push({ id, text });
//   }
//   return headings;
// }

// // ── Person names extract (Editorial pages) ────────────────────────────────────
// function extractPersonNames(html: string): { id: string; text: string }[] {
//   const regex = /<p[^>]*>\s*<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi;
//   const names: { id: string; text: string }[] = [];
//   const seen = new Set<string>();
//   let match;
//   while ((match = regex.exec(html)) !== null) {
//     const text = cleanText(match[1]);
//     if (
//       !text || seen.has(text) || text.length > 70 ||
//       /^(email|country|department|institute|university|professor|doctor|dr\.|prof\.|http)/i.test(text)
//     ) continue;
//     seen.add(text);
//     const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
//     names.push({ id, text });
//   }
//   return names;
// }

// // ── Article link titles extract (Ahead of Print page) ────────────────────────
// function extractLinkTitles(html: string): { id: string; text: string }[] {
//   const regex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
//   const titles: { id: string; text: string }[] = [];
//   const seen = new Set<string>();
//   let counter = 0;
//   let match;
//   while ((match = regex.exec(html)) !== null) {
//     const text = cleanText(match[2]);
//     if (!text || seen.has(text) || text.length < 10 || text.length > 250) continue;
//     // Navigation links skip karo
//     if (/^(abstract|pdf|home|about|read more|click here|here|more|submit|contact|login)/i.test(text)) continue;
//     seen.add(text);
//     counter++;
//     titles.push({ id: `article-${counter}`, text });
//   }
//   return titles;
// }

// // ── H2 ids inject ────────────────────────────────────────────────────────────
// function injectH2Ids(html: string): string {
//   const seen = new Set<string>();
//   return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_, attrs, content) => {
//     const text = cleanText(content);
//     if (!text) return `<h2${attrs}>${content}</h2>`;
//     let id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
//     if (seen.has(id)) id = `${id}-${seen.size}`;
//     seen.add(id);
//     const newAttrs = attrs.includes("id=")
//       ? attrs.replace(/id="[^"]*"/, `id="${id}"`)
//       : ` id="${id}"${attrs}`;
//     return `<h2${newAttrs}>${content}</h2>`;
//   });
// }

// // ── H3 ids inject ────────────────────────────────────────────────────────────
// function injectH3Ids(html: string): string {
//   const seen = new Set<string>();
//   return html.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/gi, (_, attrs, content) => {
//     const text = cleanText(content);
//     if (!text) return `<h3${attrs}>${content}</h3>`;
//     let id = "h3-" + text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 55);
//     if (seen.has(id)) id = `${id}-${seen.size}`;
//     seen.add(id);
//     const newAttrs = attrs.includes("id=")
//       ? attrs.replace(/id="[^"]*"/, `id="${id}"`)
//       : ` id="${id}"${attrs}`;
//     return `<h3${newAttrs}>${content}</h3>`;
//   });
// }

// // ── Person ids inject ─────────────────────────────────────────────────────────
// function injectPersonIds(html: string): string {
//   const seen = new Set<string>();
//   return html.replace(
//     /(<p)([^>]*>)\s*(<(?:strong|b)[^>]*>)([\s\S]*?)(<\/(?:strong|b)>)/gi,
//     (full, ptag, pclose, openTag, name, closeTag) => {
//       const text = cleanText(name);
//       if (
//         !text || seen.has(text) || text.length > 70 ||
//         /^(email|country|department|institute|university|professor|doctor|dr\.|prof\.|http)/i.test(text)
//       ) return full;
//       seen.add(text);
//       const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 60);
//       return `${ptag} id="${id}"${pclose}${openTag}${name}${closeTag}`;
//     }
//   );
// }

// // ── Article link ids inject (Ahead of Print) ──────────────────────────────────
// function injectLinkIds(html: string): string {
//   let counter = 0;
//   const seen = new Set<string>();
//   return html.replace(/<a([^>]*href="[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi, (full, attrs, content) => {
//     const text = cleanText(content);
//     if (!text || seen.has(text) || text.length < 10 || text.length > 250) return full;
//     if (/^(abstract|pdf|home|about|read more|click here|here|more|submit|contact|login)/i.test(text)) return full;
//     seen.add(text);
//     counter++;
//     const id = `article-${counter}`;
//     // id already hai to replace, nahi hai to add karo
//     if (attrs.includes("id=")) {
//       return `<a${attrs.replace(/id="[^"]*"/, `id="${id}"`)}>${content}</a>`;
//     }
//     return `<a${attrs} id="${id}">${content}</a>`;
//   });
// }

// // ── Best headings extract — showSidebar DB field ke basis pe ─────────────────
// function extractBestHeadings(
//   html: string,
//   slug: string
// ): {
//   headings: { id: string; text: string }[];
//   mode: "headings" | "persons";
//   processedHtml: string;
// } {
//   // Editorial pages → person names
//   const editorialSlugs = ["editorial", "editorial-board"];
//   if (editorialSlugs.some((s) => slug === s || slug.startsWith(s))) {
//     const headings = extractPersonNames(html);
//     return { headings, mode: "persons", processedHtml: injectPersonIds(html) };
//   }

//   // Ahead of Print → article link titles
//   if (slug === "ahead") {
//     const links = extractLinkTitles(html);
//     if (links.length >= 1) {
//       return {
//         headings: links,
//         mode: "headings",
//         processedHtml: injectLinkIds(html),
//       };
//     }
//   }

//   // Try H2 headings (2+)
//   const h2 = extractH2Headings(html);
//   if (h2.length >= 2) {
//     return { headings: h2, mode: "headings", processedHtml: injectH2Ids(html) };
//   }

//   // Try H3 headings (2+)
//   const h3 = extractH3Headings(html);
//   if (h3.length >= 2) {
//     return { headings: h3, mode: "headings", processedHtml: injectH3Ids(injectH2Ids(html)) };
//   }

//   // H2 sirf 1 hai to bhi dikhao
//   if (h2.length === 1) {
//     return { headings: h2, mode: "headings", processedHtml: injectH2Ids(html) };
//   }

//   // Kuch nahi mila → no sidebar
//   return { headings: [], mode: "headings", processedHtml: injectH2Ids(html) };
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export default async function DynamicPage({ params }: Props) {
//   const { slug } = await params;
//   const page = await getPage(slug);
//   if (!page) return notFound();

//   const html = page.content || "";

//   // DB field: showSidebar — admin se control hota hai (default true)
//   const showSidebar: boolean = page.showSidebar !== false;

//   let headings: { id: string; text: string }[] = [];
//   let mode: "headings" | "persons" = "headings";
//   let processedHtml = html;

//   if (showSidebar) {
//     const result = extractBestHeadings(html, slug);
//     headings = result.headings;
//     mode = result.mode;
//     processedHtml = result.processedHtml;
//   } else {
//     processedHtml = injectH2Ids(html);
//   }

//   const sidebarVisible = showSidebar && headings.length >= 1;

//   return (
//     <div className="min-h-screen bg-white">
  
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

//         {/* Page Title */}
//         <h1 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-tight mb-1">
//           {page.title}
//         </h1>
//         <div className="w-full h-[3px] bg-[#4caf50] mt-2 mb-5 sm:mb-7" />

//         {/* Mobile sidebar */}
//         {sidebarVisible && (
//           <div className="lg:hidden mb-4">
//             <PageSidebar headings={headings} mode={mode} />
//           </div>
//         )}

//         {/* Desktop layout */}
//         <div className="lg:flex lg:gap-10 lg:items-start">

//           {/* Desktop sidebar */}
//           {sidebarVisible && (
//             <aside className="hidden lg:block w-[230px] shrink-0 sticky top-6 self-start">
//               <PageSidebar headings={headings} mode={mode} />
//             </aside>
//           )}

//           {/* Main content */}
//           <div className="flex-1 min-w-0 overflow-x-auto">
//             <div
//               className="page-content"
//               dangerouslySetInnerHTML={{ __html: processedHtml }}
//             />
//           </div>

//         </div>
//       </main>

//       <style>{`
//         /* ── Base ── */
//         .page-content {
//           font-size: 14.5px;
//           line-height: 1.8;
//           color: #333333;
//           font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
//         }

//         /* ── Headings ── */
//         .page-content h1 {
//           font-size: 22px; font-weight: 700; color: #111827;
//           margin: 32px 0 14px 0;
//         }
//         .page-content h2 {
//           font-size: 18px; font-weight: 700; color: #111827;
//           margin: 32px 0 12px 0; padding-bottom: 6px;
//           border-bottom: 1px solid #e5e7eb;
//           scroll-margin-top: 24px; line-height: 1.3;
//         }
//         .page-content h2:first-child { margin-top: 0; }
//         .page-content h3 {
//           font-size: 15px; font-weight: 700; color: #1f2937;
//           margin: 18px 0 6px 0; scroll-margin-top: 24px;
//         }
//         .page-content h4 {
//           font-size: 14px; font-weight: 700; color: #374151;
//           margin: 14px 0 5px 0;
//         }

//         /* ── Paragraphs ── */
//         .page-content p {
//           margin: 0 0 12px 0; text-align: justify;
//           scroll-margin-top: 24px;
//         }

//         /* ── Lists ── */
//         .page-content ul, .page-content ol {
//           margin: 6px 0 14px 0; padding-left: 22px;
//         }
//         .page-content li { margin-bottom: 6px; }

//         /* ── Links ── */
//         .page-content a { color: #1a73e8; text-decoration: underline; }
//         .page-content a:hover { color: #1558b0; }

//         /* ── Bold ── */
//         .page-content strong, .page-content b { font-weight: 700; color: #111827; }

//         /* ── Article cards (Ahead of Print) ── */
//         .page-content .article-card {
//           border: 1px solid #e5e7eb;
//           border-radius: 8px;
//           padding: 16px 20px;
//           margin-bottom: 16px;
//           background: #fff;
//           scroll-margin-top: 24px;
//         }
//         .page-content .article-card:hover {
//           border-color: #4caf50;
//           box-shadow: 0 1px 6px rgba(0,0,0,0.07);
//         }

//         /* ── TABLE ── */
//         .page-content figure.table {
//           width: 100%; margin: 20px 0;
//           overflow-x: auto; display: block;
//           -webkit-overflow-scrolling: touch;
//         }
//         .page-content figure.table table,
//         .page-content table {
//           width: 100%; border-collapse: collapse;
//           font-size: 13.5px; display: table !important;
//           table-layout: auto; border: 1px solid #d1d5db;
//         }
//         .page-content table { margin: 16px 0; }
//         .page-content th {
//           background: #f8f9fa; border: 1px solid #d1d5db;
//           padding: 10px 14px; text-align: left;
//           font-weight: 700; color: #1f2937; vertical-align: top;
//         }
//         .page-content td {
//           border: 1px solid #d1d5db; padding: 9px 13px;
//           vertical-align: top; word-break: break-word;
//         }
//         .page-content td p { margin: 0 0 4px 0 !important; text-align: left !important; }
//         .page-content td p:last-child { margin-bottom: 0 !important; }
//         .page-content td strong, .page-content td b { font-weight: 700; color: #111827; display: inline; }
//         .page-content td ul, .page-content td ol { margin: 4px 0; padding-left: 18px; }
//         .page-content td li { margin-bottom: 3px; }

//         /* ── Blockquote ── */
//         .page-content blockquote {
//           border-left: 3px solid #4caf50; padding-left: 16px;
//           margin: 14px 0; color: #6b7280; font-style: italic;
//         }

//         /* ── Images ── */
//         .page-content img { max-width: 100%; height: auto; vertical-align: middle; border-radius: 2px; }
//         .page-content a img, .page-content p a img {
//           display: inline !important; vertical-align: middle;
//           margin: 0 3px 2px 0; max-height: 18px; width: auto;
//         }
//         .page-content figure.image {
//           display: block; margin: 12px auto; text-align: center;
//         }
//         .page-content figure.image img { display: block; max-width: 100%; height: auto; margin: 0 auto; }
//         .page-content figure.image.image-style-side,
//         .page-content figure.image.image-style-align-right {
//           float: right; margin: 4px 0 8px 16px; max-width: 48%;
//         }
//         .page-content figure.image.image-style-align-left {
//           float: left; margin: 4px 16px 8px 0; max-width: 48%;
//         }
//         .page-content figure.image figcaption {
//           font-size: 12px; color: #6b7280; margin-top: 4px;
//           font-style: italic; text-align: center;
//         }
//         .page-content::after { content: ""; display: table; clear: both; }

//         /* ── HR ── */
//         .page-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }

//         /* ── Mobile ── */
//         @media (max-width: 640px) {
//           .page-content { font-size: 14px; line-height: 1.75; }
//           .page-content h2 { font-size: 16px; }
//           .page-content h3 { font-size: 14.5px; }
//           .page-content p { text-align: left; }
//           .page-content td p { text-align: left !important; }
//           .page-content figure.image.image-style-side,
//           .page-content figure.image.image-style-align-right,
//           .page-content figure.image.image-style-align-left {
//             float: none; display: block; margin: 12px auto; max-width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export async function generateMetadata({ params }: Props) {
//   const { slug } = await params;
//   const page = await getPage(slug);
//   return {
//     title: page?.title || "Page Not Found",
//     description: page?.metaDescription || "",
//   };
// }