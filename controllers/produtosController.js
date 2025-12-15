const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listar = async (req, res) => {
    const funcionarioId = req.session.funcionarioId;

    const produtos = await prisma.produto.findMany({
        where: { funcionarioId: funcionarioId || -1 }
    });

    res.render("produtos", { produtos, user: req.session });
};

exports.criar = async (req, res) => {
    try {
        const funcionarioId = req.session.funcionarioId;
        const { nome, preco } = req.body;
        const precoFormatado = preco.replace(",", ".");
        const precoNumber = Number(precoFormatado);

        if (!funcionarioId) {
            return res.status(400).send("Funcionário não autenticado.");
        }

        if (isNaN(precoNumber)) {
            return res.status(400).send("Preço inválido.");
        }

        await prisma.produto.create({
            data: {
                nome,
                preco: precoNumber,
                funcionario: {
                    connect: { id: funcionarioId }
                }
            }
        });

        res.redirect("/produtos");

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar produto.");
    }
};

exports.editarForm = async (req, res) => {
    const id = Number(req.params.id);
    const funcionarioId = req.session.funcionarioId;

    const produto = await prisma.produto.findUnique({ where: { id } });

    if (!produto) return res.redirect('/produtos');
    if (produto.funcionarioId !== funcionarioId) return res.redirect('/produtos');

    res.render('produtos_editar', { produto, user: req.session });
};

exports.atualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const funcionarioId = req.session.funcionarioId;
        const { nome, preco } = req.body;
        const precoFormatado = preco.replace(",", ".");
        const precoNumber = Number(precoFormatado);

        if (isNaN(precoNumber)) {
            return res.status(400).send("Preço inválido.");
        }

        const produto = await prisma.produto.findUnique({ where: { id } });

        if (!produto || produto.funcionarioId !== funcionarioId) {
            return res.redirect('/produtos');
        }

        await prisma.produto.update({
            where: { id },
            data: {
                nome,
                preco: precoNumber
            }
        });

        res.redirect('/produtos');

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao atualizar produto.");
    }
};

exports.deletar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const funcionarioId = req.session.funcionarioId;

        const produto = await prisma.produto.findUnique({ where: { id } });

        if (!produto) return res.redirect('/produtos');
        if (produto.funcionarioId !== funcionarioId) return res.redirect('/produtos');

        await prisma.produto.delete({ where: { id } });

        res.redirect("/produtos");

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao deletar produto.");
    }
};
