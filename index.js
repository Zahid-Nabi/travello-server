const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8451q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("travello_db");
        const packagesCollection = database.collection("packages");
        const bookingsCollection = database.collection("bookings");

        //Post Package API
        app.post('/addPackage', async (req, res) => {
            const result = await packagesCollection.insertOne(req.body);
            res.send(result);
        });

        //Post Booking API
        app.post('/addBooking', async (req, res) => {
            const result = await bookingsCollection.insertOne(req.body);
            res.send(result);
        });

        //Get All Packages API
        app.get('/packages', async (req, res) => {
            const result = await packagesCollection.find({}).toArray();
            res.send(result);
        });

        //Get Specific Package API
        app.get('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.findOne(query);
            res.send(result);
        });

        //Get Specific Users Bookings API
        app.get('/bookings/:email', async (req, res) => {
            const user_email = req.params.email;
            const query = { email: user_email };
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        });

        //Get All Users Bookings API
        app.get('/manage_bookings', async (req, res) => {
            const result = await bookingsCollection.find({}).toArray();
            res.send(result);
        });

        //Delete Booking API
        app.delete('/deleteBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
        });

        //Update Status API
        app.put('/approveBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const approveStatus = {
                $set: {
                    status: `Approved`
                }
            };

            const result = await bookingsCollection.updateOne(query, approveStatus, options);
            res.send(result);
        })



    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Travello Server is running');
});

app.listen(port, () => {
    console.log('Travello Server is running on port: ', port);
});