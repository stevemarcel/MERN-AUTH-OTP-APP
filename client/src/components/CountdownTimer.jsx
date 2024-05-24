import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CountdownTimer = ({ duration }) => {
  const [remainingTime, setRemainingTime] = useState(duration * 60); // Convert to seconds

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, [duration, setRemainingTime, remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
};

CountdownTimer.propTypes = {
  duration: PropTypes.string,
};

export default CountdownTimer;
