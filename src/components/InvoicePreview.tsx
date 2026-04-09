import React from 'react';
import { InvoiceData } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalTaxes = data.taxes.reduce((sum, tax) => sum + (subtotal * (tax.rate / 100)), 0);
  const total = subtotal + totalTaxes - data.discount;

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-light text-gray-900 tracking-tight uppercase">{data.details.documentTitle ?? 'FAKTUR'}</h1>
            {data.details.paymentStatus && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                data.details.paymentStatus === 'Lunas' ? 'bg-green-100 text-green-800' :
                data.details.paymentStatus === 'Dibayar Sebagian' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {data.details.paymentStatus}
              </span>
            )}
          </div>
          <p className="text-gray-500 font-mono text-sm">{data.details.invoiceNumber}</p>
        </div>
        <div className="mt-6 md:mt-0 text-left md:text-right flex flex-col md:items-end">
          {data.business.logo && (
            <img src={data.business.logo} alt="Logo Bisnis" className="h-16 object-contain mb-3" />
          )}
          <h2 className="text-xl font-semibold text-gray-800">{data.business.name || 'Nama Perusahaan Anda'}</h2>
          <div className="text-gray-500 text-sm mt-2 space-y-1">
            <p className="whitespace-pre-line">{data.business.address}</p>
            <p>{data.business.email}</p>
            <p>{data.business.phone}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ditagihkan Kepada</h3>
            {data.client.logo && (
              <img src={data.client.logo} alt="Logo Klien" className="h-12 object-contain mb-3" />
            )}
            <h2 className="text-lg font-medium text-gray-800">{data.client.name || 'Nama Klien'}</h2>
            <div className="text-gray-500 text-sm mt-2 space-y-1">
              <p className="whitespace-pre-line">{data.client.address}</p>
              <p>{data.client.email}</p>
              <p>{data.client.phone}</p>
            </div>
          </div>
          {(data.client.email || data.client.phone) && (
            <div className="flex flex-col items-center ml-4">
              <QRCodeSVG 
                value={`MECARD:N:${data.client.name};EMAIL:${data.client.email};TEL:${data.client.phone};;`} 
                size={80} 
                level="L"
                includeMargin={false}
              />
              <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Kontak</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tanggal Terbit</h3>
            <p className="text-gray-800 font-medium">{data.details.issueDate ? new Date(data.details.issueDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Jatuh Tempo</h3>
            <p className="text-gray-800 font-medium">{data.details.dueDate ? new Date(data.details.dueDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/2">Item</th>
              <th className="py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Jml</th>
              <th className="py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Harga</th>
              <th className="py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-medium text-gray-800">{item.name || 'Nama Item'}</p>
                  {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                  {item.notes && <p className="text-xs text-gray-400 mt-1 italic">{item.notes}</p>}
                </td>
                <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                <td className="py-4 text-right text-gray-600">{data.currencySymbol}{formatNumber(item.price)}</td>
                <td className="py-4 text-right font-medium text-gray-800">{data.currencySymbol}{formatNumber(item.quantity * item.price)}</td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 italic">Belum ada item yang ditambahkan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary & Payment */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="w-full md:w-1/2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Informasi Pembayaran</h3>
          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 space-y-2">
            <p><span className="font-medium">Metode:</span> {data.payment.method}</p>
            {(data.payment.method === 'Transfer Bank' || data.payment.method === 'Lainnya') && (
              <>
                {data.payment.bankName && <p><span className="font-medium">Bank:</span> {data.payment.bankName}</p>}
                {data.payment.accountName && <p><span className="font-medium">Atas Nama:</span> {data.payment.accountName}</p>}
                {data.payment.accountNumber && <p><span className="font-medium">No. Rekening:</span> {data.payment.accountNumber}</p>}
              </>
            )}
            {data.payment.method === 'PayPal' && (
              <p><span className="font-medium">PayPal:</span> {data.payment.accountNumber}</p>
            )}
            {data.payment.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="whitespace-pre-line text-gray-500">{data.payment.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{data.currencySymbol}{formatNumber(subtotal)}</span>
          </div>
          {data.taxes.map(tax => (
            <div key={tax.id} className="flex justify-between text-gray-600">
              <span>{tax.name} ({tax.rate}%)</span>
              <span>{data.currencySymbol}{formatNumber(subtotal * (tax.rate / 100))}</span>
            </div>
          ))}
          {data.discount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Diskon</span>
              <span>-{data.currencySymbol}{formatNumber(data.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t-2 border-gray-800">
            <span>Total</span>
            <span>{data.currencySymbol}{formatNumber(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
