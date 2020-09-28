---
description: organize the dump file and expose over less time. api with sanitized data.
---

# 02-linx-challenge-url-aggregator

> ### Parte 2 - Agregador de URLs
>
> Recebemos um dump com lista de URLs de imagens de produtos que vamos utilizar para manter nossa base de dados atualizada. Este dump contém imagens de milhões de produtos e URLs, e é atualizado a cada 10 minutos:

```text
{"productId": "pid2", "image": "http://www.linx.com.br/platform-test/6.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/1.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/2.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/7.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/3.png"}
{"productId": "pid1", "image": "http://www.linx.com.br/platform-test/1.png"}
{"productId": "pid2", "image": "http://www.linx.com.br/platform-test/5.png"}
{"productId": "pid2", "image": "http://www.linx.com.br/platform-test/4.png"}
```

> As URLs pertencem a uma empresa terceirizada que hospeda a maioria destas imagens, e ela nos cobra um valor fixo por cada request. Já sabemos que o dump de origem não tem uma boa confiabilidade, pois encontramos várias imagens repetidas e boa parte delas também retornam status 404. Como não é interessante atualizar nossa base com dados ruins, filtramos apenas as URLs que retornam status 200.
>
> O processo de atualização deve receber como input um dump sanitizado, onde o formato é ligeiramente diferente da entrada:

```text
{"productId": "pid1", "images": ["http://www.linx.com.br/platform-test/1.png", "http://www.linx.com.br/platform-test/2.png", "http://www.linx.com.br/platform-test/7.png"]}
{"productId": "pid2", "images": ["http://www.linx.com.br/platform-test/3.png", "http://www.linx.com.br/platform-test/5.png", "http://www.linx.com.br/platform-test/6.png"]}
```

> Para diminuir a quantidade de requests necessárias para validar as URLs, decidimos limitar a quantidade de imagens por produto em até 3. O seu objetivo é criar um programa que gera o dump final no menor tempo possível e com o mínimo de requests desnecessárias \(já que existe um custo fixo por requisição\).
>
> O arquivo [input-dump.gz](/challenges_faml/02-linx-challenge-url-aggregator/-/blob/develop/./input-dump.gz) é um exemplo do dump de entrada. E você pode usá-lo para testar sua implementação. Também criamos uma api que responde as URLs do `input-dump.gz`. Ela é apenas um mock, mas vai te ajudar a implementar a solução do desafio. Para executá-la, basta:

> ```text
> gem install sinatra
> ruby url-aggregator-api.rb
> ```

## Solution:

* ReadDumpFileService:
  * The first step: the script require the input-dump.tar.gz in tmp/newFile folder. Where they are unzipped and the extracted file will be movendo to tmp/extracted folder. The script will be read the file convert data to string and remove leading and trailing white spaces, and delete the file. After this the collected data will be chunked in parts of 1000, and return this data.
* TriggerToProcessProducts:
  * This service, call another's services on in your execution order. createProductService and createProductCacheService After all return the execution time like image bellow.
  * I preferred save every data, data of bad images \(404\) in database redis, to decrease memory use, and processes in steps 1000 length of data size.
  * This step will be **chunk the 1000 data size**, I have tried to run many tasks in parallels, but occurredthere was an increase of 20 to 25% in processing, in addition to slowing down the process, where the minimum completion time was approximately 00:04:30. Where the simple prevailed being faster **~ 00:03:00**, as shown in the image below.

![](.gitbook/assets/output.png)

* Continuing:
  * The next step is verify what product id as in product list. If this product does not exist on list the script will be call the api to validate the image response, where if the return is false they will go to next interation and the bad image go to "404-Products-List" on redis to decrease the api's calls . And if they recive a true response the data will be pushed to productsList.
  *  When the data has in productsList the script will be verify if the image length is les than 3. If yes it will verify if the image link has existing on productList. If Not exist it will verify the response of api to especified image, using the same strategy to save image. Return a list of JSON data with good images, with max 3 images, with less consult to API.

```text
[
  {
    "productId": "pid1613",
    "image": [
      "http://localhost:4567/images/122578.png",
      "http://localhost:4567/images/122579.png",
      "http://localhost:4567/images/122577.png"
    ]
  },
  {
    "productId": "pid7471",
    "image": [
      "http://localhost:4567/images/177204.png"
    ]
  }
]
```

#### \*\*Obs: 

* _**I used Array.Map and Array.for to make the process more fast. exist others but ex: \(for...in\) lost performance, his is good to ordered list of data. And Array.ForEach is not good to asynchronous job.**_
* _**To be improve more performance, we can change the solution of read the file to use STREAM: A stream is an abstract interface for working with streaming data in Node.js. But i need improve more my knowlegd to make a good solution with STREAM.**_

