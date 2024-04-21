from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import json

app = Flask(__name__)

# Load class mapping
with open('class_indices.json', 'r') as f:
    class_mapping = json.load(f)

# Load TensorFlow Lite model
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_image(image):
    image = image.resize((224, 224))  # Resize image to model input size
    image_array = tf.keras.preprocessing.image.img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    image_array = image_array.astype('float32') / 255  # Normalize pixel values to [0, 1]
    return image_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found in request'})

    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected image'})

    try:
        image_data = preprocess_image(image)
        interpreter.set_tensor(input_details[0]['index'], image_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])
        predicted_class = np.argmax(output_data[0])
        predicted_label = class_mapping.get(str(predicted_class), "Unknown")
        return jsonify({'predicted_label': predicted_label})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
