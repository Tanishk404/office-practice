"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MdImage } from "react-icons/md";

interface AbstractEditorProps {
  value: string;
  onChange: (data: string) => void;
  label?: string;
}

// ── Main Editor ────────────────────────────────────────────────────────────────
export default function AbstractEditor({ value, onChange, label }: AbstractEditorProps) {
  const editorRef         = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const fileInputRef      = useRef<HTMLInputElement>(null);
  const isInitialized     = useRef(false);
  const lastValueRef      = useRef(value);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [uploading, setUploading]           = useState(false);
  const [uploadError, setUploadError]       = useState<string | null>(null);
  const [imgWidth, setImgWidth]             = useState("50");

  // ── Init CKEditor ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isScriptLoaded || !editorRef.current || isInitialized.current) return;
    const w = window as any;
    if (!w.CKEDITOR) return;
    isInitialized.current = true;

    // The new all-in-one CDN bundle exposes every plugin on the global CKEDITOR object.
    const {
      ClassicEditor, Essentials, Paragraph, Heading, Bold, Italic, Underline,
      List, BlockQuote, Link, Table, TableToolbar, TableProperties, TableCellProperties,
      Alignment, Undo, Image, ImageToolbar, ImageResizeEditing, ImageResizeHandles, ImageResizeButtons,
    } = w.CKEDITOR;

    ClassicEditor.create(editorRef.current, {
      // ⚠️ 'GPL' only works for self-hosted (npm/ZIP) installs. Since we're loading from CKEditor's
      // CDN, you need a real (free) license key — sign up at https://portal.ckeditor.com/checkout?plan=free
      // (no card needed) and paste the key from the "License keys" section below. Without it the
      // editor silently goes into a disabled/read-only state.
      
        
	licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODM5MDA3OTksImp0aSI6IjZhZjkwZWYyLTg3NGMtNDZiNi04ODJkLWUyNTY4MWMxOTNiNSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6Ijc3ODk1MGY5In0.ewBPCoH3mA7KhoDkhjr974Kj3VA8EFU08krFGASQZm17fineO-XPgJGHjAWe8s0jf2zBe8Gr7hzUSW4rDzQr7Q',

      plugins: [
        Essentials, Paragraph, Heading, Bold, Italic, Underline,
        List, BlockQuote, Link, Table, TableToolbar, TableProperties, TableCellProperties,
        Alignment, Undo, Image, ImageToolbar, ImageResizeEditing, ImageResizeHandles, ImageResizeButtons,
      ],
      toolbar: [
        "heading", "|", "bold", "italic", "underline", "|",
        "bulletedList", "numberedList", "blockQuote", "|",
        "link", "insertTable", "|", "alignment", "|", "undo", "redo",
      ],
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"],
        tableProperties:     { defaultProperties: { borderStyle: "solid", borderColor: "#d1d5db", borderWidth: "1px" } },
        tableCellProperties: { defaultProperties: { borderStyle: "solid", borderColor: "#d1d5db", borderWidth: "1px", padding: "8px 12px" } },
      },
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph",  class: "ck-heading_paragraph" },
          { model: "heading1",  view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
          { model: "heading2",  view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
          { model: "heading3",  view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        ],
      },
      // ── Native resize: drag handles + preset % buttons, properly saved to the model ──
      image: {
        resizeUnit: "%",
        resizeOptions: [
          { name: "resizeImage:original", value: null,  icon: "original", label: "Original" },
          { name: "resizeImage:25",       value: "25",  icon: "small",    label: "25%" },
          { name: "resizeImage:33",       value: "33",  icon: "small",    label: "33%" },
          { name: "resizeImage:50",       value: "50",  icon: "medium",   label: "50%" },
          { name: "resizeImage:75",       value: "75",  icon: "large",    label: "75%" },
        ],
        toolbar: [
          "resizeImage:25", "resizeImage:33", "resizeImage:50", "resizeImage:75", "resizeImage:original",
        ],
      },
    })
      .then((editor: any) => {
        editorInstanceRef.current = editor;
        if (value) editor.setData(value);
        lastValueRef.current = value;

        editor.model.document.on("change:data", () => {
          const d = editor.getData();
          lastValueRef.current = d;
          onChange(d);
        });
      })
      .catch((err: any) => console.error("CKEditor error:", err));

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
        isInitialized.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded]);

  // Sync external value
  useEffect(() => {
    if (!editorInstanceRef.current) return;
    if (value !== lastValueRef.current && value !== editorInstanceRef.current.getData()) {
      editorInstanceRef.current.setData(value || "");
      lastValueRef.current = value;
    }
  }, [value]);

  // Insert image at cursor using the official command, then apply the chosen default width
  // using the official resizeImage command — this writes to the MODEL, so it survives
  // getData()/setData() round-trips and won't get reverted by later edits.
  const insertImage = (src: string, widthPct: string) => {
    const editor = editorInstanceRef.current;
    if (!editor) return;
    editor.execute("insertImage", { source: src });
    if (widthPct !== "100") {
      setTimeout(() => {
        editor.execute("resizeImage", { width: `${widthPct}%` });
      }, 0);
    }
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const allowed = ["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/svg+xml"];
    if (!allowed.includes(file.type)) { setUploadError("Invalid type. JPG PNG GIF WEBP SVG only."); return; }
    if (file.size > 5 * 1024 * 1024)  { setUploadError("Max 5MB allowed."); return; }
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "pages");
      const res  = await fetch("/api/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) insertImage(data.url, imgWidth);
      else setUploadError(data.error || "Upload failed.");
    } catch { setUploadError("Network error."); }
    finally { setUploading(false); }
  };

  return (
    <div className="w-full space-y-1">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>}

      {/* ── Upload bar ── */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-md">

        <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 bg-[#1e88e5] hover:bg-[#1565c0] disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded transition">
          {uploading
            ? <><svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Uploading...</>
            : <><MdImage size={14} /> Choose Image from PC</>}
        </button>

        <span className="text-[11px] text-gray-400 hidden sm:inline">
          Click image after insert — drag the corner handle or use the size buttons in the popup toolbar
        </span>
      </div>

      {uploadError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-1.5">{uploadError}</p>}

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml" className="hidden" onChange={handleFileChosen} />

      {/* New official all-in-one CDN bundle — includes ImageResize, unlike the old /classic/ckeditor.js build */}
      <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/48.2.0/ckeditor5.css" />
      <Script src="https://cdn.ckeditor.com/ckeditor5/48.2.0/ckeditor5.umd.js" strategy="afterInteractive" onLoad={() => setIsScriptLoaded(true)} />

      <div className="ck-editor-cdn-wrapper">
        {!isScriptLoaded
          ? <div className="h-[200px] w-full bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center text-sm text-gray-400 animate-pulse">Loading editor...</div>
          : <div ref={editorRef} />}
      </div>

      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 260px !important; border-color: #d1d5db !important;
          border-bottom-left-radius: 4px !important; border-bottom-right-radius: 4px !important;
          background: #fff !important; color: #1f2937 !important;
          padding: 12px 16px !important; font-size: 14px !important; line-height: 1.7 !important;
        }
        .ck-editor__editable_inline:focus { border-color: #4caf50 !important; box-shadow: 0 0 0 2px rgba(76,175,80,.15) !important; --ck-inner-shadow: none !important; }
        .ck-toolbar { border-top-left-radius: 4px !important; border-top-right-radius: 4px !important; border-color: #d1d5db !important; background: #f9fafb !important; }
        .ck-content strong,.ck-editor__editable strong,.ck-content b,.ck-editor__editable b { font-weight:700 !important; }
        .ck-content em,.ck-editor__editable em,.ck-content i,.ck-editor__editable i { font-style:italic !important; }
        .ck-content h1,.ck-editor__editable h1 { font-size:1.6em !important; font-weight:700 !important; color:#111827 !important; margin:14px 0 6px !important; border-bottom:1px solid #e5e7eb !important; padding-bottom:4px !important; }
        .ck-content h2,.ck-editor__editable h2 { font-size:1.35em !important; font-weight:700 !important; color:#111827 !important; margin:14px 0 6px !important; }
        .ck-content h3,.ck-editor__editable h3 { font-size:1.1em !important; font-weight:700 !important; color:#1f2937 !important; margin:10px 0 4px !important; }
        .ck-content ul,.ck-editor__editable ul { list-style-type:disc !important; padding-left:24px !important; margin-bottom:10px !important; }
        .ck-content ol,.ck-editor__editable ol { list-style-type:decimal !important; padding-left:24px !important; margin-bottom:10px !important; }
        .ck-content li,.ck-editor__editable li { list-style:inherit !important; margin-bottom:4px !important; }
        .ck-content blockquote,.ck-editor__editable blockquote { border-left:4px solid #4caf50 !important; padding:6px 0 6px 15px !important; color:#4b5563 !important; margin:10px 0 !important; background:#f9fafb !important; font-style:italic !important; }
        .ck-content table,.ck-editor__editable table { border-collapse:collapse !important; width:100% !important; margin:12px 0 !important; font-size:13px !important; }
        .ck-content th,.ck-editor__editable th { background:#f1f5f9 !important; border:1px solid #d1d5db !important; padding:8px 12px !important; font-weight:700 !important; text-align:left !important; color:#1f2937 !important; }
        .ck-content td,.ck-editor__editable td { border:1px solid #d1d5db !important; padding:7px 12px !important; vertical-align:top !important; }
        .ck-content tr:nth-child(even) td { background:#fafafa !important; }
        .ck-content a,.ck-editor__editable a { color:#1a73e8 !important; text-decoration:underline !important; }
        .ck-content figure.image figcaption { font-size:12px !important; color:#6b7280 !important; margin-top:4px !important; font-style:italic !important; }
      `}</style>
    </div>
  );
}