const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware para parse do corpo da requisição como JSON
app.use(express.static('public')); // Servir arquivos estáticos da pasta 'public'

// Função para validar nome
function validateName(name) {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return nameRegex.test(name);
}

// Função para validar telefone
function validatePhone(phone) {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone);
}

// Rota para salvar os dados dos pacientes
app.post('/api/pacientes', (req, res) => {
    const newPatient = req.body;

    if (!validateName(newPatient.name)) {
        return res.status(400).send('Nome inválido. Use apenas letras e espaços.');
    }

    if (!validatePhone(newPatient.phone)) {
        return res.status(400).send('Telefone inválido. Deve conter 10 ou 11 dígitos.');
    }

    fs.readFile('pacientes.json', (err, data) => {
        if (err && err.code === 'ENOENT') {
            // Se o arquivo não existir, inicialize com um array vazio
            fs.writeFile('pacientes.json', JSON.stringify([newPatient], null, 2), (err) => {
                if (err) {
                    console.error('Erro ao salvar pacientes.json:', err);
                    res.status(500).send('Erro ao salvar pacientes.');
                    return;
                }
                res.status(200).send('Paciente cadastrado com sucesso');
            });
        } else {
            if (err) {
                console.error('Erro ao ler pacientes.json:', err);
                res.status(500).send('Erro ao ler pacientes.');
                return;
            }
            let patients = JSON.parse(data);
            patients.push(newPatient);
            fs.writeFile('pacientes.json', JSON.stringify(patients, null, 2), (err) => {
                if (err) {
                    console.error('Erro ao salvar pacientes.json:', err);
                    res.status(500).send('Erro ao salvar pacientes.');
                    return;
                }
                res.status(200).send('Paciente cadastrado com sucesso');
            });
        }
    });
});

// Rota para salvar os dados dos agendamentos
app.post('/api/agendamentos', (req, res) => {
    const newAppointment = req.body;

    fs.readFile('agendamentos.json', (err, data) => {
        if (err && err.code === 'ENOENT') {
            // Se o arquivo não existir, inicialize com um array vazio
            fs.writeFile('agendamentos.json', JSON.stringify([newAppointment], null, 2), (err) => {
                if (err) {
                    console.error('Erro ao salvar agendamentos.json:', err);
                    res.status(500).send('Erro ao salvar agendamentos.');
                    return;
                }
                res.status(200).send('Agendamento cadastrado com sucesso');
            });
        } else {
            if (err) {
                console.error('Erro ao ler agendamentos.json:', err);
                res.status(500).send('Erro ao ler agendamentos.');
                return;
            }
            let appointments = JSON.parse(data);
            appointments.push(newAppointment);
            fs.writeFile('agendamentos.json', JSON.stringify(appointments, null, 2), (err) => {
                if (err) {
                    console.error('Erro ao salvar agendamentos.json:', err);
                    res.status(500).send('Erro ao salvar agendamentos.');
                    return;
                }
                res.status(200).send('Agendamento cadastrado com sucesso');
            });
        }
    });
});

// Rota para remover um agendamento específico pelo índice
app.delete('/api/agendamentos/:index', (req, res) => {
    const index = req.params.index;

    fs.readFile('agendamentos.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler agendamentos.json:', err);
            res.status(500).send('Erro ao ler agendamentos.');
            return;
        }

        let appointments = JSON.parse(data);

        if (index >= 0 && index < appointments.length) {
            // Remove o agendamento pelo índice
            appointments.splice(index, 1);

            // Salva o arquivo atualizado
            fs.writeFile('agendamentos.json', JSON.stringify(appointments, null, 2), (err) => {
                if (err) {
                    console.error('Erro ao salvar agendamentos.json:', err);
                    res.status(500).send('Erro ao salvar agendamentos.');
                    return;
                }
                res.status(204).send(); // Retorna 204 No Content em caso de sucesso na remoção
            });
        } else {
            res.status(404).send('Agendamento não encontrado');
        }
    });
});

// Rota para servir os dados dos pacientes
app.get('/api/pacientes', (req, res) => {
    fs.readFile('pacientes.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler pacientes.json:', err);
            res.status(500).send('Erro ao ler pacientes.');
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

// Rota para servir os dados dos agendamentos
app.get('/api/agendamentos', (req, res) => {
    fs.readFile('agendamentos.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler agendamentos.json:', err);
            res.status(500).send('Erro ao ler agendamentos.');
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

// Inicializa os arquivos JSON se não existirem
if (!fs.existsSync('pacientes.json')) {
    fs.writeFileSync('pacientes.json', '[]', 'utf-8');
}
if (!fs.existsSync('agendamentos.json')) {
    fs.writeFileSync('agendamentos.json', '[]', 'utf-8');
}

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
