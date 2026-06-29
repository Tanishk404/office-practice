"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdAdd, MdDelete, MdSave, MdEdit, MdImage, MdClose } from "react-icons/md";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HighlightArticle {
  _id?: string;
  section: string;
  title: string;
  authorDetails: string;
  citation: string;
}

interface IndexingLogo {
  _id?: string;
  name: string;
  imageUrl: string;
}

interface ArticleOption {
  _id: string;
  articleTitle: string;
  articleType?: string;
  journalTitle?: string;
  volume?: string | number;
  issue?: string | number;
  abstract?: string;
}

interface MostPopularArticle {
  _id?: string;
  articleId: string | ArticleOption | null;
  customSummary?: string;
}

interface HomepageData {
  _id?: string;
  issn_print: string;
  issn_online: string;
  coden: string;
  aboutText: string;
  coverImageUrl: string;
  highlights: HighlightArticle[];
  indexing: IndexingLogo[];
  mostPopular: MostPopularArticle[];
}

const EMPTY_HOMEPAGE: HomepageData = {
  issn_print: "",
  issn_online: "",
  coden: "",
  aboutText: "",
  coverImageUrl: "",
  highlights: [],
  indexing: [],
  mostPopular: [],
};

function getArticleIdValue(articleId: MostPopularArticle["articleId"]): string {
  if (!articleId) return "";
  if (typeof articleId === "string") return articleId;
  return articleId._id || "";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomepageManager() {
  const [data, setData] = useState<HomepageData>(EMPTY_HOMEPAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"issue" | "highlights" | "indexing" | "popular">("issue");
  const coverImageRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const [allArticles, setAllArticles] = useState<ArticleOption[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // ✅ FIX: indexing logos — har row ke liye selected file + local preview
  // (parallel array, data.indexing ke saath index se sync rehta hai)
  const [indexingFiles, setIndexingFiles] = useState<(File | null)[]>([]);
  const [indexingPreviews, setIndexingPreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchHomepage();
  }, []);

  useEffect(() => {
    if (activeTab === "popular" && allArticles.length === 0) fetchAllArticles();
  }, [activeTab]);

  const fetchHomepage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/homepage");
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
        if (result.data.coverImageUrl) setCoverPreview(result.data.coverImageUrl);
        // ✅ FIX: indexing files/previews arrays ko data ke length ke hisab se reset karo
        const len = result.data.indexing?.length || 0;
        setIndexingFiles(new Array(len).fill(null));
        setIndexingPreviews(new Array(len).fill(""));
      }
    } catch (err) {
      console.error("Failed to load homepage data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllArticles = async () => {
    setLoadingArticles(true);
    try {
      const res = await fetch("/api/articles");
      const result = await res.json();
      if (res.ok && result.user) {
        setAllArticles(result.user);
      }
    } catch (err) {
      console.error("Failed to load articles list", err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleCoverImageChange = () => {
    const file = coverImageRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ FIX: generic helper — cover image aur indexing logos dono yahi use karenge
  const uploadImageToCloudinary = async (file: File, folder: string): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload-image", { method: "POST", body: fd });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Image upload failed");
    return result.url as string;
  };

  // ─── Save / Submit ────────────────────────────────────────────────────────
  const handleSave = async () => {
    const hasEmptyPopular = data.mostPopular.some((p) => !getArticleIdValue(p.articleId));
    if (hasEmptyPopular) {
      alert("Please select an article for every 'Most Popular' entry, or remove the empty one.");
      return;
    }

    setSaving(true);
    try {
      let finalData: any = { ...data };

      // Cover image upload (unchanged)
      const coverFile = coverImageRef.current?.files?.[0];
      if (coverFile) {
        if (coverFile.size > 2 * 1024 * 1024) {
          alert("Cover image must be under 2MB!");
          setSaving(false);
          return;
        }
        const uploadedUrl = await uploadImageToCloudinary(coverFile, "homepage_covers");
        finalData = { ...finalData, coverImageUrl: uploadedUrl };
        setData((d) => ({ ...d, coverImageUrl: uploadedUrl }));
      }

      // ✅ FIX: jin indexing rows mein nayi file select hui hai, unko upload karo
      // aur unka imageUrl naye Cloudinary URL se replace karo. Jin rows mein file
      // nahi chuni gayi, unka purana imageUrl (agar koi hai) waise hi rahega.
      const updatedIndexing = [...finalData.indexing];
      for (let i = 0; i < updatedIndexing.length; i++) {
        const file = indexingFiles[i];
        if (file) {
          if (file.size > 1 * 1024 * 1024) {
            alert(`Logo "${updatedIndexing[i].name || "Untitled"}" must be under 1MB!`);
            setSaving(false);
            return;
          }
          const uploadedUrl = await uploadImageToCloudinary(file, "indexing_logos");
          updatedIndexing[i] = { ...updatedIndexing[i], imageUrl: uploadedUrl };
        }
      }
      finalData.indexing = updatedIndexing;
      setData((d) => ({ ...d, indexing: updatedIndexing }));

      finalData.mostPopular = data.mostPopular.map((p) => ({
        articleId: getArticleIdValue(p.articleId),
        customSummary: p.customSummary || "",
      }));

      const method = finalData._id ? "PUT" : "POST";
      const res = await fetch("/api/homepage", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const result = await res.json();

      if (res.ok) {
        alert("Homepage updated successfully!");
        // ✅ FIX: save ke baad selected files clear kar do (taaki dobara upload na ho)
        setIndexingFiles(new Array(updatedIndexing.length).fill(null));
        setIndexingPreviews(new Array(updatedIndexing.length).fill(""));
        await fetchHomepage();
      } else {
        alert("Error: " + (result.error || result.msg));
      }
    } catch (err: any) {
      console.error(err);
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Highlight Helpers ────────────────────────────────────────────────────
  const addHighlight = () =>
    setData((d) => ({
      ...d,
      highlights: [...d.highlights, { section: "EDITORIAL", title: "", authorDetails: "", citation: "" }],
    }));

  const updateHighlight = (i: number, field: keyof HighlightArticle, val: string) =>
    setData((d) => {
      const h = [...d.highlights];
      h[i] = { ...h[i], [field]: val };
      return { ...d, highlights: h };
    });

  const removeHighlight = (i: number) =>
    setData((d) => ({ ...d, highlights: d.highlights.filter((_, idx) => idx !== i) }));

  // ─── Indexing Helpers — FIXED ─────────────────────────────────────────────
  const addIndexing = () => {
    setData((d) => ({ ...d, indexing: [...d.indexing, { name: "", imageUrl: "" }] }));
    setIndexingFiles((f) => [...f, null]);
    setIndexingPreviews((p) => [...p, ""]);
  };

  const updateIndexingName = (i: number, val: string) =>
    setData((d) => {
      const idx = [...d.indexing];
      idx[i] = { ...idx[i], name: val };
      return { ...d, indexing: idx };
    });

  // ✅ FIX: URL input ke jagah ab yeh — file choose karke local preview dikhata hai
  const handleIndexingFileChange = (i: number, file: File | null) => {
    if (!file) return;
    setIndexingFiles((f) => {
      const updated = [...f];
      updated[i] = file;
      return updated;
    });
    const reader = new FileReader();
    reader.onload = (e) => {
      setIndexingPreviews((p) => {
        const updated = [...p];
        updated[i] = e.target?.result as string;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeIndexing = (i: number) => {
    setData((d) => ({ ...d, indexing: d.indexing.filter((_, idx) => idx !== i) }));
    setIndexingFiles((f) => f.filter((_, idx) => idx !== i));
    setIndexingPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  // ─── Most Popular Helpers ─────────────────────────────────────────────────
  const addPopular = () =>
    setData((d) => ({
      ...d,
      mostPopular: [...d.mostPopular, { articleId: "", customSummary: "" }],
    }));

  const updatePopularArticle = (i: number, articleId: string) =>
    setData((d) => {
      const p = [...d.mostPopular];
      p[i] = { ...p[i], articleId };
      return { ...d, mostPopular: p };
    });

  const updatePopularSummary = (i: number, val: string) =>
    setData((d) => {
      const p = [...d.mostPopular];
      p[i] = { ...p[i], customSummary: val };
      return { ...d, mostPopular: p };
    });

  const removePopular = (i: number) =>
    setData((d) => ({ ...d, mostPopular: d.mostPopular.filter((_, idx) => idx !== i) }));

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-[#4caf50] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Homepage Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">Control what appears on the public journal homepage.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#4caf50] hover:bg-[#419b45] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-md transition shadow-sm"
        >
          <MdSave size={16} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm w-fit">
        {(["issue", "highlights", "indexing", "popular"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition ${
              activeTab === tab
                ? "bg-[#1a1a2e] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {tab === "issue" ? "Current Issue" : tab === "highlights" ? "Highlights" : tab === "indexing" ? "Indexing" : "Most Popular"}
          </button>
        ))}
      </div>

      {/* ── Tab: Current Issue ── (UNCHANGED) */}
      {activeTab === "issue" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader title="Current Issue Details" subtitle="ISSN, CODEN, About text and cover image" />
          <div className="p-6 space-y-5">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                {coverPreview ? (
                  <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setCoverPreview(""); setData((d) => ({ ...d, coverImageUrl: "" })); }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <MdClose size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-36 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400">
                    <MdImage size={24} />
                    <span className="text-[10px]">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className={labelCls}>Cover Image</label>
                <input
                  type="file"
                  ref={coverImageRef}
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-[#1a1a2e] file:text-white file:cursor-pointer file:font-semibold"
                />
                <p className="text-[11px] text-gray-400">Recommended: 280×360px, JPG/PNG, max 2MB</p>
                {data.coverImageUrl && !coverImageRef.current?.files?.[0] && (
                  <p className="text-[11px] text-green-600">✓ Current image saved in DB</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <HField label="ISSN (Print)">
                <input type="text" value={data.issn_print} placeholder="e.g. 2581-8236"
                  onChange={(e) => setData({ ...data, issn_print: e.target.value })} className={inputCls} />
              </HField>
              <HField label="Online ISSN">
                <input type="text" value={data.issn_online} placeholder="e.g. 2581-916X"
                  onChange={(e) => setData({ ...data, issn_online: e.target.value })} className={inputCls} />
              </HField>
              <HField label="CODEN">
                <input type="text" value={data.coden} placeholder="e.g. IJNAQ"
                  onChange={(e) => setData({ ...data, coden: e.target.value })} className={inputCls} />
              </HField>
            </div>

            <HField label="About Text">
              <textarea rows={5} value={data.aboutText} placeholder="Enter journal description..."
                onChange={(e) => setData({ ...data, aboutText: e.target.value })}
                className={inputCls + " resize-y"} />
            </HField>
          </div>
        </div>
      )}

      {/* ── Tab: Highlights ── (UNCHANGED) */}
      {activeTab === "highlights" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            title="Current Issue Highlights"
            subtitle="Articles shown in the highlights section"
            action={
              <button onClick={addHighlight}
                className="flex items-center gap-1 bg-[#1e88e5] hover:bg-[#1565c0] text-white text-xs font-bold px-3 py-1.5 rounded-md transition">
                <MdAdd size={14} /> Add Article
              </button>
            }
          />
          <div className="p-6 space-y-4">
            {data.highlights.length === 0 && (
              <EmptyState label="No highlights yet. Click 'Add Article' to begin." />
            )}
            {data.highlights.map((h, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 relative">
                <div className="absolute top-3 right-3">
                  <button onClick={() => removeHighlight(i)}
                    className="text-red-400 hover:text-red-600 transition">
                    <MdDelete size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                  <HField label="Section Label">
                    <select value={h.section} onChange={(e) => updateHighlight(i, "section", e.target.value)}
                      className={inputCls + " bg-white"}>
                      <option>EDITORIAL</option>
                      <option>ORIGINAL RESEARCH</option>
                      <option>REVIEW ARTICLE</option>
                      <option>CASE REPORT</option>
                      <option>SHORT COMMUNICATION</option>
                    </select>
                  </HField>
                  <HField label="Author Details">
                    <input type="text" value={h.authorDetails} placeholder="e.g. John Doe, Jane Smith"
                      onChange={(e) => updateHighlight(i, "authorDetails", e.target.value)} className={inputCls} />
                  </HField>
                </div>
                <HField label="Article Title">
                  <input type="text" value={h.title} placeholder="Enter article title..."
                    onChange={(e) => updateHighlight(i, "title", e.target.value)} className={inputCls} />
                </HField>
                <HField label="Citation">
                  <input type="text" value={h.citation} placeholder="e.g. IP Indian Journal of Neurosciences. 12(1):1-2, 2026."
                    onChange={(e) => updateHighlight(i, "citation", e.target.value)} className={inputCls} />
                </HField>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Indexing — FIXED (file picker instead of URL text) ── */}
      {activeTab === "indexing" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            title="Indexing"
            subtitle="Logos shown in the indexing sidebar"
            action={
              <button onClick={addIndexing}
                className="flex items-center gap-1 bg-[#1e88e5] hover:bg-[#1565c0] text-white text-xs font-bold px-3 py-1.5 rounded-md transition">
                <MdAdd size={14} /> Add Indexing
              </button>
            }
          />
          <div className="p-6 space-y-4">
            {data.indexing.length === 0 && (
              <EmptyState label="No indexing entries. Click 'Add Indexing' to begin." />
            )}
            {data.indexing.map((idx, i) => {
              // ✅ FIX: preview priority — abhi-abhi choose ki gayi file > pehle se saved imageUrl
              const previewSrc = indexingPreviews[i] || idx.imageUrl;
              return (
                <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <HField label="Indexing Name">
                      <input type="text" value={idx.name} placeholder="e.g. Google Scholar"
                        onChange={(e) => updateIndexingName(i, e.target.value)} className={inputCls} />
                    </HField>
                    <HField label="Logo Image">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIndexingFileChange(i, e.target.files?.[0] || null)}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-[#1a1a2e] file:text-white file:cursor-pointer file:font-semibold"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">PNG/JPG, max 1MB</p>
                    </HField>
                  </div>
                  {previewSrc ? (
                    <img src={previewSrc} alt={idx.name || "logo"} className="w-16 h-10 object-contain border rounded bg-white p-1 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-10 flex items-center justify-center border border-dashed rounded bg-white text-gray-300 flex-shrink-0">
                      <MdImage size={18} />
                    </div>
                  )}
                  <button onClick={() => removeIndexing(i)}
                    className="text-red-400 hover:text-red-600 transition flex-shrink-0">
                    <MdDelete size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab: Most Popular ── (UNCHANGED from last fix) */}
      {activeTab === "popular" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <SectionHeader
            title="Most Popular Articles"
            subtitle="Select existing articles to feature in the right sidebar"
            action={
              <button onClick={addPopular}
                className="flex items-center gap-1 bg-[#1e88e5] hover:bg-[#1565c0] text-white text-xs font-bold px-3 py-1.5 rounded-md transition">
                <MdAdd size={14} /> Add Article
              </button>
            }
          />
          <div className="p-6 space-y-4">
            {loadingArticles && (
              <p className="text-xs text-gray-400">Loading articles list…</p>
            )}
            {!loadingArticles && allArticles.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                No articles found in the database yet. Add an article first from "Add Article", then come back here to feature it.
              </p>
            )}
            {data.mostPopular.length === 0 && (
              <EmptyState label="No popular articles. Click 'Add Article' to begin." />
            )}
            {data.mostPopular.map((p, i) => {
              const selectedId = getArticleIdValue(p.articleId);
              const selectedArticle = allArticles.find((a) => a._id === selectedId);

              return (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 relative">
                  <div className="absolute top-3 right-3">
                    <button onClick={() => removePopular(i)}
                      className="text-red-400 hover:text-red-600 transition">
                      <MdDelete size={16} />
                    </button>
                  </div>

                  <div className="pr-6">
                    <HField label="Select Article">
                      <select
                        value={selectedId}
                        onChange={(e) => updatePopularArticle(i, e.target.value)}
                        className={inputCls + " bg-white"}
                      >
                        <option value="">— Select an article —</option>
                        {allArticles.map((art) => (
                          <option key={art._id} value={art._id}>
                            {art.articleTitle} (Vol {art.volume}, Issue {art.issue})
                          </option>
                        ))}
                      </select>
                    </HField>
                  </div>

                  {selectedArticle && (
                    <div className="text-xs text-gray-600 bg-white border border-gray-200 rounded-md p-2.5 space-y-0.5 pr-6">
                      <p><span className="font-bold text-gray-500">Type:</span> {selectedArticle.articleType || "—"}</p>
                      <p><span className="font-bold text-gray-500">Journal:</span> {selectedArticle.journalTitle || "—"}</p>
                      <p><span className="font-bold text-gray-500">Vol/Issue:</span> {selectedArticle.volume}/{selectedArticle.issue}</p>
                    </div>
                  )}

                  <HField label="Custom Summary (optional — leave blank to auto-use abstract)">
                    <textarea rows={2} value={p.customSummary || ""} placeholder="Leave blank to show abstract excerpt automatically..."
                      onChange={(e) => updatePopularSummary(i, e.target.value)}
                      className={inputCls + " resize-none"} />
                  </HField>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Save Button */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#4caf50] hover:bg-[#419b45] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-md transition shadow-sm"
        >
          <MdSave size={16} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

    </div>
  );
}

// ─── Small Helpers ────────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-gray-300 px-3 py-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#4caf50] focus:border-[#4caf50] text-gray-800";
const labelCls = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5";

function HField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionHeader({
  title, subtitle, action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
      {label}
    </div>
  );
}