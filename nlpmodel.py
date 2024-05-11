from flask import Flask, request, jsonify

from flask_cors import CORS


from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/translate', methods=['POST'])

def translate():
    data = request.get_json()
    # Process the data and translate using your language model
    translatedText = translate(data['inputText'],data['sourceLang'],data['targetLang'])

    # translated_text="hii"
    return jsonify({'translatedText': translatedText})

def translate(inputText, sourceLang, targetLang):
    prefix = f"translate {sourceLang} to {targetLang}: "
    inputText = prefix + inputText
    input_ids = tokenizer(inputText, return_tensors="pt").input_ids
    translated_ids = model.generate(input_ids)
    translatedText = tokenizer.decode(translated_ids[0], skip_special_tokens=True)
    # print(translatedText)
    return translatedText
    
@app.route('/speech-recognition', methods=['POST'])

def speech_recognition():
    if 'audio' not in request.files:
        return jsonify({'error': 'Audio file not found'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    audio_data = request.files['audio'].read()
    result = pipe(audio_data)
    return jsonify({'inputText':result["text"]})


if __name__ == '__main__':
    model = T5ForConditionalGeneration.from_pretrained("model/translationModel")
    tokenizer = T5Tokenizer.from_pretrained("model/translationModel")



    model_id = "openai/whisper-tiny"
    device = "cuda" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float32

    model1 = AutoModelForSpeechSeq2Seq.from_pretrained(
        model_id, torch_dtype=torch_dtype, use_safetensors=True
    )
    model1.to(device)

    processor = AutoProcessor.from_pretrained(model_id)

    pipe = pipeline(
        "automatic-speech-recognition",
        model=model1,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        max_new_tokens=128,
        chunk_length_s=30,
        batch_size=16,
        return_timestamps=True,
        torch_dtype=torch_dtype,
        device=device,
    )
    app.run(debug=True)
