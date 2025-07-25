from backend.db import db

class Contract(db.Model):
    __tablename__ = 'contracts'
    
    id = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    contract_expiry = db.Column(db.Date, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'contract_expiry': self.contract_expiry.strftime('%Y-%m-%d') if self.contract_expiry else None
        }