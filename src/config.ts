const FALLBACK_BASE_URL = 'https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io';

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? FALLBACK_BASE_URL;

export const REQUEST_TIMEOUT_MS = 10_000;
