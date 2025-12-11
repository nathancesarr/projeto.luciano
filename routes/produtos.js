const express = require("express");
const router = express.Router();
const produtos = require("../controllers/produtosController");

router.get("/produtos", produtos.listar);
router.post("/produtos/criar", produtos.criar);
router.get("/produtos/editar/:id", produtos.editarForm);
router.post("/produtos/atualizar/:id", produtos.atualizar);
router.get("/produtos/deletar/:id", produtos.deletar);

module.exports = router;
