export type TPayRarams = {
  pan: string;
  expire: string;
  cardholder: string;
  cvc: string;
};

export type TPayRes = {
  id: string;
  jsonrpc: string;
  result: { pid: string };
};

export type TCheckStatus = 'process' | 'ok' | 'fail';

export type TCheckPaymentRes = {
  status: TCheckStatus;
  pid: string;
};
