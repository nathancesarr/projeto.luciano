const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    // gerente fixo
    if(email === "gerente@super.com" && senha === "1234"){
        req.session.role = "MANAGER";
        req.session.name = "Gerente";
        return res.redirect("/gerente");
    }

    const funcionario = await prisma.funcionario.findUnique({ where: { email } });

    if(!funcionario){
        return res.render('login', { error: 'Credenciais inválidas' });
    }

    const valido = await bcrypt.compare(senha, funcionario.senha);
    if(!valido){
        return res.render('login', { error: 'Credenciais inválidas' });
    }

    req.session.funcionarioId = funcionario.id;
    req.session.role = "EMPLOYEE";
    req.session.name = funcionario.nome;
    res.redirect("/produtos");
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect("/"));
};
