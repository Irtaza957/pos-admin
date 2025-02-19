import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "@/lib/utils/index";

export interface Header {
  key: string;
  label: string;
}

export interface GenericTableProps<T> {
  headers: Header[];
  data: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export function CommonTable<T>({ headers, data, renderRow, className }: GenericTableProps<T>) {
  return (
    <div className={cn("border rounded-lg overflow-auto h-[calc(100vh-340px)] no-scrollbar", className)}>
      <Table className="w-full border-collapse">
        <TableHeader className="bg-gray-100">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.key} className="p-2 text-left border-b whitespace-nowrap">
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? data?.map((row, index) => (
            <TableRow key={index} className="border-b">
              {renderRow(row, index)}
            </TableRow>
          )) : <TableRow>
            <TableCell colSpan={headers.length} className="text-center">No data found</TableCell>
          </TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
