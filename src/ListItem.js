import React from 'react';

const ListItem = (props) => {
  return <li className="list-group-item">
    <div>
      <div><b>Cnpj.:</b> {props.item.cnpj}</div>
      <div><b>Nome.:</b> {props.item.nome}</div>
      <div><b>Logradouro.:</b> {props.item.logradouro}</div>
      <div><b>Numero.:</b> {props.item.numero}</div>
      <div><b>Complemento.:</b> {props.item.complemento}</div>
      <div><b>Municipio.:</b>{props.item.municipio}</div>
      <div><b>Uf.:</b> {props.item.uf}</div>
      <div><b>Cep.:</b>{props.item.cep}</div>
      <div><b>Telefone.:</b>{props.item.telefone}</div>
      <div><b>Email.:</b>{props.item.email}</div>
      <div>
        <button className="btn btn-info" onClick={props.editEmpresa}>Editar</button>
        <button className="btn btn-danger" onClick={props.deleteEmpresa}>Excluir</button>
      </div>
    </div>
  </li>;
};

export default ListItem;
