const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.listar = async (req, res) => {
    try {
        const funcionarios = await prisma.funcionario.findMany();
        res.render("gerente", { funcionarios, user: req.session });
    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        res.status(500).send("Erro interno ao carregar a lista.");
    }
};

exports.criar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).send("Preencha todos os campos.");
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await prisma.funcionario.create({
            data: { nome, email, senha: senhaHash }
        });

        res.redirect("/gerente");
    } catch (error) {
        console.error("Erro ao criar funcionário:", error);
        res.status(500).send("Erro ao criar funcionário.");
    }
};

exports.editarForm = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const funcionario = await prisma.funcionario.findUnique({
            where: { id }
        });

        if (!funcionario) return res.redirect("/gerente");

        res.render("gerente_editar", { funcionario, user: req.session });
    } catch (error) {
        console.error("Erro ao carregar formulário de edição:", error);
        res.status(500).send("Erro ao carregar o funcionário.");
    }
};

exports.atualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome, email, senha } = req.body;

        const data = { nome, email };

        if (senha && senha.trim() !== "") {
            data.senha = await bcrypt.hash(senha, 10);
        }

        await prisma.funcionario.update({
            where: { id },
            data
        });

        res.redirect("/gerente");
    } catch (error) {
        console.error("Erro ao atualizar funcionário:", error);
        res.status(500).send("Erro ao atualizar.");
    }
};

exports.deletar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.funcionario.delete({
            where: { id }
        });

        res.redirect("/gerente");
    } catch (error) {
        console.error("Erro ao deletar funcionário:", error);
        res.status(500).send("Erro ao deletar funcionário.");
    }
};
