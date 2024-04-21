from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import nltk 

app = Flask(__name__)
# can be used from .env file but for simplicity used directly
GEMINI_API_KEY = ""


genai.configure(api_key=GEMINI_API_KEY)

generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                              generation_config=generation_config,
                              safety_settings=safety_settings)


def chunks(lst, chunk_size):
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]

@app.route("/")
def index():
    """Render the index.html file."""
    return render_template("cropRec.html")

@app.route("/analyze", methods=["POST"])
def analyze_data():
    """Analyzes data and recommends crops based on user input."""

 
    region = request.json["region"]
    soil_type = request.json["soil_type"]

   
    market_trends_prompt = f"""Generate crop recommendations for {soil_type} in {region}, following the specified format:
    the season and crop name  must be in block and bold letters.

Kharif season (summer Season,months):
Crop 1: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement
Crop 2: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement
Crop 3: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement

Rabi season (winter,Months):
Crop 4: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement
Crop 5: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement
Crop 6: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement

zaid season(Months) :
Crop 7: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement
Crop 8: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement
Crop 9: Reason 1, Reason 2, Reason 3,Estimated profitability:,Post-harvest considerations:,Post-harvest considerations:,weather requirement:,Pest and disease resistance:,climate resilience,water requirement

Data Considerations:

Include crops with good historical market trends (past 5 years) in {region}.
Focus on crops suitable for {soil_type} conditions.
high-yield crop varieties  include the variety like name of hybrid seed (version of seed suitable for {soil_type} conditions are preffered
Mention any relevant government schemes that might benefit these crops (if available).
Reason Examples:

Well-adapted to {soil_type} giving high yield
High market demand in  {region}
Government subsidy available

Market-specific details:

must include Estimated profitability: Include an estimated profit margin per unit area for each crop suggestion. This can be a range based on historical data and current market trends.
Post-harvest considerations: Briefly mention storage requirements and shelf life of the crops. Indicate if there's a need for special storage facilities or processing units, which can impact profitability.
Competition: Briefly touch upon the level of competition from other farmers growing the same crop in the region.
Risk factors:

Climate resilience: Mention the crop's tolerance to drought, flooding, or extreme temperatures, which are relevant in the context of climate change.
Pest and disease resistance: Indicate if there are any known pest or disease threats specific to the crop in the region.
Additional considerations: 
weather requirement: Briefly mention the crop's suitable weather conditions.
Water requirements: Briefly mention the crop's water needs (low, medium, high) to help farmers make informed decisions based on their irrigation resources.
Labor requirements: Mention if the crop requires high or low labor input, which can impact production costs.
Organic suitability: If relevant, indicate if the crop is suitable for organic farming practices."""

   
    try:
        recommendations_text = model.generate_content([market_trends_prompt]).text
        recommendations = list(chunks(recommendations_text.split("\n"), 5)) 
    except Exception as e:
        print(f"Error querying Gemini: {e}")
        return jsonify({"error": "Error analyzing data"})

    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
     app.run(debug=True, port=5001)
