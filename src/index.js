const express = require('express');
const { v4: uuidV4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = []

function verifyIfExistsAccountCPF(req,res,next){
    const { cpf } = req.headers;

    const customer = customers.find(customer => customer.cpf === cpf); 

    if(!customer){
        return res.status(404).json({error: "Customer not found"});
    }

    req.customer = customer;

    return next();
}

app.post("/account",   (req, res) => {

    const { cpf, name } = req.body;

    const customerAlreadyExists = customers.some((customer)=> customer.cpf === cpf)

    if (customerAlreadyExists){
        return res.status(400).json({error: "Customer already exists"});
    }

    customers.push({
        cpf,
        name,
        id: uuidV4(),
        statement: [],
    })

    return res.status(201).send();

})

app.get("/statement",verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req;
    return res.json(customer.statement);
});

app.post("/deposit",verifyIfExistsAccountCPF, (req,res)=>{
    const { description, amount } = req.body;

    console.log(req.body.description)

    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return res.status(201).send();
})

app.listen(3333);