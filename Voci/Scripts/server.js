const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

const uri = 'mongodb+srv://admin:admin@cluster0.bavv1fe.mongodb.net/test';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.get('/api/voci', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('Vocabulary').collection('Voci');
    const result = await collection.find({}).toArray();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/voci/count', async (req, res) => {
    try {
      await client.connect();
      const collection = client.db('Vocabulary').collection('Voci');
      const count = await collection.countDocuments();
      res.json(count);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  });

app.use(bodyParser.json());

app.post('/api/voci', async (req, res) => {
  try {
    console.log(req.body);
    await client.connect();
    const collection = client.db('Vocabulary').collection('Voci');
    const result = await collection.insertOne(req.body);
    res.json(result.ops[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/voci/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await client.connect();
      const collection = client.db('Vocabulary').collection('Voci');
      const result = await collection.findOne({ id: id });
      if (!result) {
        return res.status(404).json({ error: 'Dataset not found' });
      }
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  });

  app.delete('/api/voci/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await client.connect();
      const collection = client.db('Vocabulary').collection('Voci');
      const result = await collection.deleteOne({ id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Dataset not found' });
      }
      else{
        await collection.updateMany(
            { id: { $gte: id } },
            { $inc: { id: -1 } }
          )
      }
      res.json({ message: 'Dataset deleted successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  });

  app.put('/api/voci/:id', async (req, res) => {
    try {
      const checkId = parseInt(req.params.id);
      const { name, languageOne, languageTwo, id } = req.body;
      if (!name || !languageOne || !languageTwo || !id) {
        return res.status(400).json({ error: 'Missing name or languages' });
      }
      await client.connect();
      const collection = client.db('Vocabulary').collection('Voci');
      const result = await collection.updateOne({ id: checkId }, { $set: { name, languageOne, languageTwo, id } });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Dataset not found' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  });
  
  

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
