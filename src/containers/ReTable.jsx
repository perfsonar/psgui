import React, { Component } from 'react';
import { useTable } from "react-table";
import styled from 'styled-components';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    font-size:0.8rem;
    text-align: right;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.1rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => {
          const hgProps = headerGroup.getHeaderGroupProps();
          const { key: hgKey, ...hgRest } = hgProps;

          return (
            <tr key={hgKey} {...hgRest}>
              {headerGroup.headers.map((column) => {
                const colProps = column.getHeaderProps();
                const { key: colKey, ...colRest } = colProps;

                return (
                  <th key={colKey} {...colRest}>
                    {column.render("Header")}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);

          const rowProps = row.getRowProps();
          const { key: rowKey, ...rowRest } = rowProps;

          return (
            <tr key={rowKey} {...rowRest}>
              {row.cells.map((cell) => {
                const cellProps = cell.getCellProps();
                const { key: cellKey, ...cellRest } = cellProps;

                return (
                  <td key={cellKey} {...cellRest}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

class ReTable extends Component {

  render() {
		return (
      <Styles>
        <Table columns={this.props.columns} data={this.props.data} />
      </Styles>
    );
	}
}

export default ReTable;
