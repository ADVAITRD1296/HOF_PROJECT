import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.utils.pdf_generator import create_legal_pdf

def test_pdf_gen():
    sample_text = """
    FIRST INFORMATION REPORT (FIR)
    
    To,
    The Officer-in-Charge,
    Police Station: Delhi
    
    Complainant: Rahul Sharma
    Description: Theft of wallet near Rohini.
    Date: 15th April 2024
    
    This is a professional legal document generated for testing the PDF system.
    """
    
    print("--- Testing PDF Generation ---")
    try:
        pdf_stream = create_legal_pdf(sample_text)
        with open("scratch/test_legal_doc.pdf", "wb") as f:
            f.write(pdf_stream.getbuffer())
        print("SUCCESS: PDF saved to scratch/test_legal_doc.pdf")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test_pdf_gen()
