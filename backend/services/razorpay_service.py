import razorpay
from backend.core.config import settings
import hmac
import hashlib

class RazorpayService:
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    def create_order(self, amount_inr: int, receipt: str):
        # Razorpay expects amount in paise
        data = {
            "amount": amount_inr * 100,
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1 # Auto capture
        }
        return self.client.order.create(data=data)

    def verify_signature(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str):
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        try:
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except Exception:
            return False

    def verify_webhook_signature(self, payload: bytes, signature: str):
        try:
            self.client.utility.verify_webhook_signature(payload, signature, settings.RAZORPAY_WEBHOOK_SECRET)
            return True
        except Exception:
            return False

razorpay_service = RazorpayService()
