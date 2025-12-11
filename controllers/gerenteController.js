const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.listar = async (req,res)=>{
    const funcionarios = await prisma.funcionario.findMany();
    res.render("gerente",{ funcionarios, user: req.session });
}

exports.criar = async (req,res)=>{
    const { nome,email,senha } = req.body;
    const senhaHash = await bcrypt.hash(senha,10);

    await prisma.funcionario.create({
        data:{ nome,email,senha:senhaHash }
    });

    res.redirect("/gerente");
}

exports.editarForm = async (req,res)=>{
    const id = Number(req.params.id);
    const f = await prisma.funcionario.findUnique({ where: { id }});
    if(!f) return res.redirect('/gerente');
    res.render('gerente_editar', { funcionario: f, user: req.session });
}

exports.atualizar = async (req,res)=>{
    const id = Number(req.params.id);
    const { nome, email, senha } = req.body;
    const data = { nome, email };
    if(senha && senha.trim()!==''){
        data.senha = await bcrypt.hash(senha,10);
    }
    await prisma.funcionario.update({ where: { id }, data});
    res.redirect('/gerente');
}

exports.deletar = async (req,res)=>{
    await prisma.funcionario.delete({ where:{ id: Number(req.params.id) }});
    res.redirect("/gerente");
}
