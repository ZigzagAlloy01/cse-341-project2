const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('clients').find();
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients);
    });
};

const getSingle = async (req, res) => {
    const clientId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('clients').find({ _id: clientId});
    result.toArray().then((clients) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(clients[0]);
    });
};

const createClient = async (req, res) => {
    const client = {
        name: req.body.name,
        email: req.body.email,
        company: req.body.company
    }
    const response = await mongodb.getDatabase().db().collection('clients').insertOne(client);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the client.');
    }
};

const updateClient = async (req, res) => {
    const clientId = new ObjectId(req.params.id);
    const client = {
        name: req.body.name,
        email: req.body.email,
        company: req.body.company
    };
    const response = await mongodb.getDatabase().db().collection('clients').replaceOne({ _id: clientId }, client);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the client.');
    }
};

const deleteClient = async (req, res) => {
    const clientId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('clients').deleteOne({ _id: clientId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the client.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createClient,
    updateClient,
    deleteClient
}