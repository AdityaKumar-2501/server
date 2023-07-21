import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


// 👇️ handle uncaught exceptions
process.on('uncaughtException', function (err) {
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Welcome to Chat-AI'
    })
});

app.post('/', async (req, res) => {
    // try {
    //     const prompt = req.body.prompt;
    //     const response = await openai.createChatCompletion({
    //         model: "gpt-3.5-turbo",
    //         messages: [
    //             { role: 'user', content: `${prompt}` }, // User message
    //             { role: 'assistant', content: 'Hello, how can I assist you?' } // Initial assistant message
    //         ],
    //         temperature: 0,
    //         max_tokens: 3000,
    //         top_p: 1,
    //         frequency_penalty: 0.5,
    //         presence_penalty: 0,
    //     });

    //     res.status(200).send({
    //         bot: response.data.choices[0].text
    //     })
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send({error});
    // }
    const prompt = req.body.prompt;
    axios.post("https://api.openai.com/v1/chat/completions",
    {
        "model": "gpt-3.5-turbo",
         "messages": [
                   { "role": "user", "content": `${prompt}` },
                   { "role": "assistant", "content": "Hello, how can I assist you?" }
               ],
        "temperature": 0
   },
    { headers:{
        "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type" : "application/json",
    },
    }).then((response) => {
        res.status(200).send({
                    bot: response.data.choices[0].message.content
                })
    }).catch((err) => {
        console.log(err);
    })


    return null;

});

app.listen(5000, ()=> console.log('Server is running on port http://localhost:5000'));