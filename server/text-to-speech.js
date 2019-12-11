// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
const path = require('path');

const audioPath = path.join(__dirname, './audios/')
fs.exists(audioPath, exists => {
    !exists && fs.mkdirSync(audioPath)
})

exports.generateAudio = async function generateAudio({ text, gender = 'female' }) {
    const filename = `${text}_${gender}.mp3`;
    const filePath = path.join(audioPath, filename)
    const exists = fs.existsSync(filePath);
    if (!exists) {
        // Creates a client
        const client = new textToSpeech.TextToSpeechClient();

        // Construct the request
        const request = {
            input: { text: text },
            // Select the language and SSML Voice Gender (optional)
            voice: { languageCode: 'en-US', ssmlGender: gender },
            // Select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(filePath, response.audioContent, 'binary');
        console.log(`Audio content written to file: ${filename}`);
    }
    return 'audios/' + filename
}