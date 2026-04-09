export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  notes?: string;
  quantity: number;
  price: number;
}

export interface TaxItem {
  id: string;
  name: string;
  rate: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  documentTitle?: string;
  paymentStatus?: string;
}

export interface BusinessDetails {
  name: string;
  logo: string;
  address: string;
  email: string;
  phone: string;
}

export interface ClientDetails {
  name: string;
  logo: string;
  address: string;
  email: string;
  phone: string;
}

export interface PaymentDetails {
  method: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  notes: string;
}

export interface InvoiceData {
  details: InvoiceDetails;
  business: BusinessDetails;
  client: ClientDetails;
  items: InvoiceItem[];
  taxes: TaxItem[];
  discount: number;
  payment: PaymentDetails;
  currencySymbol: string;
}
