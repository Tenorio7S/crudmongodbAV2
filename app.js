import express from "express";
import conectaNaDatabase from "./src/config/connect.js";

import Restaurante from "./src/models/restauranteModel.js";
import Pedido from "./src/models/pedidoModel.js";
import Cliente from "./src/models/clienteModel.js";

const app = express();

const conexao = conectaNaDatabase();

app.use(express.json());

app.listen(3000, () => {
  console.log("Servidor está rodando na porta 3000!");
});



// CRUD para Restaurantes



const restaurantes = [
  { id: 1, nome: "Restaurante A", tipo: "Comida Italiana", preco: "R$100,00"},
  { id: 2, nome: "Restaurante B", tipo: "Comida Mexicana", preco: "R$90,00"},
  { id: 3, nome: "Restaurante C", tipo: "Comida Japonesa", preco: "R$80,00"},
  { id: 4, nome: "Restaurante D", tipo: "Comida Chinesa", preco: "R$70,00"},
];


// Listar
app.get('/', (req, res) => {
  res.status(200).send('Inicio Restaurantes!')
})

app.get('/restaurantes', async (req, res) => {
  try {
    const restaurantesMongoDB = await Restaurante.find();
    const todosRestaurantes = [...restaurantes, ...restaurantesMongoDB];
    res.status(200).json(todosRestaurantes);
  } catch (error) {
    console.error("Erro ao buscar restaurantes:", error);
    res.status(500).json("Erro ao buscar restaurantes.");
  }
});

// Detalhes
app.get('/restaurantes/:id', async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id);
    if (restaurante) {
      res.status(200).json(restaurante);
    } else {
      res.status(404).send("Restaurante não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar restaurante por ID:", error);
    res.status(500).send("Erro ao buscar restaurante por ID.");
  }
});

// Adicionar
app.post('/restaurantes', async (req, res) => {
  try {
    const { nome, tipo, preco } = req.body;

    if (!nome || !tipo || !preco) {
      return res.status(400).json("Campos 'nome', 'tipo' e 'preco' são obrigatórios.");
    }
    const novoRestaurante = new Restaurante(req.body);
    await novoRestaurante.save();
    res.status(201).json({ message: "Restaurante cadastrado com sucesso!", restaurante: novoRestaurante});
  } catch (error) {
    console.error("Erro ao cadastrar restaurante:", error);
    res.status(500).json("Erro ao cadastrar restaurante.");
  }
});

