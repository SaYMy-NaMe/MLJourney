import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the API Key from environment variable
api_key = os.getenv("GOOGLE_AI_API_KEY")
# Set up Google AI API Key
genai.configure(api_key=api_key)

count = 1
def ask_gemini(question):
    # Initialize the model first
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(question)    
    return response.text  # Get the response text

# Interactive loop to chat with Gemini AI
while True:
    if count == 1: 
        print()
        count = 0
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        print("\nGoodbye!")
        break
    reply = ask_gemini(user_input)
    print()
    print("Gemini:", reply)
    print()