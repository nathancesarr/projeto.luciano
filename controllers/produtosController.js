const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listar = async (req,res)=>{
    const produtos = await prisma.produto.findMany({
        where:{ funcionarioId: req.session.funcionarioId || -1 }
    });
    res.render("produtos",{ produtos, user: req.session });
}

exports.criar = async (req,res)=>{
    const { nome,preco } = req.body;
    await prisma.produto.create({
        data:{
            nome,
            preco: Number(preco),
            funcionarioId: req.session.funcionarioId
        }
    });
    res.redirect("/produtos");
}

exports.editarForm = async (req,res)=>{
    const id = Number(req.params.id);
    const p = await prisma.produto.findUnique({ where:{ id }});
    if(!p) return res.redirect('/produtos');
    if(p.funcionarioId !== req.session.funcionarioId) return res.redirect('/produtos');
    res.render('produtos_editar', { produto: p, user: req.session });
}

exports.atualizar = async (req,res)=>{
    const id = Number(req.params.id);
    const { nome, preco } = req.body;
    await prisma.produto.update({ where:{ id }, data:{ nome, preco: Number(preco) }});
    res.redirect('/produtos');
}

exports.deletar = async (req,res)=>{
    await prisma.produto.delete({ where:{ id: Number(req.params.id) }});
    res.redirect("/produtos");
}
