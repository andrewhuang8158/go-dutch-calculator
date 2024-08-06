import React, { useMemo, useState, useCallback } from "react";
import { useTable, Column } from "react-table";
import "./TipTaxSplitter.css";

interface Order {
  id: number;
  name: string;
  subtotal: number;
}

interface TipTaxSplitterProps {
  taxRate: number;
  tipRate: number;
}

const TipTaxSplitter: React.FC<TipTaxSplitterProps> = ({
  taxRate,
  tipRate,
}) => {
  const [data, setData] = useState<Order[]>([
    { id: 1, name: "Person 1", subtotal: 0 },
    { id: 2, name: "Person 2", subtotal: 0 },
  ]);

  const handleNameChange = useCallback((index: number, value: string) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], name: value };
      return newData;
    });
  }, []);

  const handleInputChange = useCallback((index: number, value: string) => {
    setData((prevData) => {
      const newData = [...prevData];
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        newData[index] = { ...newData[index], subtotal: parsedValue };
      }
      return newData;
    });
  }, []);

  const addRow = useCallback(() => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 1,
        name: `Person ${prevData.length + 1}`,
        subtotal: 0,
      },
    ]);
  }, []);

  const removeRow = (id: number) => {
    setData(data.filter((order) => order.id !== id));
  };

  const totalSubtotal = useMemo(() => {
    return data.reduce((total, order) => total + order.subtotal, 0);
  }, [data]);

  const totalTax = useMemo(() => {
    return data.reduce(
      (total, order) =>
        total +
        (order.subtotal / (totalSubtotal ? totalSubtotal : 1)) * taxRate,
      0
    );
  }, [data, taxRate]);

  const totalTip = useMemo(() => {
    return data.reduce(
      (total, order) =>
        total +
        (order.subtotal / (totalSubtotal ? totalSubtotal : 1)) * tipRate,
      0
    );
  }, [data, tipRate]);

  const totalBill = useMemo(() => {
    return totalSubtotal + totalTax + totalTip;
  }, [totalSubtotal, totalTax, totalTip]);

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: any) =>
          row.original.id === -1 ? (
            <span>{row.original.name}</span>
          ) : (
            <input
              type="text"
              value={row.original.name}
              onChange={(e) => handleNameChange(row.index, e.target.value)}
              key={`name-${row.original.id}`}
              className="name-input"
            />
          ),
      },
      {
        Header: "Subtotal",
        accessor: "subtotal",
        Cell: ({ row }: any) =>
          row.original.id === -1 ? (
            <span>{totalSubtotal.toFixed(2)}</span>
          ) : (
            <input
              type="number"
              step="any"
              inputMode="numeric"
              value={row.original.subtotal}
              onChange={(e) => handleInputChange(row.index, e.target.value)}
              key={`subtotal-${row.original.id}`}
            />
          ),
      },
      {
        Header: "Tax",
        Cell: ({ row }: any) => {
          return row.original.id === -1 ? (
            <span>{totalTax.toFixed(2)}</span>
          ) : (
            <span>
              {(
                (row.original.subtotal / (totalSubtotal ? totalSubtotal : 1)) *
                taxRate
              ).toFixed(2)}
            </span>
          );
        },
      },
      {
        Header: "Tip",
        Cell: ({ row }: any) => {
          return row.original.id === -1 ? (
            <span>{totalTip.toFixed(2)}</span>
          ) : (
            <span>
              {(
                (row.original.subtotal / (totalSubtotal ? totalSubtotal : 1)) *
                tipRate
              ).toFixed(2)}
            </span>
          );
        },
      },
      {
        Header: "Total",
        Cell: ({ row }: any) => {
          return row.original.id === -1 ? (
            <span>{totalBill.toFixed(2)}</span>
          ) : (
            <span>
              {(
                row.original.subtotal +
                (row.original.subtotal / (totalSubtotal ? totalSubtotal : 1)) *
                  tipRate +
                (row.original.subtotal / (totalSubtotal ? totalSubtotal : 1)) *
                  taxRate
              ).toFixed(2)}
            </span>
          );
        },
      },
      {
        Header: "Remove",
        Cell: ({ row }: any) =>
          row.original.id === -1 ? null : (
            <button
              className="remove-row"
              onClick={() => removeRow(row.original.id)}
            >
              X
            </button>
          ),
      },
    ],
    [
      data,
      taxRate,
      tipRate,
      handleNameChange,
      handleInputChange,
      totalSubtotal,
      totalTax,
      totalTip,
      totalBill,
    ]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<Order>({
      columns,
      data: [...data, { id: -1, name: "Total", subtotal: totalSubtotal }],
    });

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={row.original.id === -1 ? "total" : ""}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="add-row" onClick={addRow}>
        Add Row
      </button>
    </>
  );
};

export default TipTaxSplitter;