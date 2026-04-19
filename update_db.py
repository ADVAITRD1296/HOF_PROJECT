#!/usr/bin/env python3
"""
LexisCo — Database Update Utility
A seamless CLI to ingest or update legal documents in the Supabase Vector Database.
"""

import sys
import os
import argparse
import subprocess
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(
        description="⚖️  LexisCo DB Updater: Seamlessly add or update laws in the database."
    )
    parser.add_argument(
        "-f", "--file", 
        type=str, 
        required=True,
        help="Path to the legal document (e.g. data/raw/new_law.txt)"
    )
    parser.add_argument(
        "-a", "--act-name", 
        type=str,
        help="Official name of the Act. If not provided, it will be inferred from the filename."
    )
    
    args = parser.parse_args()
    
    file_path = Path(args.file)
    if not file_path.exists():
        print(f"❌ Error: File not found exactly at '{file_path}'.")
        print("💡 Hint: Ensure the path is correct relative to the root directory.")
        sys.exit(1)
        
    print(f"🚀 Starting update process for: {file_path.name}")
    if args.act_name:
        print(f"📖 Act Name: {args.act_name}")
    else:
        print(f"📖 Act Name (inferred): {file_path.stem.replace('_', ' ').title()}")
        
    # Get to the rag_engine folder to run the ingest script
    root_dir = Path(__file__).resolve().parent
    ingest_script = root_dir / "rag_engine" / "ingestion" / "ingest.py"
    
    if not ingest_script.exists():
        print(f"❌ Error: Could not find ingestion script at {ingest_script}")
        sys.exit(1)
        
    cmd = [
        sys.executable,
        str(ingest_script),
        "--file", str(file_path.resolve())
    ]
    
    if args.act_name:
        cmd.extend(["--act-name", args.act_name])
        
    # To run the script nicely, we set the PYTHONPATH to include the root dir if necessary
    # But usually, it handles its own paths. Let's run it.
    env = os.environ.copy()
    env["PYTHONPATH"] = str(root_dir)
    
    print("\n---------------------------------------------------------")
    print("⏳ Executing LLM Embedding Pipeline... (This may take a moment)")
    print("---------------------------------------------------------\n")
    
    try:
        process = subprocess.run(
            cmd,
            env=env,
            check=True
        )
        print("\n✅ Update Completed Successfully! The database is now ready.")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error: The ingestion pipeline failed with exit code {e.returncode}.")
        sys.exit(e.returncode)

if __name__ == "__main__":
    main()
