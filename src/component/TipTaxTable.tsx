import React, { useMemo, useState, useCallback } from "react";
import { useTable, Column } from "react-table";
import styled from "styled-components";
import "./TipTaxTable.css";

interface Order {
  id: number;
  name: string;
  subtotal: number;
}

interface TipTaxTableProps {
  taxRate: number;
  tipRate: number;
}

const TableStyles = styled.div`
  table {
    border-spacing: 0;
    width: 100%;
    border: 1px solid black;
    background-color: white;

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      text-align: right;

      :last-child {
        border-right: 0;
      }
    }

    th {
      background: #f0f0f0;
    }
  }

  .add-row {
    margin-top: 10px;
  }

  .remove-row {
    background: red;
    color: white;
    border: none;
    cursor: pointer;
  }

  .total {
    font-weight: bold;
  }
`;

const TipTaxTable: React.FC<TipTaxTableProps> = ({ taxRate, tipRate }) => {
  const [data, setData] = useState<Order[]>([
    { id: 1, name: "Person 1", subtotal: 0 },
    { id: 2, name: "Person 2", subtotal: 0 },
  ]);

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const newData = [...data];
      const parsedValue = parseFloat(value);
      newData[index].subtotal = isNaN(parsedValue) ? 0 : parsedValue;
      setData(newData);
    },
    [data]
  );

  const addRow = () => {
    const newRow: Order = {
      id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
      name: `Person ${data.length + 1}`,
      subtotal: 0,
    };
    setData([...data, newRow]);
  };

  const removeRow = (id: number) => {
    setData(data.filter((order) => order.id !== id));
  };

  const totalSubtotal = useMemo(() => {
    return data.reduce((total, order) => total + order.subtotal, 0);
  }, [data]);

  const totalTax = useMemo(() => {
    return (totalSubtotal * totalSubtotal) / 100;
  }, [totalSubtotal, taxRate]);

  const totalTip = useMemo(() => {
    return tipRate;
  }, [totalSubtotal, tipRate]);

  const totalBill = useMemo(() => {
    return totalSubtotal + totalTax + totalTip;
  }, [totalSubtotal, totalTax, totalTip]);

  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        Header: "Name",
        accessor: "name",
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
              value={row.original.subtotal.toString()}
              onChange={(e) => handleInputChange(row.index, e.target.value)}
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
                (row.original.subtotal /
                  (row.original.subtotal ? totalSubtotal : 1)) *
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
                (row.original.subtotal /
                  (row.original.subtotal ? totalSubtotal : 1)) *
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
                (row.original.subtotal * taxRate) / 100 +
                (row.original.subtotal * tipRate) / 100
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
    <TableStyles>
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
    </TableStyles>
  );
};

export default TipTaxTable;