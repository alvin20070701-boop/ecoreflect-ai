import React from 'react';
import { Purchase, Category } from '../types';
import { Plus, Edit2, Trash2, Search, Filter, Calendar, DollarSign, Tag, Check, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrackerProps {
  purchases: Purchase[];
  onAdd: (purchase: Omit<Purchase, 'id'>) => void;
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: Category[] = ['Clothing', 'Shoes', 'Accessories', 'Bags', 'Other'];

export default function Tracker({ purchases, onAdd, onEdit, onDelete }: TrackerProps) {
  // Navigation & interaction states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Purchase | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  // Form Fields
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<Category>('Clothing');
  const [brand, setBrand] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = React.useState('');

  // Handle open form for editing
  const startEdit = (item: Purchase) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setBrand(item.brand);
    setPrice(item.price.toString());
    setDate(item.date);
    setError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setName('');
    setCategory('Clothing');
    setBrand('');
    setPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim()) return setError('Product Name is required.');
    if (!brand.trim()) return setError('Brand or Store is required.');
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return setError('Please enter a valid price greater than zero.');
    }
    if (!date) return setError('Purchase Date is required.');

    if (editingItem) {
      onEdit({
        id: editingItem.id,
        name: name.trim(),
        category,
        brand: brand.trim(),
        price: parsedPrice,
        date
      });
    } else {
      onAdd({
        name: name.trim(),
        category,
        brand: brand.trim(),
        price: parsedPrice,
        date
      });
    }

    closeForm();
  };

  // Quick fill template utility (to encourage user experimentation)
  const quickFill = (nameVal: string, brandVal: string, priceVal: string, catVal: Category) => {
    setName(nameVal);
    setBrand(brandVal);
    setPrice(priceVal);
    setCategory(catVal);
  };

  const filteredPurchases = purchases.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'Clothing': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Shoes': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Accessories': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Bags': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Other': return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 pb-12" id="purchase-tracker-container">
      {/* Header with CTA Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-sans text-3xl font-bold text-slate-900">Purchase Tracker</h1>
          <p className="text-slate-500 text-sm">Keep an honest, transparent ledger of your acquisitions to understand overconsumption trendlines.</p>
        </div>
        {!isFormOpen && (
          <button
            id="btn-add-purchase-trigger"
            onClick={() => {
              closeForm();
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            <Plus className="h-4.5 w-4.5" />
            Record A Purchase
          </button>
        )}
      </div>

      {/* Slide-Down Recording Form Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            id="form-panel-anim-container"
          >
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/15 p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-sans text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Tag className="h-4 w-4" />
                  </span>
                  {editingItem ? 'Edit Purchase Details' : 'Record New Purchase'}
                </h2>
                <button
                  id="btn-cancel-form"
                  onClick={closeForm}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Suggestions to play with */}
              {!editingItem && (
                <div className="space-y-1.5" id="suggested-templates">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Quick Simulation presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => quickFill('Linen Summer T-Shirt', 'Uniqlo', '24.90', 'Clothing')}
                      className="text-xs bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      + Carbon-heavy Shirt
                    </button>
                    <button
                      onClick={() => quickFill('Running Trail Shoes', 'New Balance', '120.00', 'Shoes')}
                      className="text-xs bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      + Shoes
                    </button>
                    <button
                      onClick={() => quickFill('Recycled Cotton Tee', 'Zara', '19.99', 'Clothing')}
                      className="text-xs bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      + Micro-trend Tee
                    </button>
                    <button
                      onClick={() => quickFill('Waterproof Canvas Pack', 'Patagonia', '89.00', 'Bags')}
                      className="text-xs bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      + Bag
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2" id="purchase-ledger-form">
                {/* Product Name */}
                <div className="space-y-1">
                  <label htmlFor="product_name" className="text-xs font-semibold text-slate-700">Product Name</label>
                  <input
                    id="product_name"
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Recycled Cotton Tee, Waterproof Backpack"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-inner placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label htmlFor="brand" className="text-xs font-semibold text-slate-700">Brand / Store Name</label>
                  <input
                    id="brand"
                    required
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Patagonia, Everlane, Zara"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-inner placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="category" className="text-xs font-semibold text-slate-700">Category</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label htmlFor="price" className="text-xs font-semibold text-slate-700">Price (USD)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <DollarSign className="h-4 w-4" />
                      </span>
                      <input
                        id="price"
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm shadow-inner focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label htmlFor="purchase_date" className="text-xs font-semibold text-slate-700">Purchase Date</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <input
                      id="purchase_date"
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="col-span-1 md:col-span-2 text-xs font-sans font-medium text-red-600 bg-red-50 rounded-lg p-2.5 fill-current flex items-center gap-1" id="form-error">
                    <X className="h-4 w-4" /> {error}
                  </div>
                )}

                {/* Submit & Close Button controls */}
                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    id="btn-form-cancel"
                    type="button"
                    onClick={closeForm}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-form-submit"
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm shadow-emerald-700/10"
                  >
                    <Check className="h-4 w-4" />
                    {editingItem ? 'Save Changes' : 'Record Purchase'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEDGER FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-5" id="ledger-filters">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            id="search-purchase-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or brand..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm shadow-inner outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none" id="category-filter-bar">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="h-3 w-3" /> Category:
          </span>
          <button
            id="filter-category-all"
            onClick={() => setSelectedCategory('All')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all border shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`filter-category-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all border shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PURCHASES GRAPHICS / HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm" id="purchase-history-table">
        {filteredPurchases.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-sans text-base font-bold text-slate-700">No purchases found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              There are no recorded transactions matching your filters. Try checking your keyword spelling or add some mock purchases to evaluate your dashboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-sans text-[11px] font-bold tracking-wider uppercase">
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Brand / Store</th>
                  <th className="px-6 py-4">Price (USD)</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPurchases.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors" id={`row-${item.id}`}>
                    {/* Item Details (Name) */}
                    <td className="px-6 py-4">
                      <div className="font-sans text-sm font-semibold text-slate-900 leading-tight">
                        {item.name}
                      </div>
                    </td>

                    {/* Category Badging */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4">
                      <span className="text-slate-600 font-sans text-sm">{item.brand}</span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-slate-800">
                        ${item.price.toFixed(2)}
                      </span>
                    </td>

                    {/* Format Purchase Date representation */}
                    <td className="px-6 py-4 text-slate-600 text-xs font-mono">
                      {item.date}
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex gap-2">
                        <button
                          id={`btn-edit-${item.id}`}
                          onClick={() => startEdit(item)}
                          className="p-1 px-2.5 rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 bg-white shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                        <button
                          id={`btn-delete-${item.id}`}
                          onClick={() => onDelete(item.id)}
                          className="p-1 px-2.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 hover:text-red-600 text-red-500 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
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
    </div>
  );
}
