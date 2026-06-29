"use client";
import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import AbstractEditor from "./AbstractEditor"; // aapka existing rich editor

interface Page {
  _id?: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  isActive: boolean;
}

const EMPTY: Page = { slug: "", title: "", content: "", metaDescription: "", isActive: true };

// Common pages ke slugs jaldi select karne ke liye
const PRESET_SLUGS = [
  "about", "contact-us", "author-instructions", "reviewer-instructions",
  "editorial", "publication-charges", "publication-ethics",
  "subscription", "call-for-papers", "archives", "current", "ahead"
];

export default function PagesManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    const res = await fetch("/api/pages");
    const data = await res.json();
    if (data.success) setPages(data.pages);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.slug || !editing.title) { alert("Slug aur Title required hai!"); return; }
    setSaving(true);
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    if (data.success) {
      await fetchPages();
      setEditing(null);
      alert("Page saved!");
    } else {
      alert("Error: " + data.msg);
    }
    setSaving(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`"${slug}" page delete karna chahte ho?`)) return;
    const res = await fetch(`/api/pages/${slug}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) await fetchPages();
    else alert("Delete failed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Manage Pages</h1>
          <p className="text-sm text-gray-500">About, Contact, Author Instructions, etc.</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-4 py-2 rounded-md transition shadow-sm">
          <MdAdd size={16} /> Add Page
        </button>
      </div>

      {/* Edit / Add Form */}
      {editing && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-2">
            {editing._id ? "Edit Page" : "New Page"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Slug (URL path) <span className="text-red-500">*</span>
              </label>
              {/* Preset slugs */}
              <select className={inputCls + " mb-2 bg-white"}
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}>
                <option value="">-- Preset select karo --</option>
                {PRESET_SLUGS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="text" className={inputCls}
                placeholder="ya custom slug type karo (e.g., about)"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              <p className="text-[11px] text-gray-400 mt-1">Page: <strong>yoursite.com/{editing.slug || "slug"}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input type="text" className={inputCls} placeholder="e.g., About Journal"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Meta Description (SEO)</label>
            <input type="text" className={inputCls} placeholder="Short description for search engines..."
              value={editing.metaDescription}
              onChange={(e) => setEditing({ ...editing, metaDescription: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Page Content</label>
            <AbstractEditor
              value={editing.content}
              onChange={(html) => setEditing((prev) => prev ? { ...prev, content: html } : prev)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={editing.isActive}
              onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} />
            <label htmlFor="isActive" className="text-sm text-gray-600">Active (publicly visible)</label>
          </div>

          <div className="flex gap-3 pt-2 border-t">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#4caf50] hover:bg-[#419b45] disabled:opacity-50 text-white font-bold text-sm px-5 py-2 rounded-md transition">
              {saving ? "Saving..." : "Save Page"}
            </button>
            <button onClick={() => setEditing(null)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm px-5 py-2 rounded-md transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pages List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-[#4caf50] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400 text-sm">
          Koi page nahi hai. "Add Page" se shuru karo.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">#</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Title</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page, i) => (
                <tr key={page._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">/{page.slug}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{page.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${page.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {page.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => setEditing(page)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-semibold">
                      <MdEdit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(page.slug)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold">
                      <MdDelete size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full border border-gray-300 px-3 py-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#4caf50] focus:border-[#4caf50] text-gray-800";