// Atualizar
app.put('/restaurantes/:id', async (req, res) => {
  try {
    const restaurante = await Restaurante.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (restaurante) {
      res.status(200).json({ message: "Restaurante atualizado com sucesso!", restaurante });
    } else {
      res.status(404).send("Restaurante não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao atualizar restaurante:", error);
    res.status(500).send("Erro ao atualizar restaurante.");
  }
});

// Deletar
app.delete("/restaurantes/:id", async (req, res) => {
  try {
    const restaurante = await Restaurante.findByIdAndDelete(req.params.id);
    if (restaurante) {
      res.status(200).json("Restaurante deletado com sucesso!");
    } else {
      res.status(404).send("Restaurante não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao deletar restaurante:", error);
    res.status(500).send("Erro ao deletar restaurante.");
  }
});



// CRUD para Pedidos



const pedidos = [
  { numero: 1, items: ["Pizza", "Bebida"], quantidade: [2, 1], total: "R$100,00" },
  { numero: 2, items: ["Tacos", "Guacamole"], quantidade: [3, 1], total: "R$90,00" },
  { numero: 3, items: ["Sushi", "Sashimi"], quantidade: [2, 2], total: "R$80,00" },
  { numero: 4, items: ["Frango Xadrez", "Rolinho Primavera"], quantidade: [1, 4], total: "R$70,00" },
];

// Listar
app.get('/', (req, res) => {
  res.status(200).send('Início Pedidos!');
})

app.get('/pedidos', async (req, res) => {
  try {
    const pedidosMongoDB = await Pedido.find();
    const todosPedidos = [...pedidos, ...pedidosMongoDB];
    res.status(200).json(todosPedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json("Erro ao buscar pedidos.");
  }
});

// Detalhes
app.get('/pedidos/:numero', async (req, res) => {
  try {
    const pedido = await Pedido.findOne({ numero: req.params.numero });
    if (pedido) {
      res.status(200).json(pedido);
    } else {
      res.status(404).send("Pedido não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar pedido por número:", error);
    res.status(500).send("Erro ao buscar pedido por número.");
  }
});

// Adicionar
app.post('/pedidos', async (req, res) => {
  try {
    const { items, quantidade, total } = req.body;

    if (!items || !quantidade || !total) {
      return res.status(400).json("Campos 'items', 'quantidade' e 'total' são obrigatórios.");
    }

    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json({ message: "Pedido cadastrado com sucesso!", pedido: novoPedido });
  } catch (error) {
    console.error("Erro ao cadastrar pedido:", error);
    res.status(500).json("Erro ao cadastrar pedido.");
  }
});

// Atualizar
app.put('/pedidos/:numero', async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndUpdate({ numero: req.params.numero }, req.body, { new: true });
    if (pedido) {
      res.status(200).json({ message: "Pedido atualizado com sucesso!", pedido });
    } else {
      res.status(404).send("Pedido não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).send("Erro ao atualizar pedido.");
  }
});

// Deletar
app.delete("/pedidos/:numero", async (req, res) => {
  try {
    const pedido = await Pedido.findOneAndDelete({ numero: req.params.numero });
    if (pedido) {
      res.status(200).json("Pedido deletado com sucesso!");
    } else {
      res.status(404).send("Pedido não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    res.status(500).send("Erro ao deletar pedido.");
  }
});



// CRUD para Clientes



const clientes = [
  { id: 1, nome: "Cliente A", email: "clienteA@example.com", telefone: "123456789", pedidos: ["Pedido A1", "Pedido A2"] },
  { id: 2, nome: "Cliente B", email: "clienteB@example.com", telefone: "987654321", pedidos: ["Pedido B1", "Pedido B2"] },
  { id: 3, nome: "Cliente C", email: "clienteC@example.com", telefone: "555555555", pedidos: ["Pedido C1", "Pedido C2"] },
  { id: 4, nome: "Cliente D", email: "clienteD@example.com", telefone: "999999999", pedidos: ["Pedido D1", "Pedido D2"] },
];

// Listar
app.get('/', (req, res) => {
  res.status(200).send('Inicio Clientes!')
});

app.get('/clientes', async (req, res) => {
  try {
    // Replace Restaurante.find() with Cliente.find() based on your database model
    const clientesMongoDB = await Cliente.find();
    const todosClientes = [...clientes, ...clientesMongoDB];
    res.status(200).json(todosClientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json("Erro ao buscar clientes.");
  }
});

// Detalhes
app.get('/clientes/:id', async (req, res) => {
  try {
    // Replace Restaurante.findById() with Cliente.findById() based on your database model
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).send("Cliente não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    res.status(500).send("Erro ao buscar cliente por ID.");
  }
});

// Adicionar
app.post('/clientes', async (req, res) => {
  try {
    const { nome, email, telefone, pedidos } = req.body;

    if (!nome || !email || !telefone || !pedidos) {
      return res.status(400).json("Campos 'nome', 'email', 'telefone' e 'pedidos' são obrigatórios.");
    }
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.status(201).json({ message: "Cliente cadastrado com sucesso!", cliente: novoCliente });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json("Erro ao cadastrar cliente.");
  }
});

// Atualizar
app.put('/clientes/:id', async (req, res) => {
  try {
    // Replace Restaurante.findByIdAndUpdate() with Cliente.findByIdAndUpdate() based on your database model
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (cliente) {
      res.status(200).json({ message: "Cliente atualizado com sucesso!", cliente });
    } else {
      res.status(404).send("Cliente não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).send("Erro ao atualizar cliente.");
  }
});

// Deletar
app.delete("/clientes/:id", async (req, res) => {
  try {
    // Replace Restaurante.findByIdAndDelete() with Cliente.findByIdAndDelete() based on your database model
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (cliente) {
      res.status(200).json("Cliente deletado com sucesso!");
    } else {
      res.status(404).send("Cliente não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).send("Erro ao deletar cliente.");
  }
});


export default app;
