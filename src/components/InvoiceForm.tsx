import React, { useRef } from 'react';
import { InvoiceData, InvoiceItem, TaxItem } from '../types';
import { Plus, Trash2, Upload, X } from 'lucide-react';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const businessLogoRef = useRef<HTMLInputElement>(null);
  const clientLogoRef = useRef<HTMLInputElement>(null);

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'business' | 'client') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'business') {
          updateBusiness('logo', reader.result as string);
        } else {
          updateClient('logo', reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const updateDetails = (field: keyof typeof data.details, value: string) => {
    onChange({ ...data, details: { ...data.details, [field]: value } });
  };

  const updateBusiness = (field: keyof typeof data.business, value: string) => {
    onChange({ ...data, business: { ...data.business, [field]: value } });
  };

  const updateClient = (field: keyof typeof data.client, value: string) => {
    onChange({ ...data, client: { ...data.client, [field]: value } });
  };

  const updatePayment = (field: keyof typeof data.payment, value: string) => {
    onChange({ ...data, payment: { ...data.payment, [field]: value } });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      quantity: 1,
      price: 0,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const newItems = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  const addTax = () => {
    const newTax: TaxItem = {
      id: crypto.randomUUID(),
      name: 'Tax',
      rate: 0,
    };
    onChange({ ...data, taxes: [...data.taxes, newTax] });
  };

  const updateTax = (id: string, field: keyof TaxItem, value: string | number) => {
    const newTaxes = data.taxes.map((tax) =>
      tax.id === id ? { ...tax, [field]: value } : tax
    );
    onChange({ ...data, taxes: newTaxes });
  };

  const removeTax = (id: string) => {
    onChange({ ...data, taxes: data.taxes.filter((tax) => tax.id !== id) });
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm";
  const labelClasses = "block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider";
  const sectionClasses = "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6";
  const sectionTitleClasses = "text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100";

  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <div className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Detail Faktur</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClasses}>Judul Dokumen</label>
            <input
              type="text"
              className={inputClasses}
              value={data.details.documentTitle ?? ''}
              onChange={(e) => updateDetails('documentTitle', e.target.value)}
              placeholder="FAKTUR"
            />
          </div>
          <div>
            <label className={labelClasses}>Nomor Faktur</label>
            <input
              type="text"
              className={inputClasses}
              value={data.details.invoiceNumber}
              onChange={(e) => updateDetails('invoiceNumber', e.target.value)}
              placeholder="INV-001"
            />
          </div>
          <div>
            <label className={labelClasses}>Status Pembayaran</label>
            <select
              className={inputClasses}
              value={data.details.paymentStatus || 'Belum Dibayar'}
              onChange={(e) => updateDetails('paymentStatus', e.target.value)}
            >
              <option value="Belum Dibayar">Belum Dibayar</option>
              <option value="Dibayar Sebagian">Dibayar Sebagian</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Tanggal Terbit</label>
            <input
              type="date"
              className={inputClasses}
              value={data.details.issueDate}
              onChange={(e) => updateDetails('issueDate', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClasses}>Jatuh Tempo</label>
            <input
              type="date"
              className={inputClasses}
              value={data.details.dueDate}
              onChange={(e) => updateDetails('dueDate', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClasses}>Simbol Mata Uang</label>
            <input
              type="text"
              className={inputClasses}
              value={data.currencySymbol}
              onChange={(e) => onChange({ ...data, currencySymbol: e.target.value })}
              placeholder="Rp"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Details */}
        <div className={sectionClasses}>
          <h2 className={sectionTitleClasses}>Detail Anda</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Logo Bisnis</label>
              <div className="flex items-center gap-4">
                {data.business.logo ? (
                  <div className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                    <img src={data.business.logo} alt="Logo Bisnis" className="w-full h-full object-contain" />
                    <button 
                      onClick={() => updateBusiness('logo', '')}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => businessLogoRef.current?.click()}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors flex-shrink-0 bg-gray-50"
                  >
                    <Upload size={16} className="mb-1" />
                    <span className="text-[10px] font-medium">Unggah</span>
                  </button>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={businessLogoRef}
                  onChange={(e) => handleLogoUpload(e, 'business')}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    className={inputClasses}
                    value={data.business.name}
                    onChange={(e) => updateBusiness('name', e.target.value)}
                    placeholder="Nama Perusahaan Anda"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Alamat Email</label>
              <input
                type="email"
                className={inputClasses}
                value={data.business.email}
                onChange={(e) => updateBusiness('email', e.target.value)}
                placeholder="anda@perusahaan.com"
              />
            </div>
            <div>
              <label className={labelClasses}>Nomor Telepon</label>
              <input
                type="text"
                className={inputClasses}
                value={data.business.phone}
                onChange={(e) => updateBusiness('phone', e.target.value)}
                placeholder="+62 812 3456 7890"
              />
            </div>
            <div>
              <label className={labelClasses}>Alamat</label>
              <textarea
                className={inputClasses}
                rows={3}
                value={data.business.address}
                onChange={(e) => updateBusiness('address', e.target.value)}
                placeholder="Jl. Sudirman No. 123, Jakarta"
              />
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className={sectionClasses}>
          <h2 className={sectionTitleClasses}>Detail Klien</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Logo Klien</label>
              <div className="flex items-center gap-4">
                {data.client.logo ? (
                  <div className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                    <img src={data.client.logo} alt="Logo Klien" className="w-full h-full object-contain" />
                    <button 
                      onClick={() => updateClient('logo', '')}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => clientLogoRef.current?.click()}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors flex-shrink-0 bg-gray-50"
                  >
                    <Upload size={16} className="mb-1" />
                    <span className="text-[10px] font-medium">Unggah</span>
                  </button>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={clientLogoRef}
                  onChange={(e) => handleLogoUpload(e, 'client')}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    className={inputClasses}
                    value={data.client.name}
                    onChange={(e) => updateClient('name', e.target.value)}
                    placeholder="PT Klien Maju Bersama"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Alamat Email</label>
              <input
                type="email"
                className={inputClasses}
                value={data.client.email}
                onChange={(e) => updateClient('email', e.target.value)}
                placeholder="klien@contoh.com"
              />
            </div>
            <div>
              <label className={labelClasses}>Nomor Telepon</label>
              <input
                type="text"
                className={inputClasses}
                value={data.client.phone}
                onChange={(e) => updateClient('phone', e.target.value)}
                placeholder="+62 898 7654 3210"
              />
            </div>
            <div>
              <label className={labelClasses}>Alamat</label>
              <textarea
                className={inputClasses}
                rows={3}
                value={data.client.address}
                onChange={(e) => updateClient('address', e.target.value)}
                placeholder="Jl. Gatot Subroto No. 456, Jakarta"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Daftar Item</h2>
        <div className="space-y-4">
          {/* Header for larger screens */}
          <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider px-2">
            <div className="col-span-5">Deskripsi Item</div>
            <div className="col-span-2 text-center">Jml</div>
            <div className="col-span-2 text-right">Harga</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          {data.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-gray-50 p-4 md:p-2 rounded-xl md:bg-transparent md:border-b md:border-gray-100 md:rounded-none pb-4">
              <div className="col-span-1 md:col-span-5 space-y-2">
                <input
                  type="text"
                  className={inputClasses}
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Nama item"
                />
                <input
                  type="text"
                  className={`${inputClasses} text-gray-500`}
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Deskripsi (opsional)"
                />
                <input
                  type="text"
                  className={`${inputClasses} text-gray-500 text-xs`}
                  value={item.notes || ''}
                  onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                  placeholder="Catatan item (opsional)"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Kuantitas</label>
                <input
                  type="number"
                  min="1"
                  className={inputClasses}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Harga</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClasses}
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex items-center md:justify-end h-10">
                <label className="md:hidden text-xs text-gray-500 mr-2">Total:</label>
                <span className="font-medium text-gray-800">
                  {data.currencySymbol}{formatNumber(item.quantity * item.price)}
                </span>
              </div>
              <div className="col-span-1 flex justify-end md:justify-center items-center h-10">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                  title="Hapus item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors mt-2"
          >
            <Plus size={16} className="mr-2" />
            Tambah Item
          </button>
        </div>
      </div>

      {/* Totals & Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={sectionClasses}>
          <h2 className={sectionTitleClasses}>Metode Pembayaran</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Metode Pembayaran</label>
              <select
                className={inputClasses}
                value={data.payment.method}
                onChange={(e) => updatePayment('method', e.target.value)}
              >
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="PayPal">PayPal</option>
                <option value="Kartu Kredit">Kartu Kredit</option>
                <option value="Tunai">Tunai</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            {(data.payment.method === 'Transfer Bank' || data.payment.method === 'Lainnya') && (
              <>
                <div>
                  <label className={labelClasses}>Nama Bank</label>
                  <input
                    type="text"
                    className={inputClasses}
                    value={data.payment.bankName}
                    onChange={(e) => updatePayment('bankName', e.target.value)}
                    placeholder="mis. BCA, Mandiri"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    className={inputClasses}
                    value={data.payment.accountName}
                    onChange={(e) => updatePayment('accountName', e.target.value)}
                    placeholder="Budi Santoso"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Nomor Rekening</label>
                  <input
                    type="text"
                    className={inputClasses}
                    value={data.payment.accountNumber}
                    onChange={(e) => updatePayment('accountNumber', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
              </>
            )}
            {data.payment.method === 'PayPal' && (
              <div>
                <label className={labelClasses}>Email / Tautan PayPal</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={data.payment.accountNumber}
                  onChange={(e) => updatePayment('accountNumber', e.target.value)}
                  placeholder="paypal.me/budisantoso"
                />
              </div>
            )}
            <div>
              <label className={labelClasses}>Catatan Tambahan</label>
              <textarea
                className={inputClasses}
                rows={2}
                value={data.payment.notes}
                onChange={(e) => updatePayment('notes', e.target.value)}
                placeholder="Syarat pembayaran, ucapan terima kasih, dll."
              />
            </div>
          </div>
        </div>

        <div className={sectionClasses}>
          <h2 className={sectionTitleClasses}>Ringkasan</h2>
          <div className="space-y-4">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <label className={labelClasses + " mb-0"}>Pajak</label>
                <button 
                  onClick={addTax} 
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                >
                  <Plus size={14} className="mr-1" /> Tambah Pajak
                </button>
              </div>
              {data.taxes.map(tax => (
                <div key={tax.id} className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    className={`${inputClasses} flex-1`}
                    value={tax.name}
                    onChange={(e) => updateTax(tax.id, 'name', e.target.value)}
                    placeholder="Nama Pajak (mis. PPN)"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className={`${inputClasses} w-20 text-right`}
                      value={tax.rate}
                      onChange={(e) => updateTax(tax.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-gray-500 text-sm font-medium">%</span>
                    <button 
                      onClick={() => removeTax(tax.id)} 
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      title="Hapus pajak"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {data.taxes.length === 0 && (
                <p className="text-sm text-gray-400 italic">Tidak ada pajak yang diterapkan.</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className={labelClasses + " mb-0"}>Diskon ({data.currencySymbol})</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`${inputClasses} w-32 text-right`}
                value={data.discount}
                onChange={(e) => onChange({ ...data, discount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            
            <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{data.currencySymbol}{formatNumber(data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0))}</span>
              </div>
              {data.taxes.map(tax => (
                <div key={tax.id} className="flex justify-between text-sm text-gray-600">
                  <span>{tax.name} ({tax.rate}%)</span>
                  <span>{data.currencySymbol}{formatNumber(data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (tax.rate / 100))}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Diskon</span>
                <span>-{data.currencySymbol}{formatNumber(data.discount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>
                  {data.currencySymbol}{formatNumber(
                    data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) + 
                    data.taxes.reduce((sum, tax) => sum + (data.items.reduce((s, i) => s + (i.quantity * i.price), 0) * (tax.rate / 100)), 0) - 
                    data.discount
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
