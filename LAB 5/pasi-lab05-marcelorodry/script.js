const state ={
    estadoRootContainerEnable: false,
  }
  
  const API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  
  window.addEventListener('load', function() {
    var xhrEstados = new XMLHttpRequest();
    xhrEstados.open('GET', 'https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    xhrEstados.onload = function() {
      if (xhrEstados.status === 200) {
        var estados = JSON.parse(xhrEstados.responseText);
        var select = document.getElementById('estados');
        estados.forEach(function(estado) {
          var option = document.createElement('option');
          option.text = estado.nome;
          option.value = estado.id;
          select.add(option);
        });
        select.addEventListener('change', function() {
          if (select.value !== '') {
            document.getElementById('cidade-desejada').style.display = 'block';
            var xhrCidades = new XMLHttpRequest();
            xhrCidades.open('GET', 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + select.value + '/municipios');
            xhrCidades.onload = function() {
              if (xhrCidades.status === 200) {
                var cidades = JSON.parse(xhrCidades.responseText);
                var selectCidades = document.getElementById('cidades');
                var verMaisButton = document.createElement('button'); // criando o botão
                verMaisButton.innerText = 'Ver mais'; // definindo o texto do botão
                selectCidades.parentNode.insertBefore(verMaisButton, selectCidades.nextSibling); // adicionando o botão na página
                selectCidades.style.display = 'block';
                selectCidades.innerHTML = '';
                cidades.forEach(function(cidade) {
                  var option = document.createElement('option');
                  option.text = cidade.nome;
                  option.value = cidade.id;
                  selectCidades.add(option);
                });
                verMaisButton.addEventListener('click', function() { // registrando o evento click no botão
                  if (selectCidades.value !== '') {
                    var xhrRegiao = new XMLHttpRequest();
                    xhrRegiao.open('GET', 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios/' + selectCidades.value);
                    xhrRegiao.onload = function() {
                      if (xhrRegiao.status === 200) {
                        var municipio = JSON.parse(xhrRegiao.responseText);
                        var divInfo = document.createElement('div');
                        divInfo.innerHTML = '<p>Nome da microrregião: ' + municipio.microrregiao.nome + '</p>' +
                                            '<p>Nome da mesorregião: ' + municipio.microrregiao.mesorregiao.nome + '</p>' +
                                            '<p>Nome da região: ' + municipio.microrregiao.mesorregiao.UF.regiao.nome + '</p>';
                        selectCidades.parentNode.insertBefore(divInfo, selectCidades.nextSibling); // adicionando a div de informações na página
                      } else {
                        console.log('Erro ao buscar as informações da região');
                      }
                    };
                    xhrRegiao.send();
                  }
                });
              } else {
                console.log('Erro ao buscar a lista de cidades');
              }
            };
            xhrCidades.send();
          } else {
            document.getElementById('cidade-desejada').style.display = 'none';
            document.getElementById('cidades').style.display = 'none';
          }
        });
      } else {
        console.log('Erro ao buscar a lista de estados');
      }      
    };
    xhrEstados.send();
  });
  
  
