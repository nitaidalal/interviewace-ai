let scriptPromise = null;

const loadRazorpay = () => {
  // Razorpay SDK is already available
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  // Avoid loading the same script multiple times
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      if (window.Razorpay) {
        resolve(true);
      } else {
        script.remove();
        scriptPromise = null;
        resolve(false);
      }
    };

    script.onerror = () => {
      script.remove();
      scriptPromise = null;
      resolve(false);
    };

    document.body.appendChild(script);
  });

  return scriptPromise;
};

export default loadRazorpay;
