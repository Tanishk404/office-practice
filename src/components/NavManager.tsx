// ════════════════════════════════════════
// NAV MANAGER — admin panel ke andar yeh section paste karo
// currentView === "navmanager" wali jagah
// ════════════════════════════════════════

// Yeh code admin panel ke main return() ke andar hai:

{currentView === "navmanager" && (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Navigation Manager</h1>
        <p className="text-sm text-gray-500">Website ke navigation links manage karo</p>
      </div>
      <button onClick={() => setEditingMenu({ ...EMPTY_MENU })}
        className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-4 py-2 rounded-md transition shadow-sm">
        <MdAdd size={16} /> Add Menu Item
      </button>
    </div>

    {/* Nav Edit Form */}
    {editingMenu && (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b pb-2">
          {editingMenu._id ? "Edit Menu" : "New Menu Item"}
        </h2>

        {/* Title + Order + Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Label (nav mein dikhega) <span className="text-red-500">*</span>
            </label>
            <input type="text" className={inputCls} placeholder="e.g., About Journal"
              value={editingMenu.title}
              onChange={(e) => setEditingMenu({ ...editingMenu, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Order</label>
            <input type="number" className={inputCls} placeholder="1, 2, 3..."
              value={editingMenu.order}
              onChange={(e) => setEditingMenu({ ...editingMenu, order: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
            <select className={inputCls}
              value={editingMenu.type || "dropdown"}
              onChange={(e) => setEditingMenu({ ...editingMenu, type: e.target.value as "single" | "dropdown" })}>
              <option value="single">Single Link (koi dropdown nahi)</option>
              <option value="dropdown">Dropdown Menu</option>
            </select>
          </div>
        </div>

        {/* ── SINGLE LINK fields ── */}
        {(editingMenu.type === "single" || !editingMenu.type) && editingMenu.type === "single" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                URL / Slug <span className="text-red-500">*</span>
              </label>
              <input type="text" className={inputCls}
                placeholder={editingMenu.isExternal ? "https://..." : "/about"}
                value={editingMenu.slug || ""}
                onChange={(e) => setEditingMenu({ ...editingMenu, slug: e.target.value })} />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input type="checkbox" id="singleExternal"
                checked={editingMenu.isExternal || false}
                onChange={(e) => setEditingMenu({ ...editingMenu, isExternal: e.target.checked })} />
              <label htmlFor="singleExternal" className="text-sm text-gray-600">External Link ↗</label>
            </div>
          </div>
        )}

        {/* ── DROPDOWN items ── */}
        {editingMenu.type === "dropdown" && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Dropdown Items ({editingMenu.items.length})
              </h3>
              <button type="button" onClick={addNavItem}
                className="text-xs bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold px-3 py-1 rounded transition">
                + Add Item
              </button>
            </div>

            {editingMenu.items.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Koi item nahi. "Add Item" click karo.</p>
            )}

            {editingMenu.items.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-end shadow-sm">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Label</label>
                  <input type="text" className={inputCls} placeholder="e.g., Editorial Board"
                    value={item.label}
                    onChange={(e) => updateNavItem(idx, "label", e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">
                    {item.isExternal ? "Full URL" : "Slug / Path"}
                  </label>
                  <input type="text" className={inputCls}
                    placeholder={item.isExternal ? "https://..." : "/about"}
                    value={item.slug}
                    onChange={(e) => updateNavItem(idx, "slug", e.target.value)} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input type="checkbox" checked={item.isExternal}
                      onChange={(e) => updateNavItem(idx, "isExternal", e.target.checked)} />
                    External ↗
                  </label>
                  <button type="button" onClick={() => removeNavItem(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold transition">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active toggle */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="menuActive" checked={editingMenu.isActive}
            onChange={(e) => setEditingMenu({ ...editingMenu, isActive: e.target.checked })} />
          <label htmlFor="menuActive" className="text-sm text-gray-600">Active (nav mein dikhega)</label>
        </div>

        <div className="flex gap-3 pt-2 border-t">
          <button onClick={handleSaveMenu} disabled={savingMenu}
            className="flex items-center gap-1.5 bg-[#4caf50] hover:bg-[#419b45] disabled:opacity-50 text-white font-bold text-sm px-5 py-2 rounded-md transition">
            <MdSave size={15} /> {savingMenu ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setEditingMenu(null)}
            className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm px-5 py-2 rounded-md transition">
            <MdCancel size={15} /> Cancel
          </button>
        </div>
      </div>
    )}

    {/* Menus List */}
    {loadingMenus ? (
      <LoadingCard text="Loading nav menus..." />
    ) : menus.length === 0 ? (
      <EmptyCard
        icon={<MdMenuBook size={40} className="text-gray-300" />}
        title="Koi nav menu nahi"
        subtitle='"Add Menu Item" se shuru karo.'
        action={
          <button onClick={() => setEditingMenu({ ...EMPTY_MENU })}
            className="mt-2 bg-[#4caf50] hover:bg-[#419b45] text-white text-sm font-semibold px-5 py-2 rounded-md transition">
            Add Menu Item
          </button>
        }
      />
    ) : (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Order", "Label", "Type", "Link/Items", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.map((menu) => (
              <tr key={menu._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{menu.order}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{menu.title}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    menu.type === "single"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {menu.type === "single" ? "Single" : "Dropdown"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px]">
                  {menu.type === "single"
                    ? <span className="font-mono text-blue-600">{menu.slug}{menu.isExternal ? " ↗" : ""}</span>
                    : <span>{menu.items.length} item{menu.items.length !== 1 ? "s" : ""}</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={menu.isActive ? "Active" : "Inactive"} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => setEditingMenu(menu)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-semibold">
                      <MdEdit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDeleteMenu(menu._id!)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold">
                      <MdDelete size={14} /> Delete
                    </button>
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