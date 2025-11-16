// Razorpay payment integration utilities

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (planDetails, userDetails) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add to .env file
    amount: planDetails.price * 100, // Amount in paisa
    currency: 'INR',
    name: 'ExamHub',
    description: `${planDetails.name} Subscription`,
    image: '/logo.png', // Add your logo

    handler: async function (response) {
      // Handle successful payment
      try {
        await handlePaymentSuccess(response, planDetails, userDetails);
      } catch (error) {
        console.error('Payment success handling error:', error);
        alert('Payment successful but subscription update failed. Please contact support.');
      }
    },

    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.phone,
    },

    theme: {
      color: '#6366f1', // Indigo color to match theme
    },

    modal: {
      ondismiss: function() {
        console.log('Payment modal dismissed');
      }
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

// Handle successful payment
const handlePaymentSuccess = async (response, planDetails, userDetails) => {
  try {
    // Here you would typically:
    // 1. Verify payment with your backend
    // 2. Update user subscription in Firestore
    // 3. Send confirmation email

    console.log('Payment successful:', response);
    console.log('Plan details:', planDetails);
    console.log('User details:', userDetails);

    // For demo purposes, we'll simulate the subscription update
    // In production, this should be done via your backend API

    // Calculate subscription expiry date
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + planDetails.duration);

    // Simulate updating user subscription in Firestore
    // In real implementation, this would be done via backend API
    const subscriptionData = {
      subscriptionType: 'premium',
      subscriptionExpiry: expiryDate.toISOString(),
      planName: planDetails.name,
      paymentId: response.razorpay_payment_id,
      amount: planDetails.price,
      currency: 'INR',
      purchasedAt: new Date().toISOString(),
    };

    console.log('Subscription data to update:', subscriptionData);

    alert(`Payment successful! 🎉\n\nPlan: ${planDetails.name}\nAmount: ₹${planDetails.price}\nPayment ID: ${response.razorpay_payment_id}\n\nYour premium subscription will be activated shortly.`);

    // Redirect to dashboard (in real implementation, this would happen after backend confirmation)
    window.location.href = '/student-dashboard';

  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
};

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Subscription plans configuration
export const subscriptionPlans = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 199,
    duration: 1,
    durationUnit: 'month'
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly',
    price: 499,
    duration: 3,
    durationUnit: 'month'
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    price: 1599,
    duration: 12,
    durationUnit: 'month'
  }
};
