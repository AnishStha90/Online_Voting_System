import { useEffect, useRef, useState } from "react";
import "../App.css"; // optional: style inputs

const OtpInput = ({ length = 4, onOtpSubmit = () => {} }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only last digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if filled
    if (newOtp.every((digit) => digit !== "")) {
      onOtpSubmit(newOtp.join(""));
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);

    // Optionally redirect to first empty box
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="otp-container">
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(el) => (inputRefs.current[index] = el)}
          value={value}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="otp-input"
        />
      ))}
    </div>
  );
};

export default OtpInput;
