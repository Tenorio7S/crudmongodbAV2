import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
    },
    items: [{
        restaurante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurante',
        required: true,
      },
    quantidade: {
        type: Number,
        required: true,
      },
    }],
    total: {
        type: Number,
        required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    }
  });
  
  const Pedido = mongoose.model("Pedido", pedidoSchema);

  export default Pedido;