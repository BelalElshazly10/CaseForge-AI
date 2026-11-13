# api/app.py
import sys
import os
from PyPDF2 import PdfReader
from docx import Document
import io
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
# 1. Force Python to look in the exact right folder
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
load_dotenv(os.path.join(basedir, '.env'))

# 2. Grab the key manually
API_KEY = os.getenv("GEMINI_API_KEY")
print("USING GEMINI KEY:", API_KEY[:12] + "...")

# 3. A safety check if Windows hid the file extension!
if not API_KEY:
    print("\n🚨 WARNING: Python could not find your .env file!")
    print("🚨 Let's bypass the file for a moment so you can test the app.\n")
    
    # TEMPORARY BYPASS: Paste your actual AIzaSy... key right here between the quotes
    # (Just don't upload this file to GitHub while your key is pasted here!)
    API_KEY = "YOUR_ACTUAL_KEY_HERE"

# 4. Initialize Gemini using the explicit key
gemini_client = genai.Client(api_key=API_KEY)

# Add the parent directory to Python's import path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps

# Import modules
#from modules.auth import secure_auth
from modules.auth.secure_auth import register, login, verify_token
from modules.validation.validation import validate_username, validate_email, validate_text
from modules.encryption.aes import encrypt, decrypt
from modules.logging.logger import log_info, log_security_event

app = Flask(__name__)
CORS(app)

# ----------------------------------------------------------
# Security Headers
# ----------------------------------------------------------
@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# ----------------------------------------------------------
# JWT Protection Decorator
# ----------------------------------------------------------
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        # 1. Let the CORS scout through
        if request.method == "OPTIONS":
            return jsonify({}), 200

        # 2. Grab the header
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Missing token"}), 401

        # 3. Strip the word "Bearer " to get JUST the raw token string
        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            # If they sent a token without "Bearer ", just use the raw header
            token = auth_header

        # 4. Verify the token
        try:
            payload = verify_token(token)
        except Exception as e:
            print(f"Token verification failed: {e}") # This will print the exact reason to your terminal!
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(payload, *args, **kwargs)

    return wrapper


# ----------------------------------------------------------
# Register
# ----------------------------------------------------------
@app.route("/register", methods=["POST"])
def api_register():
    data = request.json

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    role = data.get("role", "QA_ENGINEER")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    if not validate_email(email):
        return jsonify({"error": "Invalid email"}), 400
    print("APP REGISTER:", email, password, name, role)
    result = register(email, password, name, role)

    if result.success:
        log_info(f"User {email} registered.")
        return jsonify({"message": result.message}), 201

    return jsonify({"error": result.message}), 400

@app.route("/", methods=["GET"])
def index():
    return {"status": "API is running"}

# ----------------------------------------------------------
# Login
# ----------------------------------------------------------
@app.route("/login", methods=["POST"])
def api_login():
    data = request.json

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not validate_email(email):
        return jsonify({"error": "Invalid email"}), 400
    print("APP LOGIN:", email, password)
    result = login(email, password)

    if result.success:
     log_security_event(f"User {email} logged in.")
     return jsonify({
        "token": result.token,
        "name": result.name,
        "email": result.email,
        "role": result.role
    }), 200
    log_security_event(f"Failed login attempt for {email}.")
    return jsonify({"error": result.message}), 401

# ----------------------------------------------------------
# Input Validation
# ----------------------------------------------------------
@app.route("/validate", methods=["POST"])
def api_validate():
    data = request.json

    text = data.get("text")

    if validate_text(text):
        return jsonify({"valid": True})
    else:
        return jsonify({"valid": False}), 400


# ----------------------------------------------------------
# Encrypt
# ----------------------------------------------------------
@app.route("/encrypt", methods=["POST"])
def api_encrypt():
    data = request.json
    text = data.get("text")

    cipher = encrypt(text)

    log_info("AES encryption performed.")

    return jsonify({"cipher": cipher})


# ----------------------------------------------------------
# Decrypt
# ----------------------------------------------------------
@app.route("/decrypt", methods=["POST"])
def api_decrypt():
    data = request.json
    cipher = data.get("cipher")

    try:
        plain = decrypt(cipher)
        return jsonify({"plain": plain})
    except Exception:
        return jsonify({"error": "Decryption failed"}), 400


# ----------------------------------------------------------
# Secure endpoint (JWT required)
# ----------------------------------------------------------
@app.route("/secure-data", methods=["GET"])
@token_required
def secure_data(payload):
    username = payload["sub"]

    log_info(f"Secure data accessed by {username}")

    return jsonify({
        "message": f"Hello {username}, this is protected data.",
        "role": payload["role"]
    })



#@app.route("/api/verify_token", methods=["POST"])
#def api_verify_token():
 #   data = request.json
  #  token = data.get("token")
   # if not token:
    #    return jsonify({"valid": False, "message": "Token missing"}), 400
