"use client";

import AbstractEditor from "@/components/AbstractEditor";
import React, { useState, useRef, useEffect } from "react";
import {
  MdLogout, MdArticle, MdAdd, MdDelete, MdHome, MdMenu, MdClose,
  MdWebAsset, MdPages, MdMenuBook, MdEdit, MdSave, MdCancel, MdRefresh, MdDragIndicator
} from "react-icons/md";
import HomepageManager from "@/components/HomepageManager";
import { signOut } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "home" | "add" | "homepage" | "pages" | "navmanager";

interface Article {
  id: string;
  journalTitle: string;
  articleTitle: string;
  volume: string;
  issue: string;
  articleType: string;
  status: string;
  createdAt: string;
}

interface ArticleFormData {
  journalTitle: string;
  volume: string;
  issue: string;
  doiId: string;
  articleTitle: string;
  abstract: string;
  keywords: string;
  authorsList: {
    firstName: string;
    lastName: string;
    orcid: string;
    correspondingAuthor: string;
  }[];
  page: string;
  license: string;
  articleType: string;
  accessType: string;
  receivedDate: string;
  acceptedDate: string;
  onlineDate: string;
  status: string;
}

interface SubItem {
  label: string;
  slug: string;
  isExternal: boolean;
}

interface NavMenu {
  _id?: string;
  title: string;
  order: number;
  type?: "single" | "dropdown";
  slug?: string;
  isExternal?: boolean;
  items: SubItem[];
  isActive: boolean;
}

interface Page {
  _id?: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  isActive: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_FORM: ArticleFormData = {
  journalTitle: "", volume: "", issue: "", doiId: "", articleTitle: "",
  abstract: "", keywords: "",
  authorsList: [{ firstName: "", lastName: "", orcid: "", correspondingAuthor: "No" }],
  page: "", license: "", articleType: "", accessType: "Open",
  receivedDate: "", acceptedDate: "", onlineDate: "", status: "Active",
};

const EMPTY_MENU: NavMenu = {
  title: "", order: 0, type: "dropdown", slug: "", isExternal: false, items: [], isActive: true,
};

const EMPTY_PAGE: Page = { slug: "", title: "", content: "", metaDescription: "", isActive: true };

const PRESET_SLUGS = [
  "about", "contact-us", "author-instructions", "reviewer-instructions",
  "editorial", "publication-charges", "publication-ethics",
  "subscription", "call-for-papers", "archives", "current", "ahead",
];

const TYPE_ORDER = [
  "Editorial", "Original Research Article", "Review Article", "Case Report", "Short Communication",
];

const TYPE_COLORS: Record<string, string> = {
  "Editorial": "bg-red-100 text-red-700",
  "Original Research Article": "bg-green-100 text-green-700",
  "Review Article": "bg-blue-100 text-blue-700",
  "Case Report": "bg-orange-100 text-orange-700",
  "Short Communication": "bg-purple-100 text-purple-700",
};

const inputCls =
  "w-full border border-gray-300 px-3 py-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#4caf50] focus:border-[#4caf50] text-gray-800 bg-white";

// ─── Group articles by type ───────────────────────────────────────────────────
function groupArticlesByType(articles: Article[]): [string, Article[]][] {
  const map: Record<string, Article[]> = {};
  for (const a of articles) {
    const key = a.articleType || "Other";
    if (!map[key]) map[key] = [];
    map[key].push(a);
  }
  const sorted: [string, Article[]][] = [];
  for (const t of TYPE_ORDER) {
    if (map[t]) sorted.push([t, map[t]]);
  }
  for (const [t, arts] of Object.entries(map)) {
    if (!TYPE_ORDER.includes(t)) sorted.push([t, arts]);
  }
  return sorted;
}

// ─── Format an ISO / Date value into yyyy-mm-dd for <input type="date"> ────────
function formatDateForInput(value: any): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JournalAdmin() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const articlePdfRef = useRef<HTMLInputElement>(null);
  const suppPdfRef = useRef<HTMLInputElement>(null);
  const [draggedArticleIndex, setDraggedArticleIndex] = useState<number | null>(null);

  // Article edit state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [existingArticlePdf, setExistingArticlePdf] = useState<string | null>(null);
  const [existingSupplementaryPdf, setExistingSupplementaryPdf] = useState<string | null>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const [submittingArticle, setSubmittingArticle] = useState(false);

  // Pages state
  const [pages, setPages] = useState<Page[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [savingPage, setSavingPage] = useState(false);

  // Nav state
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [editingMenu, setEditingMenu] = useState<NavMenu | null>(null);
  const [savingMenu, setSavingMenu] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedNavItemIndex, setDraggedNavItemIndex] = useState<number | null>(null);

