const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const cors = require('cors');

const fileUpload = require('express-fileupload');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(fileUpload());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u0mil.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('db conected');
        const database = client.db("showhan");
        const userCollection = database.collection("user");
        const staticCollections = database.collection("static_content");
        const staticCollections2 = database.collection("static_content2");
        const portfolioCollections = database.collection("portfolio");
        const serviceCollections = database.collection("services");
        const skillCollections = database.collection("skills");
        const testimonialCollections = database.collection("testimonials");

        // user api
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            let isAdmin = false;
            if (result?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })
        app.put('/user', async (req, res) => {
            const addUser = req.body;
            console.log(addUser);
            const result = await userCollection.insertOne(addUser);
            res.json(result);
        })

        //Static content api
        app.get('/static', async (req, res) => {
            const cursor = staticCollections.find({});
            const getStatic = await cursor.toArray();
            res.json(getStatic);
        });
        app.get('/static2', async (req, res) => {
            const cursor = staticCollections2.find({});
            const getStatic = await cursor.toArray();
            res.json(getStatic);
        });

        app.post('/static', async (req, res) => {
            const hdDesc = req.body.hdDesc;
            const webHeading = req.body.webHeading;
            const pic = req.files.hdImg;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const staticHd = {
                hdImg: imageBuffer,
                webHeading,
                hdDesc
            }
            const result = await staticCollections.insertOne(staticHd);
            res.json(result);
        })
        app.post('/static2', async (req, res) => {
            const aboutBtn = req.body.aboutBtn;
            const aboutCnt = req.body.aboutCnt;
            const pic = req.files.aboutImg;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const staticAbout = {
                aboutImg: imageBuffer,
                aboutCnt,
                aboutBtn
            }
            const result = await staticCollections2.insertOne(staticAbout);
            res.json(result);
        })

        //portfolio api
        app.post('/portfolio', async (req, res) => {
            const cat = req.body.cat;
            const title = req.body.title;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const portfolio = {
                image: imageBuffer,
                title,
                cat
            }
            const result = await portfolioCollections.insertOne(portfolio);
            res.json(result);
        })
        app.get('/portfolio', async (req, res) => {
            const cursor = portfolioCollections.find({});
            const portfolio = await cursor.toArray();
            res.json(portfolio);
        });
        app.delete('/portfolio/:id', async (req, res) => {
            const id = req.params.id;
            const deletedItem = { _id: ObjectId(id) };
            const result = await portfolioCollections.deleteOne(deletedItem);
            res.json(result);
        })

        //services api
        app.post('/services', async (req, res) => {
            const desc = req.body.desc;
            const title = req.body.title;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const service = {
                image: imageBuffer,
                title,
                desc
            }
            const result = await serviceCollections.insertOne(service);
            res.json(result);
        })
        app.get('/services', async (req, res) => {
            const cursor = serviceCollections.find({});
            const service = await cursor.toArray();
            res.json(service);
        });
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const deletedItem = { _id: ObjectId(id) };
            const result = await serviceCollections.deleteOne(deletedItem);
            res.json(result);
        })

        //skills api
        app.post('/skills', async (req, res) => {
            const skill = req.body.skill;
            const percent = req.body.percent;
            const skills = {
                percent,
                skill
            }
            const result = await skillCollections.insertOne(skills);
            res.json(result);
        })
        app.get('/skills', async (req, res) => {
            const cursor = skillCollections.find({});
            const skill = await cursor.toArray();
            res.json(skill);
        });
        app.delete('/skills/:id', async (req, res) => {
            const id = req.params.id;
            const deletedItem = { _id: ObjectId(id) };
            const result = await skillCollections.deleteOne(deletedItem);
            res.json(result);
        })


        //testimonial api
        app.post('/testimonials', async (req, res) => {
            const position = req.body.position;
            const testimonial = req.body.testimonial;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const testimonials = {
                image: imageBuffer,
                testimonial,
                position
            }
            const result = await testimonialCollections.insertOne(testimonials);
            res.json(result);
        })
        app.get('/testimonials', async (req, res) => {
            const cursor = testimonialCollections.find({});
            const testimonial = await cursor.toArray();
            res.json(testimonial);
        });
        app.delete('/testimonials/:id', async (req, res) => {
            const id = req.params.id;
            const deletedItem = { _id: ObjectId(id) };
            const result = await testimonialCollections.deleteOne(deletedItem);
            res.json(result);
        })


    }
    finally{
       // await client.close(); 
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})