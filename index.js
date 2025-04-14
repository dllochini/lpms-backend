import express from "express";
import cors from "cors";

const app = express()
const port = process.env.PORT || 3000;


const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.get('/api/users', (req, res) => {
  res.json([
    {
      "_id": "67fd3d7bb23903f3be6eba6c",
      "index": 0,
      "guid": "487ea36f-cb9c-4c45-8363-f52a339060a0",
      "isActive": true,
      "balance": "$3,605.80",
      "picture": "http://placehold.it/32x32",
      "age": 36,
      "eyeColor": "blue",
      "name": "Salazar Bailey",
      "gender": "male",
      "company": "THREDZ",
      "email": "salazarbailey@thredz.com",
      "phone": "+1 (814) 440-3708",
      "address": "191 Schroeders Avenue, Tivoli, Virgin Islands, 8873",
      "about": "Consequat mollit labore dolore laboris ea ex ut mollit culpa ea ex do pariatur proident. Fugiat mollit nulla deserunt dolore. Dolor laboris pariatur Lorem enim anim consequat.\r\n",
      "registered": "2021-08-19T10:09:57 -06:-30",
      "latitude": -8.348603,
      "longitude": 57.022753,
      "tags": [
        "aliqua",
        "ipsum",
        "do",
        "velit",
        "minim",
        "nostrud",
        "culpa"
      ]
    },
    {
      "_id": "67fd3d7b1f136570d42a30c5",
      "index": 1,
      "guid": "5e85e680-267d-4391-b415-6de4c4205369",
      "isActive": true,
      "balance": "$1,711.49",
      "picture": "http://placehold.it/32x32",
      "age": 21,
      "eyeColor": "green",
      "name": "Haley Winters",
      "gender": "male",
      "company": "POSHOME",
      "email": "haleywinters@poshome.com",
      "phone": "+1 (823) 599-2757",
      "address": "632 Hamilton Walk, Kanauga, Wyoming, 9019",
      "about": "Ad non culpa reprehenderit incididunt nisi aliqua ea excepteur voluptate. Reprehenderit adipisicing mollit officia qui minim velit eiusmod. Elit officia laborum consectetur aliquip duis eiusmod irure. Tempor reprehenderit dolore ut nostrud do nisi dolore aliquip sunt aliqua veniam aute. Ut commodo excepteur amet ut amet non quis. Excepteur adipisicing laboris et et esse occaecat nostrud ipsum. Id excepteur consequat fugiat ullamco irure dolore.\r\n",
      "registered": "2022-04-20T08:08:29 -06:-30",
      "latitude": -18.733651,
      "longitude": 155.474534,
      "tags": [
        "id",
        "adipisicing",
        "exercitation",
        "duis",
        "esse",
        "dolore",
        "adipisicing"
      ]
    },
    {
      "_id": "67fd3d7be3258e7dafa05420",
      "index": 2,
      "guid": "2e011ea3-96fd-49b9-8c0c-58187aafb99d",
      "isActive": false,
      "balance": "$2,158.92",
      "picture": "http://placehold.it/32x32",
      "age": 24,
      "eyeColor": "green",
      "name": "Gayle Kirk",
      "gender": "female",
      "company": "PODUNK",
      "email": "gaylekirk@podunk.com",
      "phone": "+1 (818) 589-3849",
      "address": "633 Sheffield Avenue, Dante, Missouri, 8511",
      "about": "Dolore reprehenderit incididunt consectetur commodo laboris irure. Ullamco esse sint qui ut magna est. Tempor pariatur laborum dolor pariatur ullamco cillum ullamco aute proident.\r\n",
      "registered": "2017-05-07T04:35:52 -06:-30",
      "latitude": 58.449783,
      "longitude": -47.616731,
      "tags": [
        "ad",
        "aliqua",
        "elit",
        "excepteur",
        "anim",
        "elit",
        "magna"
      ]
    },
    {
      "_id": "67fd3d7b374f2e0910e15266",
      "index": 3,
      "guid": "66fdbcee-0c56-4304-902a-5b995bc6137c",
      "isActive": true,
      "balance": "$1,883.69",
      "picture": "http://placehold.it/32x32",
      "age": 38,
      "eyeColor": "green",
      "name": "Kirby Moore",
      "gender": "male",
      "company": "TERASCAPE",
      "email": "kirbymoore@terascape.com",
      "phone": "+1 (867) 462-3216",
      "address": "307 Fair Street, Marion, Rhode Island, 8289",
      "about": "Et duis sit est ex. In eiusmod quis fugiat sint esse duis non ullamco sunt dolore excepteur officia consequat. Dolor ipsum et est mollit ut excepteur esse.\r\n",
      "registered": "2015-10-26T12:27:43 -06:-30",
      "latitude": 82.546582,
      "longitude": 97.081723,
      "tags": [
        "nisi",
        "Lorem",
        "ea",
        "commodo",
        "labore",
        "et",
        "ea"
      ]
    },
    {
      "_id": "67fd3d7bc0c0a70bca1ed61a",
      "index": 4,
      "guid": "582dce29-af95-4ec9-bacb-d1708f09d77a",
      "isActive": true,
      "balance": "$2,093.01",
      "picture": "http://placehold.it/32x32",
      "age": 38,
      "eyeColor": "blue",
      "name": "Saunders Hodge",
      "gender": "male",
      "company": "PAWNAGRA",
      "email": "saundershodge@pawnagra.com",
      "phone": "+1 (869) 586-2534",
      "address": "531 Ridge Court, Springdale, Arizona, 5170",
      "about": "Cillum irure pariatur amet ullamco non voluptate nostrud nulla esse pariatur voluptate nostrud. Id non irure consectetur amet veniam dolore do in voluptate est ex in ut. Laborum anim mollit qui amet fugiat consectetur do non duis cillum elit. Incididunt occaecat eiusmod adipisicing commodo eu incididunt dolor aliquip consequat quis officia enim qui ullamco. Enim fugiat velit minim consequat do occaecat aute pariatur.\r\n",
      "registered": "2014-02-08T06:20:59 -06:-30",
      "latitude": -82.326164,
      "longitude": 110.805392,
      "tags": [
        "dolor",
        "fugiat",
        "elit",
        "dolor",
        "nulla",
        "fugiat",
        "magna"
      ]
    },
    {
      "_id": "67fd3d7b7f27922312422335",
      "index": 5,
      "guid": "5ed759cd-c768-4c6c-8bef-dd45a7085af5",
      "isActive": true,
      "balance": "$3,302.69",
      "picture": "http://placehold.it/32x32",
      "age": 32,
      "eyeColor": "green",
      "name": "Isabel Carr",
      "gender": "female",
      "company": "FLOTONIC",
      "email": "isabelcarr@flotonic.com",
      "phone": "+1 (822) 452-3509",
      "address": "271 Herzl Street, Clayville, New York, 6554",
      "about": "Exercitation in aute Lorem sunt cupidatat culpa veniam elit. Eu officia consectetur et et officia non quis eiusmod. Incididunt in aute laborum ex minim nisi cillum aliqua. Adipisicing reprehenderit aliqua dolore sint pariatur aliqua cillum officia deserunt. Tempor voluptate qui ipsum voluptate ipsum nostrud irure. Quis amet occaecat ut aliquip aute non do est laboris dolor aliquip.\r\n",
      "registered": "2023-12-02T07:23:38 -06:-30",
      "latitude": -62.521997,
      "longitude": -10.195839,
      "tags": [
        "eiusmod",
        "in",
        "irure",
        "dolor",
        "eiusmod",
        "ut",
        "elit"
      ]
    },
    {
      "_id": "67fd3d7beffbcd623857e7a6",
      "index": 6,
      "guid": "2b972d1c-ee67-472f-b49e-ccbf3b619de5",
      "isActive": true,
      "balance": "$1,612.59",
      "picture": "http://placehold.it/32x32",
      "age": 37,
      "eyeColor": "green",
      "name": "Simon Peck",
      "gender": "male",
      "company": "RODEOMAD",
      "email": "simonpeck@rodeomad.com",
      "phone": "+1 (891) 586-3500",
      "address": "692 Bancroft Place, Hasty, North Dakota, 7382",
      "about": "Sit nisi dolore adipisicing minim consequat est elit laboris nulla reprehenderit enim ad dolore. In proident ea eu nostrud. Aliquip ullamco aute deserunt eiusmod cillum cupidatat mollit ullamco incididunt. Irure anim minim pariatur do sint veniam occaecat id consequat laborum nisi. Cillum consequat Lorem ea ad veniam ipsum reprehenderit adipisicing et et dolor ipsum duis quis.\r\n",
      "registered": "2023-07-08T03:01:10 -06:-30",
      "latitude": -48.400587,
      "longitude": -171.633831,
      "tags": [
        "nulla",
        "duis",
        "ex",
        "quis",
        "eiusmod",
        "cupidatat",
        "irure"
      ]
    }
  ])
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})