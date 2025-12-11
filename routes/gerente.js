const express = require("express");
const router = express.Router();
const gerente = require("../controllers/gerenteController");

router.get("/gerente", gerente.listar);
router.post("/gerente/criar", gerente.criar);
router.get("/gerente/editar/:id", gerente.editarForm);
router.post("/gerente/atualizar/:id", gerente.atualizar);
router.get("/gerente/deletar/:id", gerente.deletar);

module.exports = router;
