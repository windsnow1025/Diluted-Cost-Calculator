import type {RawTransaction, Transaction} from "./Portfolio";

export function normalizeTransaction(raw: RawTransaction): Transaction {
  const hasTrade = raw.quantity !== undefined && raw.price !== undefined;
  const amount = hasTrade ? raw.quantity! * raw.price! : raw.amount!;
  return {
    date: raw.date,
    platform: raw.platform,
    type: raw.type,
    symbol: raw.symbol,
    ...(hasTrade ? {quantity: raw.quantity, price: raw.price} : {}),
    amount,
    fees: raw.fees,
    taxWithholding: raw.taxWithholding,
    netAmount: amount + raw.fees + raw.taxWithholding,
  };
}
