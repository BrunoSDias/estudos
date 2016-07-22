var app = {};
app.networkOffAlert = function(){
  if(Ti !== undefined){
    Ti.App.fireEvent('networkOffAlert');
  }
};

app.confirmTitanium = function(mensagem, strCallback){
  if(Ti !== undefined){
    Ti.App.fireEvent('confirmTitanium', {
      mensagem: mensagem,
      strCallback: strCallback
    });
  }
};

app.abrirNovaJanela = function(urlJavascript){
  if(Ti !== undefined){
    Ti.App.fireEvent('abrirNovaJanela', { url: urlJavascript });
  }
}

app.fecharJanelaGlobal = function(){
  if(Ti !== undefined){
    Ti.App.fireEvent('fecharJanelaGlobal');
  }
}

app.carregarDadosCadastro = function(){
  $.ajax( "http://local.com.br:3000/pessoas.json" ).done(function(dados) {
  	app.escreverDadosTabelaPessoa(dados);
  });
}

app.escreverDadosTabelaPessoa = function(dados){
  var html = "";
  for(var i=0; i<dados.length; i++){
    html += "<tr>";
    html += "<td>" + dados[i].nome + "</td>";
    html += "<td>" + dados[i].sobrenome + "</td>";
    html += "<td>" + dados[i].cpf + "</td>";
    html += "<td>" + dados[i].telefone + "</td>";
    html += "<td>" + dados[i].endereco + "</td>";
    html += "<td><a href='alterar.html?cpf=" + dados[i].cpf + "' class='btn btn-warning'>Alterar</a></td>";
    html += "<td><a href='#' onclick='app.excluirDados(\"" + dados[i].cpf + "\")' class='btn btn-danger'>Excluir</a></td>";
    html += "</tr>";
  }

  $("#registros #dados").html(html);
}

app.buscarPessoa = function(){
  $.ajax( 
    "http://local.com.br:3000/pessoas.json?nome=" + $(".botoes-pesquisa input#nome").val() 
  ).done(function(dados) {
    app.escreverDadosTabelaPessoa(dados);
  }).fail(function(err,status){
    alert("erro ao buscar dados do serviço");
    console.log(err);
    console.log(status);
  });
}

// app.excluirDados = function(cpf){
//   if(confirm("Deseja realmente excluir esta pessoa?")){
//     $.ajax( 
//       "http://local.com.br:3000/excluir.json?cpf=" + cpf 
//     ).done(function(pessoa) {
//       window.location.href = "index.html";
//     }).fail(function(err,status){
//       alert("erro ao excluir dados do serviço");
//       console.log(err);
//       console.log(status);
//     });
//   }
// }

app.excluirDados = function(cpf){
  app.confirmTitanium("Deseja realmente excluir esta pessoa?", "app.excluirForcado('" + cpf + "')");
}

app.excluirForcado = function(cpf){
  $.ajax( 
    "http://local.com.br:3000/excluir.json?cpf=" + cpf 
  ).done(function(pessoa) {
    window.location.href = "index.html";
  }).fail(function(err,status){
    alert("erro ao excluir dados do serviço");
    console.log(err);
    console.log(status);
  });
}


app.carregarDadosPessoa = function(){
  var url = window.location.href;
  if(url.indexOf("?cpf") != -1){
    var cpf = url.match(/cpf=.*/)[0].replace("cpf=", "");
    $.ajax( 
      "http://local.com.br:3000/pessoas.json?cpf=" + cpf 
    ).done(function(pessoa) {

      $("#nome").val(pessoa.nome);
      $("#sobrenome").val(pessoa.sobrenome);
      $("#cpf").val(pessoa.cpf);
      $("#telefone").val(pessoa.telefone);
      $("#endereco").val(pessoa.endereco);


    }).fail(function(err,dados){
      alert("erro ao buscar dados do serviço");
      console.log(err);
    });
  }
}

app.enviarDadosServico = function(){
  var url = window.location.href;
  if(url.indexOf("?cpf") != -1){
    var cpf = url.match(/cpf=.*/)[0].replace("cpf=", "");
    $.post( 
      "http://local.com.br:3000/alterar-pessoa.json?cpfAterar=" + cpf,
      { 
        nome:       $("#nome").val(), 
        sobrenome:  $("#sobrenome").val(), 
        cpf:        $("#cpf").val(), 
        telefone:   $("#telefone").val(), 
        endereco:   $("#endereco").val()
      }
    ).done(function(pessoa) {
      window.location.href = "index.html";
    }).fail(function(err,dados){
      alert("Erro ao alterar dados via serviço");
    });
  }
  else{
    $.post( 
      "http://local.com.br:3000/cadastrar-pessoa.json",
      { 
        nome:       $("#nome").val(), 
        sobrenome:  $("#sobrenome").val(), 
        cpf:        $("#cpf").val(), 
        telefone:   $("#telefone").val(), 
        endereco:   $("#endereco").val()
      }
    ).done(function(pessoa) {
      window.location.href = "index.html";
    }).fail(function(err,dados){
      alert("Erro ao incluir dados via serviço");
    });
  }

}

app.networkOffAlert();
app.carregarDadosCadastro();
app.carregarDadosPessoa();
