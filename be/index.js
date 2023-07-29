// ChatGPT API
const apiKey = "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"
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// Routing
const express = require('express')
const app = express()

// CORS issue
var cors = require('cors')
app.use(cors());

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/engle', async function (req, res) {
    let {userMsg, editMsg, chatMsg} = req.body;
    // console.log(userMsg);
    // console.log(editMsg);
    // console.log(chatMsg);

    let editor = [
        {"role": "system", "content": "You will be provided with statements, and your task is to convert them to standard English."},
        {"role": "user", "content": "You will be provided with statements, and your task is to convert them to standard English."},
        {"role": "assistant", "content": "Hi, This is English editor."}
    ]

    let chatbot = [
        {"role": "system", "content": "You are cashier for 1-Street Dinner restaurant."},
        {"role": "user", "content": "You are cashier for 1-Street Dinner restaurant."},
        {"role": "assistant", "content": "Welcome to 1-Street Dinner! How can I assist you today?"}
    ]

    //Push message
    while (userMsg.length != 0 || editMsg.length != 0) {
        if (userMsg.length != 0) {
            um = userMsg.shift()
            editor.push(
                JSON.parse('{"role": "user", "content": "'+String(um).replace(/\n/g,"")+'"}')
            )
            chatbot.push(
                JSON.parse('{"role": "user", "content": "'+String(um).replace(/\n/g,"")+'"}')
            )
        }
        if (editMsg.length != 0) {
            editor.push(
                JSON.parse('{"role": "assistant", "content": "'+String(editMsg.shift()).replace(/\n/g,"")+'"}')
            )
            chatbot.push(
                JSON.parse('{"role": "assistant", "content": "'+String(chatMsg.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    console.log(editor);
    console.log(chatbot);

    const completion_1 = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 128,
        temperature: 0,
        messages: editor,
    });

    const completion_2 = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 128,
        temperature: 0.5,
        messages: chatbot,
    });

    let edit = completion_1.data.choices[0].message['content']
    let chat = completion_2.data.choices[0].message['content']
    
    console.log(edit);
    console.log(chat);

    //res.json({"assistant": score});
    res.json({
        "assistant_1": edit,
        "assistant_2": chat
    });
});

app.listen(3000)
