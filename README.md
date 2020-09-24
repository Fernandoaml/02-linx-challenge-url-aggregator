## Parte 2 - Agregador de URLs

Recebemos um dump com lista de URLs de imagens de produtos que vamos utilizar para manter nossa base de dados atualizada.
Este dump contém imagens de milhões de produtos e URLs, e é atualizado a cada 10 minutos:

```json
{"productId": "pid2", "image": "http://www.linx.com.br/platform-test/6.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/1.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/2.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/7.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/3.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/1.png"}
{"productId": "pid2", "image": "http://www.linx.com.br/platform-test/5.png"}
{"productId": "pid2", "image": "http://www.linx.com.br/platform-test/4.png"}
```

As URLs pertencem a uma empresa terceirizada que hospeda a maioria destas imagens, e ela nos cobra um valor fixo por cada request.
Já sabemos que o dump de origem não tem uma boa confiabilidade, pois encontramos várias imagens repetidas e boa parte delas também retornam status 404.
Como não é interessante atualizar nossa base com dados ruins, filtramos apenas as URLs que retornam status 200.

O processo de atualização deve receber como input um dump sanitizado, onde o formato é ligeiramente diferente da entrada:

```json
{"productId": "pid1", "images": ["http://www.linx.com.br/platform-test/1.png", "http://www.linx.com.br/platform-test/2.png", "http://www.linx.com.br/platform-test/7.png"]}
{"productId": "pid2", "images": ["http://www.linx.com.br/platform-test/3.png", "http://www.linx.com.br/platform-test/5.png", "http://www.linx.com.br/platform-test/6.png"]}
```

Para diminuir a quantidade de requests necessárias para validar as URLs, decidimos limitar a quantidade de imagens por produto em até 3.
O seu objetivo é criar um programa que gera o dump final no menor tempo possível e com o mínimo de requests desnecessárias (já que existe um custo fixo por requisição).

O arquivo [input-dump.gz](./input-dump.gz) é um exemplo do dump de entrada. E você pode usá-lo para testar sua implementação.
Também criamos uma api que responde as URLs do `input-dump.gz`. Ela é apenas um mock, mas vai te ajudar a implementar a solução do desafio. Para executá-la, basta:

```shell
gem install sinatra
ruby url-aggregator-api.rb
```