import type { IBlogTableBlock } from "@/entities/blog/model/blog.types";

interface ITableBlockProps {
  block: IBlogTableBlock;
  baseKey: string;
}

export function TableBlock({ block, baseKey }: ITableBlockProps) {
  return (
    <div className="overflow-x-auto rounded-t-[16px]">
      <table className="min-w-full table-fixed border-collapse">
        <thead>
          <tr>
            {block.columns.map((column) => (
              <th
                key={`${baseKey}-${column}`}
                className="border-2 border-[#423762] bg-[#FFFFFF21] px-6 py-4 text-center text-[18px] font-normal leading-[22px] text-white"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={`${baseKey}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${baseKey}-${rowIndex}-${cellIndex}`}
                  className="border-2 border-[#423762] p-6 text-center text-[18px] font-normal leading-[22px] text-[#FFFFFF99]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
