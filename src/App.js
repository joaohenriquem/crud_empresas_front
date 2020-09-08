import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import loadingGif from './loading.gif';
import './App.css';
import Autocomplete from './AutoComplete';
import ListItem from './ListItem';


class App extends Component {
  constructor() {
    
    super();
    this.state = {
      newEmpresa: '',
      editing: false,
      editingIndex: null,
      notification: null,
      empresas: [],
      loading: true,
      codigo: 0,
      cnpj: '',
      nome : '',
      logradouro: '',
      numero: 0,
      complemento: '',
      municipio: '',
      uf: '',
      cep : '',
      telefone: '',
      email : '',
      cnpjs : [],
      abriu : 'S'
    };
      
    this.apiUrl = 'http://localhost:3001';
    this.apiUrlReceita = 'http://www.receitaws.com.br/v1/cnpj';
    this.alert = this.alert.bind(this);
    this.addEmpresa = this.addEmpresa.bind(this);
    this.updateEmpresa = this.updateEmpresa.bind(this);
    this.deleteEmpresa = this.deleteEmpresa.bind(this);
    this.listEmpresa = this.listEmpresa.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    this.listEmpresa();
  }

  async listEmpresa(){

    var query = ``;

    if (this.state.cnpj != ''){
        query = `
          {
            findEmpresa(input: { cnpj : "${this.state.cnpj}"
            })
            {
              _id,
              codigo,
              cnpj,
              nome ,
              logradouro,
              numero,
              complemento,
             municipio,
              uf,
              cep ,
             telefone,
              email
           }
          }`;
      }
    else{
      query = `
        {
          findEmpresa(input: {
          })
          {
            _id,
            codigo,
            cnpj,
            nome ,
            logradouro,
            numero,
            complemento,
           municipio,
            uf,
            cep ,
           telefone,
            email
         }
        }`;

        if (this.state.nome != ''){
          query = `
            {
              findEmpresa(input: { nome : "${this.state.nome}"
              })
              {
                _id,
                codigo,
                cnpj,
                nome ,
                logradouro,
                numero,
                complemento,
               municipio,
                uf,
                cep ,
               telefone,
                email
             }
            }`;
        }
      else{
        query = `
          {
            findEmpresa(input: {
            })
            {
              _id,
              codigo,
              cnpj,
              nome ,
              logradouro,
              numero,
              complemento,
              municipio,
              uf,
              cep ,
              telefone,
              email
           }
          }`;
        }
    }

    const response = await axios.post(`${this.apiUrl}/graphql`, {
      query: query
    });

    setTimeout(() => {
      
      this.setState({
        empresas: response.data.data.findEmpresa,
        loading: false
      });

      this.state.empresas.forEach(empresa => {
        console.log(empresa);
        this.state.cnpjs.push(empresa.cnpj);
      });
  
    }, 1000);
    
   
    console.log(this.state.cnpjs);
    
    if(this.state.empresas.length == 0 && this.state.cnpj != ''){

      var resp = window.confirm('Não foi encontrado nenhum registro, deseja cadastrar?');
      query = `
      {
        findEmpresaReceita(cnpj : ${this.state.cnpj.toString().replace('.','').replace('/','').replace('-','').replace('.','')}) {
          _id
          codigo
          cnpj
          nome
          logradouro
          numero
          complemento
          municipio
          uf
          cep
          telefone
          email
        }
      }
      `;
    
      if(resp == true ){
       
        const response = await axios.post(`${this.apiUrl}/graphql`, {
          query: query
        });
        
        var ret = response.data.data.findEmpresaReceita;

        console.log(ret);
        this.setState({     
          nome : `${ret.nome}`,
          logradouro:`${ret.logradouro}`,
          numero: `${ret.numero}`,
          complemento: `${ret.complemento}`,
          municipio:`${ret.municipio}`,
          uf: `${ret.uf}`,
          cep : `${ret.cep}`,
          telefone: `${ret.telefone}`,
          email : `${ret.email}`
        });
      }
      }   
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleChange(event) {
     this.setState({ newEmpresa : event.target.value });
  }

  async addEmpresa() {
    const response = await axios.post(`${this.apiUrl}/graphql`, 
    {
      query: `mutation{
          insertEmpresa(input:{
            cnpj: "${this.state.cnpj}",
            nome : "${this.state.nome}",
            logradouro: "${this.state.logradouro}",
            numero: ${this.state.numero},
            complemento: "${this.state.complemento}",
            municipio: "${this.state.municipio}",
            uf: "${this.state.uf}",
            cep : "${this.state.cep}",
            telefone: "${this.state.telefone}",
            email : "${this.state.email}"
          }){
            _id,
            codigo,
            cnpj,
            nome ,
            logradouro,
            numero,
            complemento,
            municipio,
            uf,
            cep ,
            telefone,
            email
          }
        }
        `
    });

    const empresas = this.state.empresas;
    empresas.push(response.data);

    this.setState({
      empresas: empresas,
      newEmpresa: {},
      codigo: 0,
      cnpj: '',
      nome : '',
      logradouro: '',
      numero: 0,
      complemento: '',
      municipio: '',
      uf: '',
      cep : '',
      telefone: '',
      email : ''
    });

    this.alert('Registro incluido com sucesso!!');
    this.listEmpresa();
  }

  editEmpresa(index) {
    const empresa = this.state.empresas[index];
    this.setState({
      editing: true,
      newEmpresa: '',
      cnpj: empresa.cnpj,
      nome : empresa.nome,
      logradouro: empresa.logradouro,
      numero: empresa.numero,
      complemento: empresa.complemento,
      municipio: empresa.municipio,
      uf: empresa.uf,
      cep : empresa.cep,
      telefone: empresa.telefone,
      email : empresa.email,
      editingIndex: index
    });
  }

  async updateEmpresa() {
    const empresa = this.state.empresas[this.state.editingIndex];
    const response = await axios.post(`${this.apiUrl}/graphql`, 
    {
      query :`
      mutation{
        updateEmpresa(codigo: ${empresa.codigo}, input :{
          cnpj: "${this.state.cnpj}",
          nome : "${this.state.nome}",
          logradouro: "${this.state.logradouro}",
          numero: ${this.state.numero},
          complemento: "${this.state.complemento}",
          municipio: "${this.state.municipio}",
          uf: "${this.state.uf}",
          cep : "${this.state.cep}",
          telefone: "${this.state.telefone}",
          email : "${this.state.email}"
        })
        }`
    });

    console.log(response);

    const empresas = this.state.empresas;
    empresas[this.state.editingIndex] = {
      cnpj: this.state.cnpj,
      nome : this.state.nome,
      logradouro: this.state.logradouro,
      numero: this.state.numero,
      complemento: this.state.complemento,
      municipio: this.state.municipio,
      uf: this.state.uf,
      cep : this.state.cep,
      telefone: this.state.telefone,
      email : this.state.email
    };

    this.setState({
      empresas,
      editing: false,
      editingIndex: null,
      newEmpresa: {},
      codigo: 0,
      cnpj: '',
      nome : '',
      logradouro: '',
      numero: 0,
      complemento: '',
      municipio: '',
      uf: '',
      cep : '',
      telefone: '',
      email : ''
    });

    this.alert('Registro atualizado com sucesso.');
    this.listEmpresa();
  }

  alert(notification) {
    this.setState({
      notification
    });

    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);
  }

