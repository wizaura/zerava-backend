export function bookingConfirmationTemplate(data: {
  name: string;
  reference: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  price: number;
}) {
  return `
    <h2>Booking Confirmed 🚗</h2>
    <p>Hi ${data.name},</p>

    <p>Your booking has been successfully placed.</p>

    <ul>
      <li><b>Reference:</b> ${data.reference}</li>
      <li><b>Date:</b> ${data.date}</li>
      <li><b>Time:</b> ${data.timeFrom} – ${data.timeTo}</li>
      <li><b>Amount:</b> £${data.price}</li>
    </ul>

    <p>We'll see you soon!</p>
    <p><b>Zerava Mobility</b></p>
  `;
}

export function otpTemplate(data: {
  otp: string;
  purpose: "LOGIN" | "ADMIN_LOGIN";
}) {
  const title =
    data.purpose === "ADMIN_LOGIN"
      ? "Admin Login OTP"
      : "Your Login OTP";

  return `
    <h2>${title}</h2>
    <p>Your one-time password is:</p>
    <h1 style="letter-spacing:4px">${data.otp}</h1>
    <p>This OTP is valid for <b>5 minutes</b>.</p>
    <p>If you did not request this, please ignore.</p>
  `;
}


export function paymentSuccessTemplate(data: {
  name: string;
  reference: string;
  amount: number;
}) {
  return `
    <h2>Payment Successful ✅</h2>
    <p>Hi ${data.name},</p>
    <p>We’ve received your payment.</p>

    <ul>
      <li><b>Booking Ref:</b> ${data.reference}</li>
      <li><b>Amount Paid:</b> £${data.amount}</li>
    </ul>

    <p>Thank you for choosing Zerava Mobility.</p>
  `;
}
