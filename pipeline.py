#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pipeline to run data collection, analysis, and transformation in sequence.
Includes automatic git commit and push of results.
"""

import subprocess
import sys
import time
from datetime import datetime

def run_script(script_name: str, description: str) -> bool:
    """
    Run a Python script and return True if successful, False otherwise.
    """
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Script: {script_name}")
    print(f"{'='*60}\n")
    
    start_time = time.time()
    
    try:
        # Run the script using the same Python interpreter
        result = subprocess.run(
            [sys.executable, script_name],
            check=True,
            capture_output=False,  # Show output in real-time
            text=True
        )
        
        elapsed = time.time() - start_time
        print(f"\n✓ {description} completed successfully in {elapsed:.2f} seconds")
        return True
        
    except subprocess.CalledProcessError as e:
        elapsed = time.time() - start_time
        print(f"\n✗ {description} failed after {elapsed:.2f} seconds")
        print(f"Error code: {e.returncode}")
        return False
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"\n✗ {description} failed after {elapsed:.2f} seconds")
        print(f"Error: {type(e).__name__}: {e}")
        return False


def run_git_command(command: list, description: str) -> bool:
    """
    Run a git command and return True if successful, False otherwise.
    """
    print(f"\n→ {description}...")
    
    try:
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True
        )
        
        if result.stdout.strip():
            print(f"  {result.stdout.strip()}")
        
        print(f"✓ {description} completed")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed")
        print(f"Error: {e.stderr.strip() if e.stderr else e.stdout.strip()}")
        return False
    except Exception as e:
        print(f"✗ {description} failed")
        print(f"Error: {type(e).__name__}: {e}")
        return False


def git_commit_and_push() -> bool:
    """
    Add, commit, and push changes to git.
    """
    print(f"\n{'='*60}")
    print("Step 4: Git Commit and Push")
    print(f"{'='*60}\n")
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Data pipeline update - {timestamp}"
    
    # Check if there are any changes
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            check=True,
            capture_output=True,
            text=True
        )
        
        if not result.stdout.strip():
            print("No changes to commit - repository is clean")
            return True
            
    except Exception as e:
        print(f"Warning: Could not check git status: {e}")
    
    # Git add
    if not run_git_command(["git", "add", "."], "Adding files to git"):
        return False
    
    # Git commit
    if not run_git_command(["git", "commit", "-m", commit_message], "Committing changes"):
        return False
    
    # Git push
    if not run_git_command(["git", "push"], "Pushing to remote repository"):
        return False
    
    print(f"\n✓ Git operations completed successfully")
    return True


def main():
    """
    Run the complete data pipeline in sequence:
    1. Scrape data from website
    2. Analyze and label data
    3. Transform data for frontend
    """
    start_time = time.time()
    
    print("\n" + "="*60)
    print("NATURALIZATION REACTIONS DATA PIPELINE")
    print("="*60)
    
    # Define the pipeline steps
    steps = [
        ("main_batched.py", "Step 1: Data Collection (Web Scraping)"),
        ("analytics.py", "Step 2: Data Analysis (AI Labeling)"),
        ("transform_data.py", "Step 3: Data Transformation (Frontend Prep)")
    ]
    
    # Track success/failure
    completed_steps = []
    failed_step = None
    
    # Run each step in sequence
    for script, description in steps:
        success = run_script(script, description)
        
        if success:
            completed_steps.append(description)
        else:
            failed_step = description
            break
    
    # Summary
    total_time = time.time() - start_time
    print("\n" + "="*60)
    print("PIPELINE SUMMARY")
    print("="*60)
    
    if failed_step:
        print(f"\n✗ Pipeline FAILED at: {failed_step}")
        print(f"\nCompleted steps ({len(completed_steps)}/{len(steps)}):")
        for step in completed_steps:
            print(f"  ✓ {step}")
        print(f"\nTotal time: {total_time:.2f} seconds")
        sys.exit(1)
    else:
        print(f"\n✓ All data processing steps completed successfully!")
        print(f"\nCompleted steps ({len(steps)}/{len(steps)}):")
        for step in completed_steps:
            print(f"  ✓ {step}")
        
        # Run git operations
        git_success = git_commit_and_push()
        
        if git_success:
            completed_steps.append("Git Commit and Push")
        
        # Final summary
        total_time = time.time() - start_time
        print("\n" + "="*60)
        print("FINAL SUMMARY")
        print("="*60)
        
        if git_success:
            print(f"\n✓ Complete pipeline finished successfully!")
            print(f"\nAll steps completed ({len(completed_steps)}/{len(steps) + 1}):")
            for step in completed_steps:
                print(f"  ✓ {step}")
            print(f"\nTotal time: {total_time:.2f} seconds")
            print("\nOutput file ready: frontend/public/natur_reacties.csv")
            print("Changes committed and pushed to git repository")
            sys.exit(0)
        else:
            print(f"\n⚠ Data processing succeeded but git operations failed")
            print(f"\nTotal time: {total_time:.2f} seconds")
            print("\nOutput file ready: frontend/public/natur_reacties.csv")
            print("Please commit and push changes manually")
            sys.exit(1)


if __name__ == "__main__":
    main()
