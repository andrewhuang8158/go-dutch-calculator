import { useMemo, useState, useCallback } from "react";
import { useTable } from "react-table";
import "./TipTaxSplitter.css";

interface Order {
  id: number;
  name: string;
  subtotal: number;
}

interface ColumnOrder extends Order {
  tax?: number;
  tip?: number;
  total?: number;
  remove?: number;
}

const TipTaxSplitter = () => {
  const [data, setData] = useState<Order[]>([
    { id: 1, name: "Person 1", subtotal: 3 },
    { id: 2, name: "Person 2", subtotal: 5 },
  ]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [tipRate, setTipRate] = useState<number>(0);

  const handleNameChange = useCallback((index: number, value: string) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], name: value };
      return newData;
    });
  }, []);

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        setData((prevData) =>
          prevData.map((order, i) =>
            i === index ? { ...order, subtotal: parsedValue } : order
          )
        );
      }
    },
    [setData]
  );

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
          (order.subtotal / (totalSubtotal ? totalSubtotal : 1)) * taxRate || 0,
      0
    );
  }, [data, taxRate, totalSubtotal]);

  const totalTip = useMemo(() => {
    return data.reduce(
      (total, order) =>
        total +
          (order.subtotal / (totalSubtotal ? totalSubtotal : 1)) * tipRate || 0,
      0
    );
  }, [data, tipRate, totalSubtotal]);

  const totalBill = useMemo(() => {
    return totalSubtotal + totalTax + totalTip;
  }, [totalSubtotal, totalTax, totalTip]);

  const columns = useMemo<Column<ColumnOrder>[]>(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: { row: any }) =>
          row.original.id === -1 ? (
            <span>{row.original.name}</span>
          ) : (
            <input
              type="text"
              value={row.original.name}
              onChange={(e) => handleNameChange(row.index, e.target.value)}
              onFocus={(e) => e.target.select()}
              key={`name-${row.original.id}`}
              className="name-input"
              autoComplete="off"
            />
          ),
      },
      {
        Header: "Subtotal",
        accessor: "subtotal",
        Cell: ({ row }: { row: any }) =>
          row.original.id === -1 ? (
            <span>{totalSubtotal.toFixed(2)}</span>
          ) : (
            <input
              type="number"
              step="any"
              inputMode="numeric"
              value={row.original.subtotal}
              onChange={(e) => handleInputChange(row.index, e.target.value)}
              onFocus={(e) => e.target.select()}
              key={`subtotal-${row.original.id}`}
              autoComplete="off"
            />
          ),
      },
      {
        Header: "Tax",
        accessor: "tax",
        Cell: ({ row }: { row: any }) => {
          return row.original.id === -1 ? (
            <span>{totalTax.toFixed(2)}</span>
          ) : (
            <span>
              {(
                Math.round(
                  (row.original.subtotal /
                    (totalSubtotal ? totalSubtotal : 1)) *
                    100 *
                    taxRate || 0
                ) / 100
              ).toFixed(2)}
            </span>
          );
        },
      },
      {
        Header: "Tip",
        accessor: "tip",
        Cell: ({ row }: { row: any }) => {
          return row.original.id === -1 ? (
            <span>{totalTip.toFixed(2)}</span>
          ) : (
            <span>
              {(
                Math.round(
                  (row.original.subtotal /
                    (totalSubtotal ? totalSubtotal : 1)) *
                    100 *
                    tipRate || 0
                ) / 100
              ).toFixed(2)}
            </span>
          );
        },
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ row }: { row: any }) => {
          const subtotal = row.original.subtotal;
          const tax =
            Math.round(
              (row.original.subtotal / (totalSubtotal ? totalSubtotal : 1)) *
                100 *
                taxRate || 0
            ) / 100;
          const tip =
            Math.round(
              (row.original.subtotal / (totalSubtotal ? totalSubtotal : 1)) *
                100 *
                tipRate || 0
            ) / 100;

          const total = subtotal + tax + tip;

          return row.original.id === -1 ? (
            <span>{totalBill.toFixed(2)}</span>
          ) : (
            <span>{total.toFixed(2)}</span>
          );
        },
      },
      {
        Header: "Remove",
        accessor: "remove",
        Cell: ({ row }: { row: any }) =>
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
      <a
        className="law-checker-link"
        href="https://www.law.cornell.edu/wex/table_tax"
        target="_blank"
        rel="noopener noreferrer"
      >
        Look for your local tipping/tax laws!
      </a>
      <p>
        Tired of paying a fat tip when your order was cheaper than that $60
        steak? This has got you covered.
      </p>
      <p>
        This calculator table distributes the tax and tip proportionately to the
        subtotals of the dishes ordered.
      </p>
      <p>
        Simply input the tax amount paid, tip amount paid, and subtotals of all
        dishes ordered and the calculator will do the rest.
      </p>

      <div className="tax-rate-wrapper">
        <label htmlFor="taxRate">Tax Amount ($): </label>
        <input
          id="taxRate"
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          onFocus={(e) => e.target.select()}
          onBlur={(e) => {
            if (e.target.value.trim() === "") {
              setTaxRate(0);
            }
          }}
        />
      </div>
      <div className="tip-rate-wrapper">
        <label htmlFor="tipRate">Tip Amount ($): </label>
        <input
          id="tipRate"
          type="number"
          value={tipRate}
          onChange={(e) => setTipRate(parseFloat(e.target.value))}
          onFocus={(e) => e.target.select()}
          onBlur={(e) => {
            if (e.target.value.trim() === "") {
              setTipRate(0);
            }
          }}
        />
      </div>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th key={column.id}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                className={row.original.id === -1 ? "total" : ""}
              >
                {row.cells.map((cell: any) => (
                  <td key={cell.id} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="add-row" onClick={addRow}>
        Add Row
      </button>
      {/* {console.log("columns:", columns)}
      {console.log("rows:", rows)} */}
    </>
  );
};

export default TipTaxSplitter;
