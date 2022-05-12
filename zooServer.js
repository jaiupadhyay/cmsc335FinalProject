let http = require("http");
let express = require("express");   /* Accessing express module */
let app = express();  /* app is a request handler function */
let path = require("path");
let bodyParser = require("body-parser");

async function insertTicketRequest(personalInfo) {
    try {
        await client.connect();
       
        /* Inserting one application */
        const result = await client.db(dbName).collection(collectionName).insertOne(personalInfo);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

//Look up info in DB
async function lookup(firstName, lastName, email) {
    try {
        await client.connect();
        let filter = {firstName: firstName, lastName: lastName, email:email};
        const result = await client.db(dbName)
                            .collection(collectionName)
                            .findOne(filter);
    
     
        return result;
       

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function useTicket(firstName, lastName, email) {
    try {
        await client.connect();
       
        let filter = {firstName: firstName, lastName: lastName, email: email};
        await client.db(dbName)
                       .collection(collectionName)
                       .deleteOne(filter);
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/'));

app.get("/", (request, response) => { 
    response.render("index");
}); 

app.get("/getTicket", (request, response) => { 
    response.render("ticketForm");
}); 

app.get("/zooTicketCheck", (request, response) => { 

    response.render("zooTicketCheck");
});



app.get("/zooExhibit", (request, response) => { 
    let firstName = request.query.firstName;
    let lastName = request.query.lastName;
    let email = request.query.email;

    (async () => {
        try {
            let queryResult = await lookup(firstName, lastName, email);

            if (queryResult) {
                await useTicket(firstName, lastName, email);
                response.render("zooExhibit", {firstName: firstName});
            } else {
                response.render("noTicketFound", {firstName: firstName, lastName: lastName, email: email});
            }
        } catch (e) {
          console.log("ERROR, ERROR: " + e);
        }
    })();
});




/* Initializes request.body with post information */ 
app.use(bodyParser.urlencoded({extended:false}));


app.post("/processTicket", (request, response) => {
    let {firstName, lastName, email} = request.body;

    (async () => {
        try {
            let personalInfo = {firstName: firstName, lastName: lastName, email: email};

            // do stuff with Mongo to insert this application into the database
            await insertTicketRequest(personalInfo);
            
            let variables = {firstName: firstName, lastName: lastName, email: email, date: Date().toString()};
            response.render("thankYou", variables);
        } catch (e) {
          console.log("ERROR, ERROR: " + e);
        }
    })();
});

/* Important */
process.stdin.setEncoding("utf8");

if (process.argv.length != 3) {
    process.stdout.write(`Usage zooServer.js portNumber`);
    process.exit(1);
}

let portNum = process.argv[2];

http.createServer(app).listen(process.env.PORT || Number(portNum));
console.log(`Web server started and running at http://localhost:${portNum}`);

require("dotenv").config({ path: path.resolve(__dirname, '.env') });

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const dbName = process.env.MONGO_DB_NAME;
const collectionName = process.env.MONGO_COLLECTION;


const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI || `mongodb+srv://${userName}:${password}@cluster0.qh8b9.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on("readable",async function () {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
        let command = dataInput.trim();
        if (command === "stop") {
            process.stdout.write("Shutting down the server\n");
            process.exit(0);
        } else {
            process.stdout.write(`Invalid command: ${command}\n`);
        }
        process.stdout.write(prompt);
        process.stdin.resume();
    }
});