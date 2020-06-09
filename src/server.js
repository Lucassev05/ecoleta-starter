const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db");

//configurar pasta publica
server.use(express.static("public"));

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }));
//utilizando template engine
const nunjuncks = require("nunjucks");
nunjuncks.configure("src/views", {
  express: server,
  noCache: true,
});

// configurar caminhos da minha aplicação
// pagina inicial
// req: requisição
// res: resposta
server.get("/", (req, res) => {
  return res.render("index.html");
});

server.get("/create-point", (req, res) => {
  // req.query: Query strings da nossa url
  return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {
  // req.body: corpo do formulário
  const query = `
    INSERT INTO places(
        name,
        image,
        address,
        address_complement,
        state,
        city,
        items
    ) VALUES (?,?,?,?,?,?,?);
  `;
  const values = [
    req.body.name,
    req.body.image,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ];
  function afterInsertData(err) {
    if (err) {
      return res.render("create-point.html", { errormsg: true });
    }
    return res.render("create-point.html", { saved: true });
  }
  db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {
  const search = req.query.search;
  if (search == "") {
    return res.render("search-results.html", { total: 0 });
  }
  // pegar os dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (
    err,
    rows
  ) {
    if (err) {
      return console.log(err);
    }
    const total = rows.length;
    // mostra a pagina html com os dados do banco
    return res.render("search-results.html", { places: rows, total });
  });
});

// ligar o servidor
server.listen(3000);