#
 #   try:
  #      payload = secure_auth.verify_token(token)
   #     return jsonify({"valid": True, "payload": payload})
    #except Exception as e:
     #   return jsonify({"valid": False, "message": str(e)}), 401

@app.route("/analyze", methods=["POST", "OPTIONS"])
@token_required
def analyze_requirement(payload): # The payload comes from the token_required decorator
    # Get the requirement text sent from the React frontend
    data = request.get_json()
    requirement_text = data.get("requirement")

    if not requirement_text:
        return jsonify({"error": "No requirement text provided"}), 400

    prompt = f"""Analyze the following software requirement and generate a comprehensive QA assessment:
    
Requirement: "{requirement_text}"

Tasks:
1. Identify the requirement type.
2. Interpret the requirement and list its strengths and weaknesses.
3. Generate structured ISTQB-compliant test cases using Equivalence Partitioning (EP), Boundary Value Analysis (BVA), and Decision Table Testing (DTT) where applicable.
4. Evaluate quality using McCall's Quality Model (scores 0-1.0 for each factor).
5. Perform a Proposal/Contract review checklist assessment.
6. Provide an overall coverage score (0-100) and confidence score (0-1.0).

Return the response as a JSON object matching the defined schema."""

    # Define the strict JSON structure we want Gemini to return
    analysis_schema = {
        "type": "OBJECT",
        "properties": {
            "type": {"type": "STRING"},
            "coverageScore": {"type": "NUMBER"},
            "interpretation": {"type": "STRING"},
            "strengths": {"type": "ARRAY", "items": {"type": "STRING"}},
            "weaknesses": {"type": "ARRAY", "items": {"type": "STRING"}},
            "testCases": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "id": {"type": "STRING"},
                        "title": {"type": "STRING"},
                        "preconditions": {"type": "STRING"},
                        "steps": {"type": "ARRAY", "items": {"type": "STRING"}},
                        "testData": {"type": "STRING"},
                        "expectedResult": {"type": "STRING"},
                        "techniqueUsed": {"type": "STRING"}
                    },
                    "required": ["id", "title", "steps", "expectedResult", "techniqueUsed"]
                }
            },
            "mccallFactors": {
                "type": "OBJECT",
                "properties": {
                    "correctness": {"type": "NUMBER"},
                    "reliability": {"type": "NUMBER"},
                    "efficiency": {"type": "NUMBER"},
                    "integrity": {"type": "NUMBER"},
                    "usability": {"type": "NUMBER"},
                    "maintainability": {"type": "NUMBER"},
                    "flexibility": {"type": "NUMBER"},
                    "testability": {"type": "NUMBER"},
                    "portability": {"type": "NUMBER"},
                    "reusability": {"type": "NUMBER"},
                    "interoperability": {"type": "NUMBER"}
                }
            },
            "reviewChecklist": {
                "type": "OBJECT",
                "properties": {
                    "customerRequirementsClarified": {"type": "BOOLEAN"},
                    "alternativeSolutionsEvaluated": {"type": "BOOLEAN"},
                    "risksIdentified": {"type": "BOOLEAN"},
                    "resourcesEstimated": {"type": "BOOLEAN"},
                    "capacityConfirmed": {"type": "BOOLEAN"},
                    "customerObligationsVerified": {"type": "BOOLEAN"},
                    "partnerParticipationDefined": {"type": "BOOLEAN"},
                    "proprietaryRightsProtected": {"type": "BOOLEAN"},
                    "noUnresolvedIssues": {"type": "BOOLEAN"},
                    "allUnderstandingsDocumented": {"type": "BOOLEAN"},
                    "noUndocumentedChanges": {"type": "BOOLEAN"}
                }
            },
            "techniquesUsed": {"type": "ARRAY", "items": {"type": "STRING"}},
            "confidenceScore": {"type": "NUMBER"}
        },
        "required": ["type", "coverageScore", "interpretation", "testCases", "mccallFactors", "techniquesUsed", "confidenceScore"]
    }

    try:
        # Call the Gemini API from the secure backend
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=analysis_schema,
            ),
        )
        
        # Send the JSON string right back to React
        return response.text, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return jsonify({"error": "Failed to analyze requirement"}), 500



