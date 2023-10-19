import mongoose, { Document } from "mongoose";

export type TInvoice = {};

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

const InvoiceModel = mongoose.model("InvoiceModel", InvoiceSchema);
export default InvoiceModel;
