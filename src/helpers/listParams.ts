export const PANEL_PAGE_SIZE = 15;

export function setParam(
  params: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  if (value) params.set(key, value);
  else params.delete(key);
}

export function readPageParam(searchParams: URLSearchParams) {
  const requestedPage = Number(searchParams.get("pagina"));
  return Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
}

export function setPageParam(
  params: URLSearchParams,
  page: number | undefined,
  resetPage: boolean,
) {
  if (resetPage) {
    params.delete("pagina");
    return;
  }

  if (page === undefined) return;

  if (page > 1) params.set("pagina", String(page));
  else params.delete("pagina");
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize = PANEL_PAGE_SIZE,
) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;

  return {
    pageCount,
    currentPage,
    visible: items.slice(pageStart, pageStart + pageSize),
  };
}
