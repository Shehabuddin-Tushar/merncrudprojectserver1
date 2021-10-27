const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app=express();
const ObjectId=require("mongodb").ObjectId;
const port=process.env.PORT || 5000

app.use(cors());
app.use(express.json())
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lp6z6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){

    try{
        await client.connect();

        const database=client.db("crudprojct");
        const collection=database.collection("user_info");

        app.post("/addstudent",async(req,res)=>{
            const data=req.body;
            const result=await collection.insertOne(data);
            console.log(result)
            res.send(result);

        });

        app.get("/students",async(req,res)=>{

            const result=collection.find({});
            
            const studentcount=await result.count();
            const page=req.query.page;
            const size=parseInt(req.query.size);
            let students;
            if(page){
                students= await result.skip(page*size).limit(size).toArray();
            }else{
                students= await result.toArray();
             }

            res.send({students,studentcount})
        });

        app.delete("/studentdelete/:id",async(req,res)=>{
            id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await collection.deleteOne(query);
            res.json(result);
        });

        app.get("/student/:id",async(req,res)=>{
            const id=req.params.id;
            console.log(id)
            const query={_id:ObjectId(id)}
            const student=await collection.findOne(query);
            console.log(student)
            res.json(student)
        })

        app.put("/student/update",async(req,res)=>{
            const data=req.body;

            const filter = { _id:ObjectId(data._id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name:data.name,
                    roll:data.roll
                 },
               };
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    }finally{

    }
}

run().catch(console.dir)


app.get("/",(req,res)=>{
    res.send("this is example for testing")
})

app.listen(port,()=>{
    console.log("server running port is "+port)
})
