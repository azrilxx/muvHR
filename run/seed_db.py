#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from datetime import datetime
from backend.models.contract import Contract
from backend.db import db
from backend.app import app

def seed_contracts():
    """Seed the database with contract data from mock data"""
    
    # Mock contract data to seed
    mock_contractors = [
        {"id": "C001", "name": "John Smith", "position": "Senior Developer", "contract_expiry": "2025-08-15"},
        {"id": "C002", "name": "Sarah Johnson", "position": "UX Designer", "contract_expiry": "2025-07-30"},
        {"id": "C003", "name": "Mike Davis", "position": "DevOps Engineer", "contract_expiry": "2025-09-12"},
        {"id": "C004", "name": "Lisa Chen", "position": "Project Manager", "contract_expiry": "2025-06-05"},
        {"id": "C005", "name": "Alex Rodriguez", "position": "Marketing Specialist", "contract_expiry": "2025-10-20"}
    ]
    
    with app.app_context():
        # Clear existing contracts
        Contract.query.delete()
        
        # Add new contracts
        for contractor_data in mock_contractors:
            contract = Contract(
                id=contractor_data['id'],
                name=contractor_data['name'],
                position=contractor_data['position'],
                contract_expiry=datetime.strptime(contractor_data['contract_expiry'], "%Y-%m-%d").date()
            )
            db.session.add(contract)
        
        # Commit all changes
        db.session.commit()
        print(f"Successfully seeded {len(mock_contractors)} contracts to the database!")

if __name__ == '__main__':
    seed_contracts()