  // ─── Articles API ──────────────────────────────────────────────────────────
  const fetchArticles = async () => {
    setLoadingArticles(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/articles");
      const result = await res.json();
      if (res.ok && result.user) {
        setArticles(
          result.user
            .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map((a: any) => ({
              id: a._id,
              journalTitle: a.journalTitle || "—",
              articleTitle: a.articleTitle || "—",
              volume: a.volume || "—",
              issue: a.issue || "—",
              articleType: a.articleType || "—",
              status: a.status || "Active",
              createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—",
            }))
        );
      } else {
        setFetchError(result.msg || "Failed to load articles.");
      }
    } catch {
      setFetchError("Network error. Could not fetch articles.");
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleRemoveArticle = async (id: string) => {
    if (!confirm("Are you sure you want to remove this article?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      let result: any = null;
      try { result = await res.json(); } catch { }
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert("Error: " + (result?.msg || `Could not delete article (status ${res.status}).`));
      }
    } catch {
      alert("Network error. The article was NOT deleted.");
    } finally {
      setDeletingId(null);
    }
  };

  // Reset the article form back to a blank "add" state
  const resetArticleForm = () => {
    setFormData(EMPTY_FORM);
    setEditingArticleId(null);
    setExistingArticlePdf(null);
    setExistingSupplementaryPdf(null);
    if (articlePdfRef.current) articlePdfRef.current.value = "";
    if (suppPdfRef.current) suppPdfRef.current.value = "";
  };

  // Used by every "Add Article" entry point so stale edit-state never leaks in
  const handleAddNewArticle = () => {
    resetArticleForm();
    navigate("add");
  };

  // Load a single article's full details into the form for editing
  const handleEditArticle = async (id: string) => {
    setEditLoadingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`);
      const result = await res.json();
      if (res.ok && result.success && result.data) {
        const a = result.data;
        setFormData({
          journalTitle: a.journalTitle || "",
          volume: a.volume || "",
          issue: a.issue || "",
          doiId: a.doiId || "",
          articleTitle: a.articleTitle || "",
          abstract: a.abstract || "",
          keywords: Array.isArray(a.keywords) ? a.keywords.join(", ") : (a.keywords || ""),
          authorsList:
            Array.isArray(a.authorsList) && a.authorsList.length > 0
              ? a.authorsList.map((au: any) => ({
                  firstName: au.firstName || "",
                  lastName: au.lastName || "",
                  orcid: au.orcid || "",
                  correspondingAuthor: au.correspondingAuthor || "No",
                }))
              : [{ firstName: "", lastName: "", orcid: "", correspondingAuthor: "No" }],
          page: a.page || "",
          license: a.license || "",
          articleType: a.articleType || "",
          accessType: a.accessType || "Open",
          receivedDate: formatDateForInput(a.receivedDate),
          acceptedDate: formatDateForInput(a.acceptedDate),
          onlineDate: formatDateForInput(a.onlineDate),
          status: a.status || "Active",
        });
        setExistingArticlePdf(a.articlePdfUrl || null);
        setExistingSupplementaryPdf(a.supplementaryPdfUrl || null);
        setEditingArticleId(id);
        if (articlePdfRef.current) articlePdfRef.current.value = "";
        if (suppPdfRef.current) suppPdfRef.current.value = "";
        setCurrentView("add");
        setSidebarOpen(false);
      } else {
        alert("Error: " + (result.error || result.msg || "Could not load this article."));
      }
    } catch {
      alert("Network error. Could not load this article for editing.");
    } finally {
      setEditLoadingId(null);
    }
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingArticleId;
    const articlePdf = articlePdfRef.current?.files?.[0];
    const suppPdf = suppPdfRef.current?.files?.[0];

    // PDF is only mandatory when creating a brand-new article.
    if (!isEdit && !articlePdf) { alert("Main Article PDF is required."); return; }
    if (articlePdf && articlePdf.size > 10 * 1024 * 1024) { alert("PDF must be under 10MB."); return; }
    if (suppPdf && suppPdf.size > 10 * 1024 * 1024) { alert("Supplementary PDF must be under 10MB."); return; }

    const fd = new FormData();
    fd.append("articleDetails", JSON.stringify(formData));
    if (articlePdf) fd.append("articlePdf", articlePdf);
    if (suppPdf) fd.append("supplementaryPdf", suppPdf);

    setSubmittingArticle(true);
    try {
      const response = await fetch(isEdit ? `/api/articles/${editingArticleId}` : "/api/articles", {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      const result = await response.json();
      if (result.success) {
        resetArticleForm();
        await fetchArticles();
        setCurrentView("home");
        alert(isEdit ? "Article updated successfully!" : "Article saved successfully!");
      } else {
        alert("Error: " + (result.error || result.msg));
      }
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmittingArticle(false);
    }
  };

  // ─── Article Drag-and-Drop ────────────────────────────────────────────────
  const handleArticleDragStart = (index: number) => setDraggedArticleIndex(index);
  const handleArticleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleArticleDrop = async (dropIndex: number) => {
    if (draggedArticleIndex === null || draggedArticleIndex === dropIndex) {
      setDraggedArticleIndex(null);
      return;
    }
    const updated = [...articles];
    const [moved] = updated.splice(draggedArticleIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setArticles(updated);
    setDraggedArticleIndex(null);
    try {
      const res = await fetch("/api/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map((a, i) => ({ id: a.id, order: i })) }),
      });
      const data = await res.json();
      if (!data.success) { alert("Reorder failed."); await fetchArticles(); }
    } catch {
      alert("Network error while reordering."); await fetchArticles();
    }
  };

  // ─── Pages API ─────────────────────────────────────────────────────────────
  const fetchPages = async () => {
    setLoadingPages(true);
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      if (data.success) setPages(data.pages);
    } catch { }
    setLoadingPages(false);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    if (!editingPage.slug || !editingPage.title) { alert("Slug and Title are required."); return; }
    setSavingPage(true);
    try {
      const isEdit = !!editingPage._id;
      const res = await fetch("/api/pages", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage),
      });
      const data = await res.json();
      if (data.success) { await fetchPages(); setEditingPage(null); alert("Page saved!"); }
      else alert("Error: " + data.msg);
    } catch { alert("Network error."); }
    setSavingPage(false);
  };

  const handleDeletePage = async (slug: string) => {
    if (!confirm(`Delete page "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) await fetchPages();
      else alert("Delete failed.");
    } catch { alert("Network error."); }
  };

  // ─── Nav API ───────────────────────────────────────────────────────────────
  const fetchMenus = async () => {
    setLoadingMenus(true);
    try {
      const res = await fetch("/api/nav?admin=true");
      const data = await res.json();
      if (data.success) setMenus(data.menus);
    } catch { }
    setLoadingMenus(false);
  };

  const handleSaveMenu = async () => {
    if (!editingMenu) return;
    if (!editingMenu.title) { setMenuError("Menu title is required."); return; }
    if (editingMenu.type === "dropdown" && editingMenu.items.length === 0) {
      setMenuError("A dropdown menu must have at least one item."); return;
    }
    if (editingMenu.type === "single" && !editingMenu.slug) {
      setMenuError("A URL or slug is required for a single link."); return;
    }
    setMenuError(null); setSavingMenu(true);
    try {
      const isNew = !editingMenu._id;
      const url = isNew ? "/api/nav" : `/api/nav/${editingMenu._id}`;
      const method = isNew ? "POST" : "PUT";
      const { order: _order, ...restMenu } = editingMenu;
      const payload = isNew ? restMenu : editingMenu;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { await fetchMenus(); setEditingMenu(null); }
      else setMenuError("Error: " + data.msg);
    } catch { setMenuError("Network error."); }
    setSavingMenu(false);
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Delete this menu?")) return;
    try {
      const res = await fetch(`/api/nav/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) await fetchMenus();
    } catch { alert("Network error."); }
  };

  // ─── Nav Drag-and-Drop ────────────────────────────────────────────────────
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) { setDraggedIndex(null); return; }
    const updated = [...menus];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, moved);
    const reordered = updated.map((m, i) => ({ ...m, order: i }));
    setMenus(reordered); setDraggedIndex(null);
    try {
      const res = await fetch("/api/nav/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reordered.map((m) => ({ id: m._id, order: m.order })) }),
      });
      const data = await res.json();
      if (!data.success) { alert("Reorder failed."); await fetchMenus(); }
    } catch { alert("Network error while reordering."); await fetchMenus(); }
  };

  // ─── Author Helpers ────────────────────────────────────────────────────────
  const handleAddAuthor = () =>
    setFormData({ ...formData, authorsList: [...formData.authorsList, { firstName: "", lastName: "", orcid: "", correspondingAuthor: "No" }] });

  const handleAuthorChange = (index: number, field: string, value: string) => {
    const updated = [...formData.authorsList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, authorsList: updated });
  };

  const handleRemoveAuthor = (index: number) => {
    const updated = [...formData.authorsList];
    updated.splice(index, 1);
    setFormData({ ...formData, authorsList: updated });
  };

  // ─── Nav Item Helpers ──────────────────────────────────────────────────────
  const addNavItem = () =>
    setEditingMenu((prev) => prev ? { ...prev, items: [...prev.items, { label: "", slug: "", isExternal: false }] } : prev);

  const updateNavItem = (idx: number, field: keyof SubItem, val: string | boolean) =>
    setEditingMenu((prev) => {
      if (!prev) return prev;
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: val };
      return { ...prev, items };
    });

  const removeNavItem = (idx: number) =>
    setEditingMenu((prev) => prev ? { ...prev, items: prev.items.filter((_, i) => i !== idx) } : prev);

  const handleNavItemDragStart = (idx: number) => setDraggedNavItemIndex(idx);
  const handleNavItemDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleNavItemDrop = (dropIdx: number) => {
    if (draggedNavItemIndex === null || draggedNavItemIndex === dropIdx) { setDraggedNavItemIndex(null); return; }
    setEditingMenu((prev) => {
      if (!prev) return prev;
      const items = [...prev.items];
      const [moved] = items.splice(draggedNavItemIndex, 1);
      items.splice(dropIdx, 0, moved);
      return { ...prev, items };
    });
    setDraggedNavItemIndex(null);
  };

  // ─── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { fetchArticles(); }, []);
  useEffect(() => { if (currentView === "pages") fetchPages(); }, [currentView]);
  useEffect(() => { if (currentView === "navmanager") fetchMenus(); }, [currentView]);

  const navigate = (view: View) => { setCurrentView(view); setSidebarOpen(false); };

  // ─── Grouped articles for display ─────────────────────────────────────────
  const groupedArticles = groupArticlesByType(articles);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans antialiased flex flex-col">

      {/* ══ Top Navbar ══ */}
      <nav className="bg-[#1a1a2e] text-white shadow-lg z-50 fixed top-0 left-0 right-0 h-14 flex items-center px-4 gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 hover:bg-white/10 rounded transition">
          {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
        <div className="text-base font-bold tracking-widest uppercase flex-1">
          <span className="text-[#4caf50]">IP</span>{" "}
          <span className="text-white/80 font-light">Journal</span>{" "}
          <span className="text-xs text-white/40 font-normal normal-case tracking-normal ml-1">Admin</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer"
        >
          <MdLogout size={14} /> Logout
        </button>
      </nav>

      <div className="flex flex-1 pt-14">

        {/* ══ Sidebar ══ */}
        <>
          {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
          <aside className={`fixed top-14 left-0 bottom-0 w-56 bg-[#1a1a2e] text-white z-40 flex flex-col transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Navigation</p>
            </div>
            <nav className="flex-1 py-3 space-y-0.5 px-2">
              <SidebarLink icon={<MdHome size={18} />} label="Articles" active={currentView === "home"} onClick={() => navigate("home")} badge={articles.length > 0 ? String(articles.length) : undefined} />
              <SidebarLink icon={<MdAdd size={18} />} label="Add Article" active={currentView === "add"} onClick={handleAddNewArticle} />
              <SidebarLink icon={<MdWebAsset size={18} />} label="Homepage" active={currentView === "homepage"} onClick={() => navigate("homepage")} />
              <SidebarLink icon={<MdPages size={18} />} label="Manage Pages" active={currentView === "pages"} onClick={() => navigate("pages")} />
              <SidebarLink icon={<MdMenuBook size={18} />} label="Nav Manager" active={currentView === "navmanager"} onClick={() => navigate("navmanager")} />
            </nav>
            <div className="px-4 py-3 border-t border-white/10">
              <p className="text-[10px] text-white/30">IP Journal Admin v2.0</p>
            </div>
          </aside>
        </>

        {/* ══ Main Content ══ */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">

          {/* ════════════════════════════════════════
              HOME — Articles List (grouped by type)
          ════════════════════════════════════════ */}
          {currentView === "home" && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 tracking-tight">Articles</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {articles.length} article{articles.length !== 1 ? "s" : ""} — grouped by type, drag <MdDragIndicator size={12} className="inline" /> to reorder within type
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchArticles} className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold px-3 py-2 rounded-md transition shadow-sm">
                    <MdRefresh size={16} />
                  </button>
                  <button onClick={handleAddNewArticle} className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-4 py-2 rounded-md transition shadow-sm">
                    <MdAdd size={16} /> Add Article
                  </button>
                </div>
              </div>

              {loadingArticles ? (
                <LoadingCard text="Loading articles..." />
              ) : fetchError ? (
                <ErrorCard message={fetchError} onRetry={fetchArticles} />
              ) : articles.length === 0 ? (
                <EmptyCard
                  icon={<MdArticle size={40} className="text-gray-300" />}
                  title="No articles yet"
                  subtitle='Click "Add Article" to submit your first journal article.'
                  action={<button onClick={handleAddNewArticle} className="mt-2 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-5 py-2 rounded-md transition">Add Article</button>}
                />
              ) : (
                <div className="space-y-4">
                  {groupedArticles.map(([type, typeArticles]) => {
                    // Find the global indices of these articles in the flat articles array
                    const globalIndices = typeArticles.map(ta => articles.findIndex(a => a.id === ta.id));

                    return (
                      <div key={type} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Type Header */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${TYPE_COLORS[type] || "bg-gray-100 text-gray-600"}`}>
                            {type}
                          </span>
                          <span className="text-xs text-gray-400">{typeArticles.length} article{typeArticles.length !== 1 ? "s" : ""}</span>
                          <span className="text-xs text-gray-300 ml-1">— drag to reorder within this type</span>
                        </div>

                        {/* Articles in this type group */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-100">
                                <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 w-12">#</th>
                                <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Journal</th>
                                <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Article Title</th>
                                <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Vol/Issue</th>
                                <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                                <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Added</th>
                                <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {typeArticles.map((article, localIdx) => {
                                const globalIdx = globalIndices[localIdx];
                                return (
                                  <tr
                                    key={article.id}
                                    draggable
                                    onDragStart={() => handleArticleDragStart(globalIdx)}
                                    onDragOver={handleArticleDragOver}
                                    onDrop={() => handleArticleDrop(globalIdx)}
                                    className={`hover:bg-gray-50 transition cursor-move ${draggedArticleIndex === globalIdx ? "opacity-40 bg-green-50" : ""}`}
                                  >
                                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                                      <span className="flex items-center gap-1.5">
                                        <MdDragIndicator size={16} className="text-gray-300 flex-shrink-0" />
                                        {globalIdx + 1}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 font-medium max-w-[130px] truncate">{article.journalTitle}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-[220px] truncate">{article.articleTitle}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">Vol {article.volume} / {article.issue}</td>
                                    <td className="px-4 py-3"><StatusBadge status={article.status} /></td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{article.createdAt}</td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-3">
                                        <button
                                          onClick={() => handleEditArticle(article.id)}
                                          disabled={editLoadingId === article.id}
                                          className="flex items-center gap-1 text-blue-500 hover:text-blue-700 disabled:opacity-40 text-xs font-semibold transition"
                                        >
                                          <MdEdit size={14} /> {editLoadingId === article.id ? "Loading..." : "Edit"}
                                        </button>
                                        <button
                                          onClick={() => handleRemoveArticle(article.id)}
                                          disabled={deletingId === article.id}
                                          className="flex items-center gap-1 text-red-500 hover:text-red-700 disabled:opacity-40 text-xs font-semibold transition"
                                        >
                                          <MdDelete size={14} /> {deletingId === article.id ? "Removing..." : "Remove"}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════
              ADD / EDIT ARTICLE
          ════════════════════════════════════════ */}
          {currentView === "add" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                  {editingArticleId ? "Edit Article" : "Add New Article"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingArticleId ? "Update the fields below and save your changes." : "Fill in all required fields and submit."}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    {editingArticleId ? "Edit Article Form" : "Article Submission Form"}
                  </h2>
                  <p className="text-xs text-gray-400">Fields mapped to portal schema</p>
                </div>
                <form onSubmit={handleSubmitArticle} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field label="Journal Title" required>
                      <input type="text" required value={formData.journalTitle} onChange={(e) => setFormData({ ...formData, journalTitle: e.target.value })} placeholder="Enter journal title..." className={inputCls} />
                    </Field>
                    <Field label="Volume" required>
                      <input type="text" required value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} placeholder="Volume number..." className={inputCls} />
                    </Field>
                    <Field label="Issue" required>
                      <input type="text" required value={formData.issue} onChange={(e) => setFormData({ ...formData, issue: e.target.value })} placeholder="Issue number..." className={inputCls} />
                    </Field>
                  </div>
                  <Field label="DOI ID">
                    <input type="text" value={formData.doiId} onChange={(e) => setFormData({ ...formData, doiId: e.target.value })} placeholder="e.g., 10.1007/s00415..." className={inputCls} />
                  </Field>
                  <Field label="Article Title" required>
                    <textarea required rows={3} value={formData.articleTitle} onChange={(e) => setFormData({ ...formData, articleTitle: e.target.value })} placeholder="Enter complete article title..." className={inputCls + " resize-y"} />
                  </Field>
                  <AbstractEditor value={formData.abstract} onChange={(html) => setFormData((prev) => ({ ...prev, abstract: html }))} />
                  <Field label="Keywords (comma separated)">
                    <input type="text" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} placeholder="e.g., Neuroscience, Clinical Trial, Bioavailability" className={inputCls} />
                  </Field>

                  {/* Authors */}
                  <div className="border border-gray-200 bg-gray-50/60 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Authors</h3>
                      <span className="text-[11px] px-2 py-0.5 bg-gray-200 text-gray-600 rounded font-mono font-bold">{formData.authorsList.length} author{formData.authorsList.length !== 1 ? "s" : ""}</span>
                    </div>
                    {formData.authorsList.map((author, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 space-y-4 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">First Name</label>
                            <input type="text" value={author.firstName} onChange={(e) => handleAuthorChange(index, "firstName", e.target.value)} placeholder="First name..." className={inputCls} />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">Last Name</label>
                            <input type="text" value={author.lastName} onChange={(e) => handleAuthorChange(index, "lastName", e.target.value)} placeholder="Last name..." className={inputCls} />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">ORCID</label>
                            <input type="text" value={author.orcid} onChange={(e) => handleAuthorChange(index, "orcid", e.target.value)} placeholder="0000-0000-0000-0000" className={inputCls} />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">Corresponding Author</label>
                            <select value={author.correspondingAuthor} onChange={(e) => handleAuthorChange(index, "correspondingAuthor", e.target.value)} className={inputCls}>
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </select>
                          </div>
                        </div>
                        {formData.authorsList.length > 1 && (
                          <div className="flex justify-end">
                            <button type="button" onClick={() => handleRemoveAuthor(index)} className="text-xs font-bold text-red-500 hover:text-red-700 transition flex items-center gap-1">
                              <MdDelete size={13} /> Remove Author
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={handleAddAuthor} className="bg-[#1e88e5] hover:bg-[#1565c0] text-white text-xs font-bold px-4 py-2 rounded-md transition shadow-sm">
                      + Add Author
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field label="Page">
                      <input type="text" placeholder="e.g., 1–5" value={formData.page} onChange={(e) => setFormData({ ...formData, page: e.target.value })} className={inputCls} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field label="Creative Commons License">
                      <input type="text" value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} placeholder="e.g., CC BY-NC-SA" className={inputCls} />
                    </Field>
                    <Field label="Article Type">
                      <select value={formData.articleType} onChange={(e) => setFormData({ ...formData, articleType: e.target.value })} className={inputCls}>
                        <option value="">Select type</option>
                        <option value="Editorial">Editorial</option>
                        <option value="Original Research Article">Original Research Article</option>
                        <option value="Review Article">Review Article</option>
                        <option value="Case Report">Case Report</option>
                        <option value="Short Communication">Short Communication</option>
                      </select>
                    </Field>
                    <Field label="Access Type">
                      <select value={formData.accessType} onChange={(e) => setFormData({ ...formData, accessType: e.target.value })} className={inputCls}>
                        <option value="Open">Open</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field label="Received Date">
                      <input type="date" value={formData.receivedDate} onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Accepted Date">
                      <input type="date" value={formData.acceptedDate} onChange={(e) => setFormData({ ...formData, acceptedDate: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Online Date">
                      <input type="date" value={formData.onlineDate} onChange={(e) => setFormData({ ...formData, onlineDate: e.target.value })} className={inputCls} />
                    </Field>
                  </div>

                  {/* PDFs */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 border rounded-lg shadow-sm">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">
                          Article PDF {!editingArticleId && <span className="text-red-500">*</span>}
                        </label>
                        {editingArticleId && existingArticlePdf && (
                          <p className="text-[11px] text-green-600 mb-1.5">✓ A PDF is already on file — choose a new file only to replace it.</p>
                        )}
                        <input type="file" ref={articlePdfRef} accept=".pdf" className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-2 file:rounded file:border file:text-xs file:bg-gray-50 file:cursor-pointer" />
                      </div>
                      <div className="bg-white p-3 border rounded-lg shadow-sm">
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Supplementary PDF</label>
                        {editingArticleId && existingSupplementaryPdf && (
                          <p className="text-[11px] text-green-600 mb-1.5">✓ A supplementary PDF is already on file — choose a new file only to replace it.</p>
                        )}
                        <input type="file" ref={suppPdfRef} accept=".pdf" className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-2 file:rounded file:border file:text-xs file:bg-gray-50 file:cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <Field label="Status">
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputCls}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Field>

                  <div className="border-t border-gray-200 pt-5 flex items-center gap-3">
                    <button type="submit" disabled={submittingArticle} className="bg-[#4caf50] hover:bg-[#419b45] disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-md transition shadow-sm">
                      {submittingArticle ? (editingArticleId ? "Updating..." : "Submitting...") : (editingArticleId ? "Update Article" : "Submit Article")}
                    </button>
                    <button type="button" onClick={() => { resetArticleForm(); navigate("home"); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm px-6 py-2.5 rounded-md transition">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              HOMEPAGE MANAGER
          ════════════════════════════════════════ */}
          {currentView === "homepage" && <HomepageManager />}

          {/* ════════════════════════════════════════
              MANAGE PAGES
          ════════════════════════════════════════ */}
          {currentView === "pages" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Manage Pages</h1>
                  <p className="text-sm text-gray-500">About, Contact, Author Instructions, and more.</p>
                </div>
                <button onClick={() => setEditingPage({ ...EMPTY_PAGE })} className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-4 py-2 rounded-md transition shadow-sm">
                  <MdAdd size={16} /> Add Page
                </button>
              </div>

              {editingPage && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-2">
                    {editingPage._id ? "Edit Page" : "New Page"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Slug (URL) <span className="text-red-500">*</span></label>
                      <select className={inputCls + " mb-2"} value={editingPage.slug} onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}>
                        <option value="">— Select a preset —</option>
                        {PRESET_SLUGS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input type="text" className={inputCls} placeholder="Or enter a custom slug" value={editingPage.slug} onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
                      <p className="text-[11px] text-gray-400 mt-1">URL: <strong>yoursite.com/{editingPage.slug || "slug"}</strong></p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Page Title <span className="text-red-500">*</span></label>
                      <input type="text" className={inputCls} placeholder="e.g., About the Journal" value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Meta Description (SEO)</label>
                    <input type="text" className={inputCls} placeholder="Short description for search engines..." value={editingPage.metaDescription} onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">Page Content</label>
                    <AbstractEditor value={editingPage.content} onChange={(html) => setEditingPage((prev) => prev ? { ...prev, content: html } : prev)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="pageActive" checked={editingPage.isActive} onChange={(e) => setEditingPage({ ...editingPage, isActive: e.target.checked })} />
                    <label htmlFor="pageActive" className="text-sm text-gray-600">Active (publicly visible)</label>
                  </div>
                  <div className="flex gap-3 pt-2 border-t">
                    <button onClick={handleSavePage} disabled={savingPage} className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] disabled:opacity-50 text-white font-bold text-sm px-5 py-2 rounded-md transition">
                      <MdSave size={15} /> {savingPage ? "Saving..." : "Save Page"}
                    </button>
                    <button onClick={() => setEditingPage(null)} className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm px-5 py-2 rounded-md transition">
                      <MdCancel size={15} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {loadingPages ? (
                <LoadingCard text="Loading pages..." />
              ) : pages.length === 0 ? (
                <EmptyCard
                  icon={<MdPages size={40} className="text-gray-300" />}
                  title="No pages found"
                  subtitle='Click "Add Page" to create your first page.'
                  action={<button onClick={() => setEditingPage({ ...EMPTY_PAGE })} className="mt-2 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-5 py-2 rounded-md transition">Add Page</button>}
                />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {["#", "Slug / URL", "Title", "Status", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pages.map((page, i) => (
                        <tr key={page._id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3 font-mono text-xs text-blue-600">/{page.slug}</td>
                          <td className="px-4 py-3 text-gray-700 font-medium">{page.title}</td>
                          <td className="px-4 py-3"><StatusBadge status={page.isActive ? "Active" : "Inactive"} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <button onClick={() => setEditingPage(page)} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-semibold"><MdEdit size={14} /> Edit</button>
                              <button onClick={() => handleDeletePage(page.slug)} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold"><MdDelete size={14} /> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════
              NAV MANAGER
          ════════════════════════════════════════ */}
          {currentView === "navmanager" && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Navigation Manager</h1>
                  <p className="text-sm text-gray-500">Manage the website navigation links. Drag rows by the handle to reorder.</p>
                </div>
                <button onClick={() => { setMenuError(null); setEditingMenu({ ...EMPTY_MENU }); }} className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-4 py-2 rounded-md transition shadow-sm">
                  <MdAdd size={16} /> Add Menu Item
                </button>
              </div>

              {editingMenu && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-2">
                    {editingMenu._id ? "Edit Menu Item" : "New Menu Item"}
                  </h2>
                  {menuError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{menuError}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Label (displayed in nav) <span className="text-red-500">*</span></label>
                      <input type="text" className={inputCls} placeholder="e.g., About Journal" value={editingMenu.title} onChange={(e) => setEditingMenu({ ...editingMenu, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">
                        Display Order {editingMenu._id ? <span className="text-gray-400 font-normal normal-case ml-1">(drag in table)</span> : <span className="text-gray-400 font-normal normal-case ml-1">(auto-assigned)</span>}
                      </label>
                      <input type="number" className={inputCls + " opacity-40 cursor-not-allowed"} placeholder="Auto" value={editingMenu._id ? editingMenu.order : ""} disabled readOnly />
                      <p className="text-[11px] text-gray-400 mt-1">Use drag-and-drop in the table below.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                      <select className={inputCls} value={editingMenu.type || "dropdown"} onChange={(e) => setEditingMenu({ ...editingMenu, type: e.target.value as "single" | "dropdown" })}>
                        <option value="single">Single Link (no dropdown)</option>
                        <option value="dropdown">Dropdown Menu</option>
                      </select>
                    </div>
                  </div>

                  {editingMenu.type === "single" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">URL / Slug <span className="text-red-500">*</span></label>
                        <input type="text" className={inputCls} placeholder={editingMenu.isExternal ? "https://example.com" : "/about"} value={editingMenu.slug || ""} onChange={(e) => setEditingMenu({ ...editingMenu, slug: e.target.value })} />
                      </div>
                      <div className="flex items-end gap-2 pb-1">
                        <input type="checkbox" id="singleExternal" checked={editingMenu.isExternal || false} onChange={(e) => setEditingMenu({ ...editingMenu, isExternal: e.target.checked })} />
                        <label htmlFor="singleExternal" className="text-sm text-gray-600">External Link ↗</label>
                      </div>
                    </div>
                  )}

                  {editingMenu.type === "dropdown" && (
                    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Dropdown Items ({editingMenu.items.length})</h3>
                        <button type="button" onClick={addNavItem} className="text-xs bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold px-3 py-1 rounded transition">+ Add Item</button>
                      </div>
                      {editingMenu.items.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No items yet. Click "Add Item" to get started.</p>}
                      {editingMenu.items.map((item, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleNavItemDragStart(idx)}
                          onDragOver={handleNavItemDragOver}
                          onDrop={() => handleNavItemDrop(idx)}
                          className={`bg-white border border-gray-200 rounded-lg p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-end shadow-sm cursor-move ${draggedNavItemIndex === idx ? "opacity-40 bg-green-50" : ""}`}
                        >
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">Label</label>
                            <input type="text" className={inputCls} placeholder="e.g., Editorial Board" value={item.label} onChange={(e) => updateNavItem(idx, "label", e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">{item.isExternal ? "Full URL" : "Slug / Path"}</label>
                            <input type="text" className={inputCls} placeholder={item.isExternal ? "https://example.com" : "/about"} value={item.slug} onChange={(e) => updateNavItem(idx, "slug", e.target.value)} />
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                              <input type="checkbox" checked={item.isExternal} onChange={(e) => updateNavItem(idx, "isExternal", e.target.checked)} />
                              External ↗
                            </label>
                            <button type="button" onClick={() => removeNavItem(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold transition">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="menuActive" checked={editingMenu.isActive} onChange={(e) => setEditingMenu({ ...editingMenu, isActive: e.target.checked })} />
                    <label htmlFor="menuActive" className="text-sm text-gray-600">Active (visible in navigation)</label>
                  </div>
                  <div className="flex gap-3 pt-2 border-t">
                    <button onClick={handleSaveMenu} disabled={savingMenu} className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] disabled:opacity-50 text-white font-bold text-sm px-5 py-2 rounded-md transition">
                      <MdSave size={15} /> {savingMenu ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => { setMenuError(null); setEditingMenu(null); }} className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm px-5 py-2 rounded-md transition">
                      <MdCancel size={15} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {loadingMenus ? (
                <LoadingCard text="Loading navigation menus..." />
              ) : menus.length === 0 ? (
                <EmptyCard
                  icon={<MdMenuBook size={40} className="text-gray-300" />}
                  title="No navigation menus found"
                  subtitle='Click "Add Menu Item" to create your first menu.'
                  action={<button onClick={() => { setMenuError(null); setEditingMenu({ ...EMPTY_MENU }); }} className="mt-2 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-5 py-2 rounded-md transition">Add Menu Item</button>}
                />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {["Order", "Label", "Type", "Link / Items", "Status", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {menus.map((menu, i) => (
                        <tr key={menu._id} draggable onDragStart={() => handleDragStart(i)} onDragOver={handleDragOver} onDrop={() => handleDrop(i)} className={`hover:bg-gray-50 transition cursor-move ${draggedIndex === i ? "opacity-40" : ""}`}>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                            <span className="flex items-center gap-1.5"><MdDragIndicator size={16} className="text-gray-300" />{menu.order}</span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800">{menu.title}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${menu.type === "single" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                              {menu.type === "single" ? "Single" : "Dropdown"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px]">
                            {menu.type === "single" ? <span className="font-mono text-blue-600">{menu.slug}{menu.isExternal ? " ↗" : ""}</span> : <span>{menu.items.length} item{menu.items.length !== 1 ? "s" : ""}</span>}
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={menu.isActive ? "Active" : "Inactive"} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <button onClick={() => { setMenuError(null); setEditingMenu({ ...menu, type: menu.type || "dropdown" }); }} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-semibold"><MdEdit size={14} /> Edit</button>
                              <button onClick={() => handleDeleteMenu(menu._id!)} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold"><MdDelete size={14} /> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ─── Reusable UI Helpers ──────────────────────────────────────────────────────
function SidebarLink({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string; }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition text-left ${active ? "bg-[#4caf50] text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{badge}</span>}
    </button>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
      {status}
    </span>
  );
}

function LoadingCard({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-20 flex flex-col items-center gap-3 text-center">
      <div className="w-8 h-8 border-4 border-[#4caf50] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-red-200 shadow-sm py-16 flex flex-col items-center gap-3 text-center">
      <p className="text-red-500 font-medium">{message}</p>
      <button onClick={onRetry} className="mt-1 text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md transition">Retry</button>
    </div>
  );
}

function EmptyCard({ icon, title, subtitle, action }: { icon: React.ReactNode; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-dashed border-gray-200 shadow-sm py-20 flex flex-col items-center gap-2 text-center">
      {icon}
      <p className="text-gray-500 font-medium mt-1">{title}</p>
      <p className="text-gray-400 text-sm max-w-xs">{subtitle}</p>
      {action}
    </div>
  );
}