class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validar_dados(){
        for(let i in this)
        {
            // console.log(i,this[i])
            if(this[i] == undefined ||this[i] == null || this[i] == "")
            {
                return false
            }
         return true
        

        }
    }
}
class BD{
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
        
    }

    getProximoID(){
        let proximoId = localStorage.getItem('id')
        
        return parseInt(proximoId) + 1
    }

    gravar(d){
       
        let id = this.getProximoID()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperartodosregistros()
    {
        let despesas = Array()

       let id = localStorage.getItem('id')
        for(let i = 1; i <= id; i++)
        {
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null)
            {
                continue//ele vai pular para o proximo
            }

            despesa.id = i

            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
      let despesasFiltradas = Array()
      despesasFiltradas =  this.recuperartodosregistros()

      //ano
      if(despesa.ano != ''){
       despesasFiltradas = despesasFiltradas.filter(d=> d.ano == despesa.ano)
      }
      //mes
      if(despesa.mes != ''){
        despesasFiltradas = despesasFiltradas.filter(d=> d.mes == despesa.mes)
       }
      //dia
      if(despesa.dia != ''){
        despesasFiltradas = despesasFiltradas.filter(d=> d.dia == despesa.dia)
       }
      //tipo
      if(despesa.tipo != ''){
        despesasFiltradas = despesasFiltradas.filter(d=> d.tipo == despesa.tipo)
       }

      //descricao
      if(despesa.descricao != ''){
        despesasFiltradas = despesasFiltradas.filter(d=> d.descricao == despesa.descricao)
       }

      //valor
      if(despesa.valor != ''){
        despesasFiltradas = despesasFiltradas.filter(d=> d.valor == despesa.valor)
       }
       return despesasFiltradas
    }

    remover(id)
    {

        localStorage.removeItem(id)
        return true
    }
    
}

let bd = new BD

function cadastrarDespesa(){
    /*para recuperar o valor usar o .value*/
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

  let despesa = new Despesa(
      ano.value,
      mes.value,
      dia.value,
      tipo.value,
      descricao.value,
      valor.value
    )
    if(despesa.validar_dados() == true)
    {
     
      document.getElementById('modal_titulo').classList.add('text-sucess')
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('conteudo').innerHTML = 'SUCESSO AO INSERIR ITEMS'
        document.getElementById('conteudo').classList.add('text-info')
        document.getElementById('botao').classList.add('btn-outline-success')
        document.getElementById('botao').innerHTML = 'VOLTAR'
        bd.gravar(despesa)
        $('#aviso').modal('show')
        //para limpar eu não precisava ter selecionado dnvo ja que ja estava salvo em uma variavel
        document.getElementById('ano').value =""
        document.getElementById('mes').value =""
        document.getElementById('tipo').value =""
        document.getElementById('descricao').value =""
        document.getElementById('dia').value =""
        document.getElementById('valor').value =""
    }
    else
    {
        document.getElementById('modal_titulo').classList.add('text-danger')
        document.getElementById('modal_titulo').innerHTML = 'ERRO AO INSERIR DESPESA'
        document.getElementById('conteudo').innerHTML = 'EXISTEM CAMPOS VAZIOS OU NULOS, POR FAVOR VERIFIQUE'
        document.getElementById('conteudo').classList.add('text-warning')
        document.getElementById('botao').classList.add('btn-danger')
        document.getElementById('botao').innerHTML = 'VOLTAR E CORRIGIR'
       $('#aviso').modal('show')
    }
  
}
function modal(classetexto,titulo,mensagem,mensagemclasse,classebtn,textobtn){
    document.getElementById('modal_titulo').classList.add(classetexto)
    document.getElementById('modal_titulo').innerHTML = titulo
    document.getElementById('conteudo').innerHTML = mensagem
    document.getElementById('conteudo').classList.add(mensagemclasse)
    document.getElementById('botao').classList.add(classebtn)
    document.getElementById('botao').innerHTML = textobtn
   $('#aviso').modal('show')
}

function carregaLista(despesas = Array(),filtro = false)
{
    if(despesas.length == 0 && filtro == false)
    {

        despesas = bd.recuperartodosregistros()
    }

   let lista = document.getElementById('listadedespesas')
   lista.innerHTML = ''


   despesas.forEach(function(d) {
     
     var linha =  lista.insertRow()

    linha.insertCell(0).innerHTML =`${d.dia}/${d.mes}/${d.ano}` 
    

    //ajustar tipo
    switch(d.tipo)
    {
        case '1':
            d.tipo= 'Alimentação'
            break
        case '2':
            d.tipo = "Educação"
            break
        case '3':
            d.tipo = "Lazer"
          break
        case '4':
            d.tipo = "Saúde"
        break
        case '5':
            d.tipo = "Transporte"
            break

    }

    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = `R$ ${d.valor}`
    
    let btn = document.createElement("button")
    btn.className = "btn btn-outline-danger"
    btn.innerHTML=  '<i class="fa fa-times" aria-hidden="true"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function(){
        //removerrr

      let id = this.id.replace('id_despesa_','')



     
        if( bd.remover(id) == true){
           
       // modal('text-primary','EXCLUIDO COM SUCESSO',`O item de ID: foi excluido do sistema com sucesso`,'text-success','btn-outline-info','FECHAR')
       document.getElementById('modal_titulo').classList.add('text-primary')
       document.getElementById('modal_titulo').innerHTML = 'EXCLUIDO COM SUCESSO'
       document.getElementById('conteudo').innerHTML = `O item de ID:${id} foi excluido do sistema com sucesso`
       document.getElementById('conteudo').classList.add('text-success')
       document.getElementById('botao').classList.add('btn-outline-info')
       document.getElementById('botao').innerHTML = 'FECHAR'
      $('#aviso').modal('show')
        }
       
    }
    
    linha.insertCell(4).append(btn)
   })
}

function pesquisarDespesa(){

  
    let ano = document.getElementById('ano').value
    let dia = document.getElementById('dia').value
    let mes = document.getElementById('mes').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)
    
    let despesas = bd.pesquisar(despesa)
    
    this.carregaLista(despesas,true)

}

