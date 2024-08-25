from flask import Flask, request, jsonify, send_from_directory
import os
import json
import re
import requests
from langchain import hub, PromptTemplate
from langchain.docstore.document import Document
from langchain.document_loaders import JSONLoader
from langchain.schema import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
from langchain_pinecone import Pinecone
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from pinecone import Pinecone as pc
from pinecone import PodSpec
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.document_loaders import WebBaseLoader


app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# app = Flask(__name__)
GOOGLE_API_KEY = 'AIzaSyBKydN1c17UL0PShV8c3jGEC0h5CRmE-KU'


# Serve static files (including JSON)
@app.route('/test.json')
def serve_json():
    return send_from_directory('.', 'test.json')

def load_from_url(url):
    loader = WebBaseLoader(url)
    docs = loader.load()
    print(docs)
    return docs


def extractor(docs):
    try:
        # Use the provided API key directly
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.7,
            top_p=0.85,
            google_api_key=GOOGLE_API_KEY
        )
        
        llm_prompt_template = """You are an assistant designed to extract specific information from text.
        The information to be extracted includes:
        - Name
        - Description
        - Subject
        - Department
        - University Name
        - Courses Taught


        Extract the relevant information from the provided context. If any information is not available, mention "Not found."

        Context: {context}

        Extracted Information:
        Name: 
        Description: 
        Subject: 
        Department: 
        University Name:
        Courses Taught:"""

        llm_prompt = PromptTemplate.from_template(llm_prompt_template)
        chain = LLMChain(llm=llm, prompt=llm_prompt)

        # Execute the chain with the provided documents
        response = chain.run({"context": docs})
        print(response)

        # Parse the response into structured data
        extracted_information = {}
        extracted_information['name'] = re.search(r'Name:\s*(.*)', response).group(1)
        extracted_information['description'] = re.search(r'Description:\s*(.*)', response).group(1)
        extracted_information['subject'] = re.search(r'Subject:\s*(.*)', response).group(1)
        extracted_information['department'] = re.search(r'Department:\s*(.*)', response).group(1)
        extracted_information['university_name'] = re.search(r'University Name:\s*(.*)', response).group(1)
        extracted_information['courses_taught'] = re.search(r'Courses Taught:\s*(.*)', response).group(1)

        return extracted_information
    except Exception as e:
        print(f"Error in extractor: {str(e)}")
        raise


@app.route('/extract-info', methods=['POST'])
def extract_info():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Load document from URL
        docs = load_from_url(url)
        
        # Extract information from the document
        response = extractor(docs)
        
        return jsonify({"extracted_information": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

def scale_to_stars(sentiments):
    # Extract positive score
    positive_score = next(item['score'] for item in sentiments if item['label'] == 'positive')

    # Scale the positive score to a 1 to 5-star rating
    # Assuming the score is between 0 and 1, and mapping it to 1 to 5 stars
    star_rating = 1 + int(round(positive_score * 4))  # Scale: 0->1, 0.25->2, ..., 1->5

    return star_rating


def sentiment(comment):
    output = query({
        "inputs": comment,
    })

    stars = scale_to_stars(output[0])
    return stars


def load_json():
    loader = JSONLoader(
        file_path='./test.json',
        jq_schema='.professors[]',
        text_content=False)
    docs = loader.load()
    return docs

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def pine_index(docs, gemini_embeddings):
    pine_client = pc()
    index_name = "langchain-demo"
    if index_name not in pine_client.list_indexes().names():
        pine_client.create_index(name=index_name,
                                 metric="cosine",
                                 dimension=768,
                                 spec=PodSpec(
                                     environment="gcp-starter",
                                     pod_type="starter",
                                     pods=1))
        print(pine_client.describe_index(index_name))

    vectorstore = Pinecone.from_documents(docs, gemini_embeddings, index_name=index_name)
    retriever = vectorstore.as_retriever()
    return retriever

def gemini_answer(retriever, question):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7, top_p=0.85)
    llm_prompt_template = """You are an assistant for question-answering tasks.
    Use the following context to answer the question.
    If you don't know the answer, just say that you don't know.
    Use five sentences maximum and keep the answer concise.

    Question: {question}
    Context: {context}
    Answer:"""

    llm_prompt = PromptTemplate.from_template(llm_prompt_template)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | llm_prompt
        | llm
        | StrOutputParser()
    )
    return rag_chain.invoke(question)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question', '')
    
    if not question:
        return jsonify({"error": "Question is required"}), 400
    
    docs = load_json()
    formatted_docs = [Document(page_content=str(docs), metadata={"source": "local"})]

    os.environ['PINECONE_API_KEY'] = '5885184a-a559-4390-937b-86a310141869'
    os.environ['GOOGLE_API_KEY'] = 'AIzaSyBKydN1c17UL0PShV8c3jGEC0h5CRmE-KU'

    gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    retriever = pine_index(formatted_docs, gemini_embeddings)
    answer = gemini_answer(retriever, question)
    
    return jsonify({"answer": answer})