## The architecture:

* The back-end is ready to be exported to a any version of JavaScript. Was used TypeScript and React to resolve the scarcity of developers with knowledge of leged versions.
* The persistence of data are ready to grow up or be change. Today we use Redis to Cache data, but it's ready to accept any other.
* The project is ready to be scaled. applying many type of solutions to that. At choice of project.

#### S.O.L.I.D principles / DDD and TDD.

I applied the DDD \(Domain-Driven Design\), segmented through knowledge area \(module/archive\). Applied to a few concepts of S.O.L.I.D, and developed with TDD applying unity tests.

#### Libraries:

* Dotenv: Loads environment variables from .env file.
* Express: Fast, unopinionated, minimalist web framework. REST.
* Reflect-metadata: Polyfill for Metadata Reflection API.
* Tsyringe: Lightweight dependency injection container for JavaScript/TypeScript.
* class-transformer: Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors.
* multer: Middleware for handling `multipart/form-data`.
* request-ip: A small node.js module to retrieve the request's IP address
* Redis: A robust, performance-focused and full-featured Redis client for Node.js.
* rate-limiter-flexible: library to prevent ddos.
* swagger-ui-express: Swagger UI Express.
* axios: Promise based HTTP client for the browser and node.js.
* chunk: Chunk converts arrays.
* decompress: Extracting archives made easy.
* move-file: Move a file - Even works across devices.
* remove-blank-lines: Remove blank lines from a string.

## Getting Start

1. You should be have the LTS version of the node.
   1. [https://nodejs.org/en/](https://nodejs.org/en/)
      1. Ex: 12.18.3 LTS
2. After the node js install, you should be install the yarn Package Manager
   1. **npm install -g yarn**
3. You need the docker on you computer.
   1. [https://www.docker.com/get-started](https://www.docker.com/get-started)
   2. You should run this command on command line interface with access to docker \( docker run --name redis -e ALLOW\_EMPTY\_PASSWORD=yes -p 6379:6379 -d bitnami/redis:latest \).
      1. don't need to change anything.
4. **You need clone the back end project:**
   1. [https://github.com/Fernandoaml/02-linx-challenge-url-aggregator](https://github.com/Fernandoaml/02-linx-challenge-url-aggregator)
   2. Go to the folder and on command line interface you must be run this command: **yarn**
   3. You need rename the \(**.env copy**\) file to **.env**
      1. And don't need to change anything.
   4. Download the archive with data to make the tests on bellow link:
      1. [https://1drv.ms/u/s!As2AL5ftMDFL\_UYmd\_4n3vyjgbvf?e=ueswi1](https://1drv.ms/u/s!As2AL5ftMDFL_UYmd_4n3vyjgbvf?e=ueswi1)
   5. Verify if the **input-dump.tar.gz**  _**\(is in tmp/newFile folder\).**_
      1. \*\*Remember: Jus One tar.gz file on newFile Folder. every time you will run the program you need put the tar.gz on newFile Folder. This simulate ex: the data has come from ftp or s3 has many possibility. And the run the script every 10 minutes, we can due with docker or manipulate the linux commands with our program.
5. **After run: yarn dev:server**
   1. Now in this step the script behind of the scene, is running the \(TriggerToProcessProducts.ts\) to expose the JSON data like a below image. Before the task as be complete if you consult the api url you will receive the follow message: _"We don't have all of data yet. Please try again later"_
   2. And when the task as completed you will receve the JSON data. like image below.
   3. \*Obs: For subsequent executions, this is when the "CRON JOB" is applied. D-1 data will be shown until the current process is completed

![](.gitbook/assets/json_ok.png)

## **Tests:**

* **Back End:**
  * To Back end i used the JEST to make the TDD aplying unity tests
  * If you're with command line opened, you must open a new interface of command line in the same folder and run the next command.
    * \*OBS: You need put the archive input-dump.tar.gz from Testes folder and run below command.
    * **yarn test**

![](.gitbook/assets/jest%20%281%29.png)

* **To see the coverage report \(Lcov-report\) you need to open the following file**:

  * \02-linx-challenge-url-aggregator\coverage\lcov-report\index.html

![](.gitbook/assets/licov.png)

## API - Swagger UI

* after of initialization of back-end. You will can access the Swagger page, to see the description of the API REST of 02-linx-challenge-url-aggregator. The page as exemplification, as shown in the image below.
  * [http://localhost:3333/swagger/](http://localhost:3333/swagger/) 

![](.gitbook/assets/swagger.png)

