const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (email === "gerente@super.com" && senha === "1234") {
            req.session.role = "MANAGER";
            req.session.name = "Gerente";
            req.session.funcionarioId = null;
            return res.redirect("/gerente");
        }

        const funcionario = await prisma.funcionario.findUnique({ where: { email } });

        if (!funcionario) {
            return res.render('login', { error: 'Credenciais inválidas' });
        }

        const valido = await bcrypt.compare(senha, funcionario.senha);

        if (!valido) {
            return res.render('login', { error: 'Credenciais inválidas' });
        }
        
        req.session.funcionarioId = funcionario.id;
        req.session.role = "EMPLOYEE";
        req.session.name = funcionario.nome;

        return res.redirect("/produtos");

    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Erro no servidor' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect("/"));
};
