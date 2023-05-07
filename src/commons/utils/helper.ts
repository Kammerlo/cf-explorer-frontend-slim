import BigNumber from "bignumber.js";
import moment from "moment";
import { parse } from "qs";
import { setUserData } from "../../stores/user";
import { setUserData as setUser2Data } from "../../stores/user2";
import { getInfo, signIn } from "./userRequest";
import { NETWORK, NETWORK_TYPES } from "./constants";
BigNumber.config({ EXPONENTIAL_AT: [-50, 50] });

export const alphaNumeric = /[^0-9a-zA-Z]/;

export const regexEmail = /^[\w\.\+\-]+@([\w-]+\.)+[\w-]{2,4}$/;

export const getShortWallet = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

export const getShortHash = (address: string) => {
  return `${address.slice(0, 10)}...${address.slice(-7)}`;
};

export const LARGE_NUMBER_ABBREVIATIONS = ["", "K", "M", "B", "T", "q", "Q", "s", "S"];

export const formatPrice = (value?: string | number, abbreviations: string[] = LARGE_NUMBER_ABBREVIATIONS): string => {
  if (!value) return `0${abbreviations[0]}`;
  const bigValue = new BigNumber(value);
  const length = bigValue.toFixed(0).length;
  const exponential = Math.floor((length - 1) / 3) * 3;
  const newValue = bigValue
    .div(10 ** exponential)
    .toString()
    .match(/^-?\d+(?:\.\d{0,2})?/);
  const syntax = abbreviations[exponential / 3];
  return `${newValue && newValue[0]}${syntax ?? `x 10^${exponential}`}`;
};

export const numberWithCommas = (value?: number | string, decimal: number = 18) => {
  if (!value) return "0";
  const formated = value.toString().match(new RegExp(`^-?\\d+(?:\\.\\d{0,${decimal}})?`))?.[0] || "0";
  return formated.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const formatADA = (value?: string | number, abbreviations: string[] = LARGE_NUMBER_ABBREVIATIONS): string => {
  if (!value) return `0${abbreviations[0]}`;
  const realAda = new BigNumber(value).div(10 ** 6);
  if (realAda.gte(10 ** 6)) {
    const length = realAda.toFixed(0).length;
    const exponential = Math.floor((length - 1) / 3) * 3;

    if (exponential > 5) {
      const newValue = realAda
        .div(10 ** exponential)
        .toFixed(2, 3)
        .toString();
      const syntax = abbreviations[exponential / 3];

      return `${newValue}${syntax ?? `x 10^${exponential}`}`;
    }
  }
  return numberWithCommas(realAda.toString());
};

export const formatADAFull = (value?: string | number): string => {
  if (!value) return `0`;
  const realAda = new BigNumber(value).div(10 ** 6);
  return numberWithCommas(realAda.toFixed(6).toString());
};

export const exchangeADAToUSD = (value: number | string, rate: number, isFull?: boolean) => {
  if (!value) return 0;
  const realAda = new BigNumber(value);
  const exchangedValue = realAda.multipliedBy(rate).toString();

  if (isFull) return formatADAFull(exchangedValue);

  return formatADA(exchangedValue);
};

export const handleClicktWithoutAnchor = (e: React.MouseEvent, fn: (e: React.MouseEvent) => void): void => {
  let parent: Element | null = e.target as Element;
  while (parent !== null && parent?.tagName !== "A" && parent?.tagName !== "BUTTON") {
    parent = parent?.parentElement;
  }
  if (parent) {
    return;
  }
  fn(e);
};

export const isExtenalLink = (href?: string) => href && (href.search("http://") >= 0 || href.search("https://") >= 0);
export const formatPercent = (percent?: number) => `${Math.round((percent || 0) * 100 * 100) / 100}%`;

export const getPageInfo = (search: string): { page: number; size: number } => {
  const query = parse(search.split("?")[1]);
  const page = Number(query.page) > 0 ? Number(query.page) - 1 : 0;
  const size = Number(query.size) > 0 ? Number(query.size) : 50;
  return { page, size };
};

export const removeAuthInfo = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("walletId");
  localStorage.removeItem("email");
  localStorage.removeItem("persist:user");
  localStorage.setItem("cf-wallet-connected", "false");
  localStorage.removeItem("cf-last-connected-wallet");
  setUserData(null);
};

export const handleSignIn = async (username: string, password: string, cbSuccess?: () => void) => {
  try {
    const payload = {
      username,
      password,
      type: 0
    };
    const response = await signIn(payload);
    const data = response.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("walletId", data.walletId);
    localStorage.setItem("email", data.email);
    localStorage.setItem("login-type", "normal");

    const userInfo = await getInfo({ network: NETWORK_TYPES[NETWORK] });
    setUserData({...userInfo.data, loginType: "normal"});
    cbSuccess?.();
  } catch (error) {
    removeAuthInfo();
  }
};

export const formatDateTime = (date: string) => {
  return moment(date).format("MM/DD/YYYY HH:mm:ss");
};
export const formatDateTimeLocal = (date: string) => {
  return moment(moment(`${date} GMT+0000`).local(true)).format("MM/DD/YYYY HH:mm:ss");
};

export const getEpochSlotNo = (data: IDataEpoch) => {
  if (data.status === "FINISHED") {
    return data.maxSlot;
  }
  return moment().diff(moment(data.startTime), "seconds");
};


export function formatHash(hash: string): string {
  const prefix = hash.slice(0, 6);
  const suffix = hash.slice(-5);
  return `${prefix}...${suffix}`;
}