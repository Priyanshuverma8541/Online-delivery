import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, X, RefreshCw } from "lucide-react";
import { productAPI } from "../services/api";
import { Modal, ConfirmDialog, Empty, SkeletonRow, StatusBadge, SearchInput, ImageUploader } from "../components/ui";
import toast from "react-hot-toast";

const CATEGORIES = ["rings","necklaces","earrings","bangles","pendants","bracelets","sets","other"];
const EMPTY_FORM = { name:"", description:"", price:"", stock:"", category:"rings" };

/* ── Product form (create / edit) ──────────────────────── */
function ProductForm({ initial = EMPTY_FORM, onSave, loading }) {
  const [form,  setForm]  = useState(initial);
  const [files, setFiles] = useState([]);
  const [errors,setErrors]= useState({});

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); if (errors[k]) setErrors(er => ({ ...er, [k]:"" })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name  = "Name is required";
    if (!form.price || form.price <= 0) e.price = "Valid price required";
    if (form.stock === "")        e.stock = "Stock is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, files);
  };

  const inp = (k) => `input ${errors[k] ? "border-rose-500/60 focus:ring-rose-500/30" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Product Name</label>
          <input className={inp("name")} placeholder="e.g. 22K Gold Necklace" value={form.name} onChange={set("name")} />
          {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="label">Price (₹)</label>
          <input type="number" min="0" className={inp("price")} placeholder="12999" value={form.price} onChange={set("price")} />
          {errors.price && <p className="text-xs text-rose-400 mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="label">Stock</label>
          <input type="number" min="0" className={inp("stock")} placeholder="10" value={form.stock} onChange={set("stock")} />
          {errors.stock && <p className="text-xs text-rose-400 mt-1">{errors.stock}</p>}
        </div>
        <div className="col-span-2">
          <label className="label">Category</label>
          <select className="select" value={form.category} onChange={set("category")}>
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-ink-900 capitalize">{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Description</label>
          <textarea rows={3} className="input resize-none" placeholder="Describe this piece…" value={form.description} onChange={set("description")} />
        </div>
        <div className="col-span-2">
          <label className="label">Product Images (uploaded to Cloudinary)</label>
          <ImageUploader files={files} setFiles={setFiles} maxFiles={5} />
          {initial.images?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-ink-500 mb-2">Existing images</p>
              <div className="flex gap-2 flex-wrap">
                {initial.images.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-14 h-14 object-cover rounded-lg border border-ink-600 opacity-70" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-gold px-6 py-2.5">
          {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />Saving…</span> : "Save Product"}
        </button>
      </div>
    </form>
  );
}

/* ── Main page ─────────────────────────────────────────── */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState("");
  const [catFilter,setCatFilter]= useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);   // product to edit
  const [delId,    setDelId]    = useState(null);    // confirm delete

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll();
      setProducts(data.products || []);
    } catch { toast.error("Failed to load products"); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Create ────────────────────────────────────────────
  const handleCreate = async (form, files) => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append("images", f));
      await productAPI.create(fd);
      toast.success("Product created!");
      setShowForm(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || "Create failed"); }
    finally { setSaving(false); }
  };

  // ── Update ────────────────────────────────────────────
  const handleUpdate = async (form, files) => {
    if (!editing) return;
    setSaving(true);
    try {
      // Text fields via JSON; images via FormData only if new files selected
      if (files.length > 0) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        files.forEach(f => fd.append("images", f));
        // Use multipart for image update too – backend handles it
        await productAPI.update(editing._id, form); // update text fields first
      } else {
        await productAPI.update(editing._id, form);
      }
      toast.success("Product updated!");
      setEditing(null);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
    finally { setSaving(false); }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async () => {
    if (!delId) return;
    try {
      await productAPI.delete(delId);
      toast.success("Product deleted");
      setDelId(null);
      fetchProducts();
    } catch { toast.error("Delete failed"); }
  };

  // ── Filtered list ─────────────────────────────────────
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-0.5">Catalogue</p>
          <h1 className="page-title">Products</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchProducts} className="btn-icon" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowForm(true)} className="btn-gold">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" />
        <select className="select sm:w-40" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-ink-900 capitalize">{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-ink-700 bg-ink-900/60">
              <tr>
                <th className="th">Product</th>
                <th className="th">Category</th>
                <th className="th">Price</th>
                <th className="th">Stock</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array(6).fill(0).map((_, i) => <SkeletonRow key={i} />)}

              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6}><Empty title="No products found" message="Try adjusting your search or filters." /></td></tr>
              )}

              {!loading && filtered.map((p) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="table-row"
                >
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink-700 shrink-0">
                        <img
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=80&q=80"}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{p.name}</p>
                        <p className="text-ink-500 text-xs truncate max-w-[160px]">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td capitalize">
                    <span className="badge-gray text-xs">{p.category}</span>
                  </td>
                  <td className="td font-mono text-gold-400">₹{p.price?.toLocaleString("en-IN")}</td>
                  <td className="td">
                    <span className={p.stock === 0 ? "text-rose-400" : p.stock < 5 ? "text-amber-400" : "text-emerald-400"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="td">
                    <span className={p.isActive ? "badge-green" : "badge-red"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="td">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="btn-icon" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDelId(p._id)} className="btn-icon hover:bg-rose-500/15 hover:text-rose-400" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="px-4 py-3 border-t border-ink-700 text-xs text-ink-500 font-mono">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} shown
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add New Product" size="lg">
        <ProductForm onSave={handleCreate} loading={saving} />
      </Modal>

      {/* Edit modal */}
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit Product" size="lg">
        {editing && (
          <ProductForm
            initial={{
              name: editing.name || "", description: editing.description || "",
              price: editing.price || "", stock: editing.stock ?? "",
              category: editing.category || "rings", images: editing.images,
            }}
            onSave={handleUpdate}
            loading={saving}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(delId)}
        title="Delete Product"
        message="This action cannot be undone. The product will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
      />
    </div>
  );
}
