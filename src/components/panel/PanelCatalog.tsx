import type { ReactNode } from "react";

export type PanelColumn<T> = {
  header: string;
  width?: string;
  rowHeader?: boolean;
  className?: string;
  render: (item: T) => ReactNode;
};

export function PanelCatalog<T extends { id: string }>({
  items,
  caption,
  columns,
  renderCard,
  tableClassName,
  paddingClassName = "px-3 py-3",
  cardClassName = "",
  alignTop = false,
  scroll = false,
}: {
  items: T[];
  caption: string;
  columns: PanelColumn<T>[];
  renderCard: (item: T) => ReactNode;
  tableClassName: string;
  paddingClassName?: string;
  cardClassName?: string;
  alignTop?: boolean;
  scroll?: boolean;
}) {
  const hasWidths = columns.some((column) => column.width);

  return (
    <>
      <ul
        className={`flex flex-col gap-2 md:hidden ${
          items.length === 0
            ? "min-h-16 rounded-xl border border-cyan-500/30 bg-[#0c0e1a]/90"
            : ""
        }`}
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-3 ${cardClassName}`}
          >
            {renderCard(item)}
          </li>
        ))}
      </ul>

      <div
        className={`hidden rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 md:block ${
          scroll ? "overflow-x-auto" : "overflow-hidden"
        }`}
      >
        <table className={tableClassName}>
          <caption className="sr-only">{caption}</caption>
          {hasWidths ? (
            <colgroup>
              {columns.map((column) => (
                <col key={column.header} className={column.width} />
              ))}
            </colgroup>
          ) : null}
          <thead>
            <tr className="border-b border-cyan-500/20 font-cyber text-[10px] tracking-widest text-cyan-300 uppercase">
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className={`${paddingClassName} font-bold`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-slate-800 last:border-0 ${
                  alignTop ? "align-top" : ""
                }`}
              >
                {columns.map((column) => {
                  const className = column.rowHeader
                    ? `${paddingClassName} text-left text-sm font-semibold text-white ${column.className ?? ""}`
                    : `${paddingClassName} ${column.className ?? ""}`;

                  if (column.rowHeader) {
                    return (
                      <th key={column.header} scope="row" className={className}>
                        {column.render(item)}
                      </th>
                    );
                  }

                  return (
                    <td key={column.header} className={className}>
                      {column.render(item)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
