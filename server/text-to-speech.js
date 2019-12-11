// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');



// Import other required libraries
const fs = require('fs');
const util = require('util');
const path = require('path');

const audioPath = path.join(__dirname, './asserts/audios/')

exports.generateAudio = async function generateAudio({ text, gender = 'female' }) {
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

    const filename = text + '.mp3'
    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(path.join(audioPath, filename), response.audioContent, 'binary');
    console.log(`Audio content written to file: ${filename}`);
    return 'asserts/audios/' + filename
}