@app.route('/professor/<int:professor_id>', methods=['GET'])
def get_professor(professor_id):
    # Load existing data
    with open('test.json', 'r') as file:
        json_data = json.load(file)

    # Find the professor by ID
    for professor in json_data.get('professors', []):
        if professor['id'] == professor_id:
            return jsonify(professor), 200
    
    return jsonify({"error": "Professor not found"}), 404


# Endpoint to save a review
@app.route('/submit-review', methods=['POST'])
def submit_review():
    data = request.json
    professor_name = data.get('professor_name', '')
    rating_message = data.get('rating_message', '')
    student_name = data.get('student_name', '')

    if not professor_name or not rating_message:
        return jsonify({"error": "Professor name and review message are required"}), 400

    # Apply sentiment analysis to get the correct rating
    rating = sentiment(rating_message)

    # Load existing data
    with open('test.json', 'r') as file:
        json_data = json.load(file)

    # Find the professor
    for professor in json_data.get('professors', []):
        if professor['name'] == professor_name:
            # Add the new review
            if 'reviews' not in professor:
                professor['reviews'] = []
            
            # Generate a new review_id (you can use a different method for uniqueness)
            new_review_id = max((review.get('review_id', 0) for review in professor['reviews']), default=0) + 1

            professor['reviews'].append({
                "review_id": new_review_id,
                "student_name": student_name,
                "rating": rating,
                "comment": rating_message,
            })
            
            # Save the updated data back to the file
            with open('test.json', 'w') as file:
                json.dump(json_data, file, indent=4)
            
            return jsonify({"message": "Review submitted successfully"}), 200

    return jsonify({"error": "Professor not found"}), 404

@app.route('/add-professor', methods=['POST'])
def add_professor():
    data = request.json
    professor_info = data.get('professor_info', {})

    # Check if all required fields are present
    required_fields = ['name', 'description', 'subject', 'department', 'university', 'courses_taught']
    if not all(field in professor_info for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Load existing data
    try:
        with open('test.json', 'r') as file:
            json_data = json.load(file)
    except FileNotFoundError:
        json_data = {'professors': []}

    # Add the new professor information
    if 'professors' not in json_data:
        json_data['professors'] = []

    # Create a new professor ID
    new_professor_id = max((professor.get('id', 0) for professor in json_data['professors']), default=0) + 1
    professor_info['id'] = new_professor_id
    
    # # Add courses_taught field
    # if 'courses_taught' not in professor_info:
    #     professor_info['courses_taught'] = []

    # Example structure for courses_taught
    # if not any(course['course_code'] == professor_info['subject'] for course in professor_info['courses_taught']):
    #     professor_info['courses_taught'].append({
    #         "course_code": professor_info['subject'],
    #         "course_name": "Sample Course",  # Provide actual course names if available
    #         "semester": "Fall 2024"  # Update as needed
    #     })

    json_data['professors'].append(professor_info)

    # Save the updated data back to the file
    with open('test.json', 'w') as file:
        json.dump(json_data, file, indent=4)

    return jsonify({"message": "Professor added successfully"}), 200

# @app.route('/add-professor', methods=['POST'])
# def add_professor():
#     data = request.json
#     professor_info = data.get('professor_info', {})

#     # Check if all required fields are present
#     required_fields = ['name', 'description', 'subject', 'department', 'university']
#     if not all(field in professor_info for field in required_fields):
#         return jsonify({"error": "Missing required fields"}), 400

#     # Load existing data
#     try:
#         with open('test.json', 'r') as file:
#             json_data = json.load(file)
#     except FileNotFoundError:
#         json_data = {'professors': []}

#     # Add the new professor information
#     if 'professors' not in json_data:
#         json_data['professors'] = []

#     # Create a new professor ID
#     new_professor_id = max((professor.get('id', 0) for professor in json_data['professors']), default=0) + 1
#     professor_info['id'] = new_professor_id
#     json_data['professors'].append(professor_info)

#     # Save the updated data back to the file
#     with open('test.json', 'w') as file:
#         json.dump(json_data, file, indent=4)

#     return jsonify({"message": "Professor added successfully"}), 200



if __name__ == "__main__":
    app.run(debug=True, port=5000)
