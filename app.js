const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://GbDigital:GB2024Digi@cluster.bv62wqp.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')

app.use(cors())
app.use(express.json());

app.post('/timbra', async (req, res) => {
    try {
        const { nome, ts } = req.body
        await client.connect()
        const database = client.db("timbratureDb");
        const collection = database.collection("timbratureCollections");

        const timbratureUtente = await collection.find({ nome: nome }).toArray()

        let tipo = ''
        if(timbratureUtente.length % 2 == 0)
            tipo = 'Entrata'
        else
            tipo = 'Uscita'

        // Create a document to insert
        const doc = { nome: nome, tipo: tipo, ts: ts }

        // Insert the defined document into the "haiku" collection
        const result = await collection.insertOne(doc);
        if(result.acknowledged)
            res.send(true)
        else
            throw new Error('Error')

    } catch (err) {
        await client.close();
        res.send('Errore durante la timbratura')
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})