@app.route("/generate-document", methods=["POST", "OPTIONS"])
@token_required
def generate_document(payload):
    data = request.get_json()

    doc_type = data.get("type")
    project_name = data.get("projectName", "Software Project")
    requirements = data.get("requirements", [])

    if not doc_type:
        return jsonify({"error": "Document type is required"}), 400

    if doc_type == "Software Contract":
        prompt = f"""
Generate a professional Software Contract for this QA software project.

Project Name: {project_name}

Requirements:
{requirements}

The contract MUST include:

1. Parties Involved
   - Client
   - Service Provider / Development Team

2. Definitions
   - Definitions of important terms used throughout the contract.

3. Project Scope
   - In-scope features
   - Out-of-scope features

4. Functional Requirements

5. Non-Functional Requirements

6. Software Testing Terms
   - Testing Objectives
   - Testing Scope
   - Testing Methodologies (Boundary Value Analysis, Equivalence Partitioning, Decision Table, State Transition, etc.)
   - Test Environment
   - Test Deliverables
   - Defect Management Process
   - Entry Criteria
   - Exit Criteria
   - User Acceptance Testing (UAT)

7. Deliverables
   - Source Code
   - Documentation
   - Test Cases
   - Test Reports
   - QA Reports
   - User Manual (if applicable)

8. Acceptance Criteria

9. Timeline and Milestones

10. Roles and Responsibilities

11. Change Request Policy

12. Risk Management
    - Project Risks
    - Mitigation Strategies

13. Confidentiality

14. Intellectual Property Rights

15. Payment / Compensation Terms

16. Warranty / Support

17. Service Level Commitments
    - Response Time
    - Resolution Time
    - Support Availability

18. Limitations of Liability

19. Dispute Resolution
    - Governing Law
    - Mediation / Arbitration

20. Termination Clause

21. Force Majeure

22. Sign-off Section
    - Client Signature
    - Service Provider Signature
    - Date

Write in clean Markdown format.
Use formal legal/business language.
"""

    elif doc_type == "Project Proposal":
        prompt = f"""
Generate a professional Project Proposal for this QA software project.

Project Name: {project_name}

Requirements:
{requirements}

The proposal MUST include:
1. Executive Summary
2. Problem Statement
3. Proposed Solution
4. Project Objectives
5. Scope of Work
6. Deliverables
7. QA Methodology
8. Timeline
9. Required Resources
10. Risks and Mitigation
11. Expected Benefits
12. Conclusion

Write in clean Markdown format.
"""

    elif doc_type == "SLA":
        prompt = f"""
Generate a professional Service Level Agreement (SLA) for this QA software project.

Project Name: {project_name}

Requirements:
{requirements}

The SLA MUST include:
1. Service Overview
2. Scope of Services
3. Service Availability
4. Response Times
5. Resolution Times
6. Support Responsibilities
7. QA Responsibilities
8. Performance Metrics
9. Escalation Process
10. Reporting
11. Exclusions
12. Review and Termination

Write in clean Markdown format.
"""

    else:
        return jsonify({"error": "Invalid document type"}), 400

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return jsonify({
            "title": doc_type,
            "content": response.text
        }), 200

    except Exception as e:
     error_text = str(e)
    print(f"Document generation error: {error_text}")

    if "429" in error_text or "RESOURCE_EXHAUSTED" in error_text:
        return jsonify({
            "error": "AI quota exceeded. Please try again later or use another API key."
        }), 429

    if "503" in error_text or "UNAVAILABLE" in error_text:
        return jsonify({
            "error": "Gemini is currently busy. Please try again in a few seconds."
        }), 503

    return jsonify({
        "error": "Failed to generate document."
    }), 500



@app.route("/extract-requirements", methods=["POST", "OPTIONS"])
@token_required
def extract_requirements(payload):
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    uploaded_file = request.files["file"]
    filename = uploaded_file.filename.lower()

    extracted_text = ""

    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(uploaded_file)
            for page in reader.pages:
                extracted_text += page.extract_text() or ""

        elif filename.endswith(".docx"):
            document = Document(uploaded_file)
            extracted_text = "\n".join([p.text for p in document.paragraphs])

        elif filename.endswith(".txt"):
            extracted_text = uploaded_file.read().decode("utf-8", errors="ignore")

        else:
            return jsonify({"error": "Unsupported file type"}), 400

        if not extracted_text.strip():
            return jsonify({"error": "Could not extract text from file"}), 400

        prompt = f"""
Extract real software requirements from the following document text.

Document:
{extracted_text}

Return ONLY valid JSON in this format:
[
  {{
    "title": "Requirement title",
    "content": "Full requirement description"
  }}
]

Rules:
- Do not invent requirements.
- Extract only requirements that appear in the document.
- Make each requirement clear and testable.
- Maximum 10 requirements.
"""

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        cleaned = response.text.strip()

        if cleaned.startswith("```json"):
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()
        elif cleaned.startswith("```"):
            cleaned = cleaned.replace("```", "").strip()

        requirements = json.loads(cleaned)

        return jsonify({"requirements": requirements}), 200

    except Exception as e:
        print(f"Requirement extraction error: {e}")
        return jsonify({"error": "Failed to extract requirements"}), 500


@app.route("/api/verify_token", methods=["POST"])
def api_verify_token():
    data = request.json
    token = data.get("token")
    if not token:
        return jsonify({"valid": False, "message": "Token missing"}), 400

    try:
        # Changed this line to remove the 'secure_auth.' prefix
        payload = verify_token(token)
        return jsonify({"valid": True, "payload": payload})
    except Exception as e:
        return jsonify({"valid": False, "message": str(e)}), 401


# ----------------------------------------------------------
# Run server
# ----------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
