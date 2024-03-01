const express = require('express') // importando o express para ser usado na aplicação
const app = express()

const uuid = require('uuid') // gerador de ids únicas na aplicação
app.use(express.json())

app.listen(3001) // escolhendo a porta para rodar a aplicação

const orders = []

const checkMethodAndUrl = (request, response, next) => { // middleware para que mostre o método da requisição (get, post, put, delete, etc) e a url
    const methodAndUrl = {
      method: request.method,
      url: request.url
    }

    console.log(methodAndUrl);

    next()
  }

const checkOrderId = (request, response, next) => { // verificação se o ID do pedido é válido ou inexistente
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

app.get('/order', checkMethodAndUrl, (request, response) => { // verificar todos os pedidos

    return response.json(orders)
})

app.get('/order/:id', checkMethodAndUrl, checkOrderId, (request, response) => { // retornando um pedido em específico

    const index = request.orderIndex;
    const orderId = orders[index]
    return response.json(orderId);
})

app.patch('/order/:id', checkMethodAndUrl, checkOrderId, (request, response) => { // alterando status do pedindo
    const index = request.orderIndex
    const { id, clientName, order, price } = orders[index];

    let status = orders[index].status;
    status = "Pedido Pronto";
    const finishedOrder = { id, order, clientName, price, status };
    orders[index] = finishedOrder;

    return response.json(finishedOrder); // respondendo com os dados atualizados do usuario

})

app.post('/order', checkMethodAndUrl, (request, response) => { // adicionando novo pedido

    const { order, clientName, price, status } = request.body
    const clientOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(clientOrder)

    return response.status(201).json(clientOrder)
})

app.put('/order/:id', checkMethodAndUrl, checkOrderId, (request, response) => { // alteração de pedido

    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)

})

app.delete('/order/:id', checkMethodAndUrl, checkOrderId, (request, response) => { // deletando pedido
    const index = request.orderIndex
    orders.splice(index, 1)

    return response.status(204).json(

    )
})