  async deleteEmpresa(index) {
    const empresas = this.state.empresas;
    const empresa = empresas[index];

    await axios.post(`${this.apiUrl}/graphql`,
    {
      query: 
      `mutation
      {
        deleteEmpresa(codigo : ${empresa.codigo} )
      }
      `
    });

    delete empresas[index];
    this.setState({ empresas });
    this.alert('Registro excluído com sucesso.');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React CRUD de empresas</h1>
        </header>
        <div className="container">
          {
            this.state.notification &&
            <div className="alert mt-3 alert-success">
              <p className="text-center">{this.state.notification}</p>
            </div>
          }

          <Autocomplete
              className="my-2 form-control"
              placeholder="Cnpj"
              options={
                    this.state.cnpjs
                  }
                />

          <input
            type="text"
            name="cnpj"
            className="my-2 form-control"
            placeholder="Cnpj"
            onChange={this.handleInputChange}
            value={this.state.cnpj}
          />

        <input
            type="text"
            name="nome"
            className="my-2 form-control"
            placeholder="Nome"
            onChange={this.handleInputChange}
            value={this.state.nome}
          />

          <button
            onClick={this.listEmpresa}
            className="btn-info mb-3 form-control"
            disabled={false}//{this.state.codigo.length < 5}
          >
            {'Pesquisar registro'}
          </button>

        <input
            type="text"
            name="logradouro"
            className="my-2 form-control"
            placeholder="Logradouro"
            onChange={this.handleInputChange}
            value={this.state.logradouro}
          />    

        <input
            type="number"
            name="numero"
            className="my-2 form-control"
            placeholder="Numero"
            onChange={this.handleInputChange}
            value={this.state.numero}
          />    

        <input
            type="text"
            name="complemento"
            className="my-2 form-control"
            placeholder="Complemento"
            onChange={this.handleInputChange}
            value={this.state.complemento}
          />    

        <input
            type="text"
            name="municipio"
            className="my-2 form-control"
            placeholder="Municipio"
            onChange={this.handleInputChange}
            value={this.state.municipio}
          />    

        <input
            type="text"
            name="uf"
            className="my-2 form-control"
            placeholder="Uf"
            onChange={this.handleInputChange}
            value={this.state.uf}
          />    

        <input
            type="text"
            name="cep"
            className="my-2 form-control"
            placeholder="Cep"
            onChange={this.handleInputChange}
            value={this.state.cep}
          />    

        <input
            type="text"
            name="telefone"
            className="my-2 form-control"
            placeholder="Telefone"
            onChange={this.handleInputChange}
            value={this.state.telefone}
          />   

        <input
            type="email"
            name="email"
            className="my-2 form-control"
            placeholder="Email"
            onChange={this.handleInputChange}
            value={this.state.email}
          />  

          <button
            onClick={this.state.editing ? this.updateEmpresa : this.addEmpresa}
            className="btn-success mb-3 form-control"
            disabled={false}//{this.state.codigo.length < 5}
          >
            {this.state.editing ? 'Atualizar registro' : 'Adicionar registro'}
          </button>
          {
            this.state.loading &&
            <img src={loadingGif} alt=""/>
          }
          {
            (!this.state.editing || this.state.loading) &&
            <ul className="list-group">
              {this.state.empresas.map((item, index) => {
                return <ListItem
                  key={item.codigo}
                  item={item}
                  editEmpresa={() => { this.editEmpresa(index); }}
                  deleteEmpresa={() => { this.deleteEmpresa(index); }}
                />;
              })}
            </ul>
          }
        </div>
      </div>
    );
  }
}

export default App;
