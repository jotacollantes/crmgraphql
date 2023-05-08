import React from "react";

type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  empresa: string;
  email: string;
  vendedor: string;
};
interface Props {
  clientes: Cliente[];
}
const TableClients = ({ clientes }: Props) => {

  return (
    <table className="table-auto shadow-md mt-10 w-full w-lg">
      <thead className="bg-gray-800">
        <tr className="text-white">
          <th className="w-1/5 py-2">Nombre</th>
          <th className="w-1/5 py-2">Empresa</th>
          <th className="w-1/5 py-2">Email</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {clientes.map((cliente, ix: number) => {
          return (
            <tr key={ix}>
              <td className="border px-4 py-2">{`${cliente.nombre} ${cliente.apellido}`}</td>
              <td className="border px-4 py-2">{`${cliente.empresa}`}</td>
              <td className="border px-4 py-2">{`${cliente.nombre}`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableClients;
