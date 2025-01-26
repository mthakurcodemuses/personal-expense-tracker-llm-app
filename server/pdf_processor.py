import sys
import json
from typing import List, Dict
from pathlib import Path
import pytesseract
from PIL import Image
from pypdf import PdfReader
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain.llms import OpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Expense(BaseModel):
    date: str = Field(description="Date of the transaction")
    amount: float = Field(description="Amount in GBP")
    category: str = Field(description="Category of expense (e.g., Groceries, Transportation)")
    merchant: str = Field(description="Name of the merchant")
    description: str = Field(description="Transaction description")

class ExpenseList(BaseModel):
    expenses: List[Expense]

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF using PyPDF and OCR if needed."""
    reader = PdfReader(pdf_path)
    text = ""
    
    for page in reader.pages:
        # Try to extract text directly
        page_text = page.extract_text()
        
        # If no text found, try OCR
        if not page_text.strip():
            # Convert PDF page to image for OCR
            # This is a simplified version - might need enhancement for production
            image = page.to_image()
            page_text = pytesseract.image_to_string(image)
            
        text += page_text + "\n"
    
    return text

def parse_expenses(text: str) -> List[Dict]:
    """Use LangChain to parse expenses from text."""
    parser = PydanticOutputParser(pydantic_object=ExpenseList)
    
    prompt = PromptTemplate(
        template="""Extract expense information from the following bank statement text. 
        Categorize each transaction into one of these categories: Groceries, Transportation, Dining Out, Shopping, Entertainment.
        For common UK merchants:
        - Tesco, Sainsbury's, Marks & Spencer are Groceries
        - Trainline, easyJet, British Airways are Transportation
        
        Text: {text}
        
        {format_instructions}
        """,
        input_variables=["text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

    # Initialize OpenAI with API key from environment
    llm = OpenAI(temperature=0)
    
    # Generate the structured data
    _input = prompt.format(text=text)
    output = llm.predict(_input)
    
    # Parse the output
    parsed_expenses = parser.parse(output)
    return parsed_expenses.expenses

def main(pdf_path: str):
    try:
        # Extract text from PDF
        text = extract_text_from_pdf(pdf_path)
        
        # Parse expenses using LangChain
        expenses = parse_expenses(text)
        
        # Print JSON output to stdout
        print(json.dumps([expense.dict() for expense in expenses]))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python pdf_processor.py <pdf_path>", file=sys.stderr)
        sys.exit(1)
    
    main(sys.argv[1])
