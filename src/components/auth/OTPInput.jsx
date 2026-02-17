function OTPInput({ otp, setOtp }) {
  return (
    <input
      type="text"
      maxLength={6}
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className="w-full p-2 border rounded text-center tracking-widest"
      placeholder="Enter 6-digit OTP"
    />
  );
}

export default OTPInput;
