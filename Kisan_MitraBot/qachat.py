from dotenv import load_dotenv
load_dotenv() 

import streamlit as st
import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

def get_gemini_response(question):
    """
    Sends the question to Gemini Pro and filters the response based on relevance to agriculture domains.

    Args:
        question: The user's question.

    Returns:
        A string containing the response from Gemini Pro if relevant, or a message indicating the query is outside the scope.
    """

    response = chat.send_message(question, stream=True)

   #using keyword for filtering the response from the model maybe 
    agriculture_keywords = agriculture_keywords = ["hii","hi","hello",

   
    "agriculture", "crop", "grain", "farmer", "government scheme",
    "agriculture machinery", "organic farming", "modern farming",
    "soil health", "land management", "irrigation", "fertilizer",
    "pesticide", "herbicide", "insecticide", "weed control", "pest control",
    "plant disease", "crop yield", "agricultural technology", "precision agriculture",
    "sustainable agriculture", "climate change", "water scarcity", "agricultural economics",
    "agricultural policy", "rural development", "agricultural research", "agricultural extension",
    "livestock", "poultry", "dairy farming", "fisheries", "aquaculture",
    "apiculture", "sericulture", "horticulture", "floriculture", "forestry",
    "agroforestry", "agricultural products", "food security", "agricultural marketing",
    "agricultural exports", "agricultural imports", "agricultural infrastructure",
    "agricultural credit", "agricultural insurance", "agricultural cooperatives",
    "agricultural education", "agricultural training", "agricultural employment",
    "agricultural labor", "agricultural safety", "agricultural innovation",
    "agricultural entrepreneurship", "agricultural startups", "agricultural data",
    "agricultural AI", "agricultural robotics", "agricultural sensors",
    "agricultural drones", "agricultural IoT", "precision agriculture technologies",
    "vertical farming", "hydroponics", "aquaponics", "regenerative agriculture",
    "biotechnology in agriculture", "genetically modified organisms (GMOs)",
    "organic certification", "fair trade agriculture", "food safety",
    "food traceability", "agricultural waste management", "circular economy in agriculture",
    "agricultural pollution", "climate-smart agriculture", "agricultural sustainability",
    "agricultural resilience", "agricultural adaptation", "agricultural mitigation",

   
    "Minimum Support Price (MSP)", "Public Distribution System (PDS)",
    "Farmer suicides", "Farm loan waivers", "Crop insurance schemes",
    "Land acquisition", "Farmer protests", "Monsoon dependency", "Drought",
    "Soil salinity", "Land degradation", "Deforestation", "Kharif season",
    "Rabi season", "Smallholder farming", "Subsistence farming", "Intercropping",
    "Agro-ecology", "Traditional farming techniques", "Dairy farming (milch animals)",
    "Millets", "Pulses", "Cash crops", "Spices", "Medicinal plants",
    "Cold chain storage", "Agricultural marketing infrastructure (mandis)",
    "Farmer Producer Organizations (FPOs)", "Direct marketing", "E-commerce for agriculture",
    "Rural indebtedness", "Gender issues in agriculture", "Farmer education", 
    "Farmer training programs", "Migration from rural areas", "Digital agriculture",
    "Startup ecosystem in agriculture", "Climate-resilient agriculture"
]

    relevant_chunks = [chunk.text for chunk in response if any(keyword in chunk.text.lower() for keyword in agriculture_keywords)]

    if relevant_chunks:
        filtered_response = "\n".join(relevant_chunks)
        return filtered_response
    else:
        return "I can't answer this query yet. My knowledge is primarily focused on agriculture-related topics like crops, grains, farmers, government schemes, machinery, organic farming, and modern farming. Please ask a question within this domain."



st.set_page_config(page_title="Kisan Mitra Prototype")

st.header("Kisan Mitra: Your Agriculture Assistant")


if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

user_input = st.text_input("Input: Enter your Agriculture-related query", key="input")
submit = st.button("Ask the question")

if submit and user_input:
    response = get_gemini_response(user_input)


    st.session_state['chat_history'].append(("You", user_input))

    st.subheader("Kisan Mitra Response")
    st.write(response)

    if response != "I can't answer this query yet...":
        st.session_state['chat_history'].append(("Bot", response))

st.subheader("Chat History")
for role, text in st.session_state['chat_history']:
    st.write(f"{role}: {text}")
