import mongoose, { Document, model } from "mongoose";

export type TInvoice = {
  dueDate: any;
  status: string;
  invoiceNumber: string;
  paymentRecords: any;
  createdAt: number;
  updatedAt: any;
};

export interface IInvoice extends TInvoice, Document {}

const InvoiceSchema = new mongoose.Schema({
  dueDate: { type: Date },
  status: { type: String },
  invoiceNumber: { type: String },
  paymentRecords: {
    type: [
      {
        amountPaid: Number,
        datePaid: Date,
        paymentMethod: String,
        note: String,
        paidBy: String,
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const InvoiceModel = model<IInvoice>("InvoiceModel", InvoiceSchema);

export default InvoiceModel;
